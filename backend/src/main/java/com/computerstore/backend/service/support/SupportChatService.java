package com.computerstore.backend.service.support;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.computerstore.backend.dto.response.SupportConversationResponse;
import com.computerstore.backend.dto.response.SupportMessageResponse;
import com.computerstore.backend.entity.SupportConversation;
import com.computerstore.backend.entity.SupportMessage;
import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.SupportConversationRepository;
import com.computerstore.backend.repository.SupportMessageRepository;
import com.computerstore.backend.repository.UserRepository;

@Service
public class SupportChatService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final String GREETING = "ComputerStore xin chào! Bạn cần tư vấn sản phẩm, đơn hàng hay bảo hành ạ? Nhân viên sẽ phản hồi trong giờ hỗ trợ: Thứ 2–6 từ 07:00–18:00; Thứ 7 và Chủ nhật từ 08:00–16:00.";
    private static final String AWAY = "Hiện ngoài giờ hỗ trợ. ComputerStore đã nhận tin nhắn và sẽ trả lời trong ca làm việc tiếp theo. Giờ hỗ trợ: T2–T6 07:00–18:00, T7–CN 08:00–16:00.";

    private final SupportConversationRepository conversations;
    private final SupportMessageRepository messages;
    private final UserRepository users;

    public SupportChatService(SupportConversationRepository conversations,
                              SupportMessageRepository messages,
                              UserRepository users) {
        this.conversations = conversations;
        this.messages = messages;
        this.users = users;
    }

    @Transactional
    public SupportConversationResponse getOrCreate(String username) {
        User user = requireUser(username);
        SupportConversation chat = conversations.findByUserUserId(user.getUserId())
                .orElseGet(() -> {
                    SupportConversation created = new SupportConversation();
                    created.setUser(user);
                    SupportConversation saved = conversations.saveAndFlush(created);
                    saveMessage(saved, "SYSTEM", GREETING);
                    return saved;
                });
        return toConversation(chat);
    }

    @Transactional(readOnly = true)
    public List<SupportMessageResponse> userMessages(String username, long afterId) {
        User user = requireUser(username);
        SupportConversation chat = conversations.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa có cuộc trò chuyện"));
        return fetchMessages(chat.getConversationId(), afterId);
    }

    @Transactional
    public SupportMessageResponse sendUser(String username, String content) {
        SupportConversationResponse details = getOrCreate(username);
        SupportConversation chat = requireChat(details.conversationId());
        SupportMessage result = saveMessage(chat, "USER", normalize(content));
        LocalDateTime now = LocalDateTime.now(ZONE);
        if (!isSupportOnline(now) && !now.toLocalDate().equals(chat.getLastAwayNoticeDate())) {
            saveMessage(chat, "SYSTEM", AWAY);
            chat.setLastAwayNoticeDate(now.toLocalDate());
            conversations.save(chat);
        }
        return toMessage(result);
    }

    @Transactional(readOnly = true)
    public List<SupportConversationResponse> adminConversations() {
        List<SupportConversationResponse> result = new ArrayList<>();
        for (SupportConversation chat : conversations.findAllByOrderByLastMessageAtDesc()) {
            if ("ACTIVE".equalsIgnoreCase(chat.getUser().getStatus())) {
                result.add(toConversation(chat));
            }
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<SupportMessageResponse> adminMessages(Long conversationId, long afterId) {
        SupportConversation chat = requireChat(conversationId);
        return fetchMessages(chat.getConversationId(), afterId);
    }

    @Transactional
    public void markAdminRead(Long conversationId) {
        requireChat(conversationId);
        List<SupportMessage> unread = messages.findByConversationConversationIdAndSenderAndReadFalse(conversationId, "USER");
        for (SupportMessage message : unread) {
            message.setRead(true);
        }
    }

    @Transactional
    public SupportMessageResponse sendAdmin(Long conversationId, String content) {
        SupportConversation chat = requireChat(conversationId);
        return toMessage(saveMessage(chat, "ADMIN", normalize(content)));
    }

    private User requireUser(String username) {
        if (username == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Cần đăng nhập");
        }
        User user = users.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tài khoản không tồn tại"));
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản đã bị khóa");
        }
        return user;
    }

    private SupportConversation requireChat(Long conversationId) {
        return conversations.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuộc trò chuyện không tồn tại"));
    }

    private List<SupportMessageResponse> fetchMessages(Long id, long afterId) {
        List<SupportMessage> records;
        if (afterId > 0) {
            records = messages.findByConversationConversationIdAndMessageIdGreaterThanOrderByMessageIdAsc(id, afterId);
        } else {
            records = messages.findTop100ByConversationConversationIdOrderByMessageIdDesc(id);
            Collections.reverse(records);
        }
        return records.stream().map(this::toMessage).toList();
    }

    private String normalize(String content) {
        String value = content == null ? "" : content.strip();
        if (value.isEmpty() || value.length() > 2000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tin nhắn cần từ 1 đến 2000 ký tự");
        }
        return value;
    }

    private SupportMessage saveMessage(SupportConversation chat, String sender, String content) {
        SupportMessage message = new SupportMessage();
        message.setConversation(chat);
        message.setSender(sender);
        message.setContent(content);
        SupportMessage saved = messages.save(message);
        chat.setLastMessageAt(saved.getCreatedAt());
        conversations.save(chat);
        return saved;
    }

    private SupportMessageResponse toMessage(SupportMessage message) {
        return new SupportMessageResponse(message.getMessageId(), message.getSender(), message.getContent(), message.getCreatedAt());
    }

    private SupportConversationResponse toConversation(SupportConversation chat) {
        User user = chat.getUser();
        long unread = messages.countByConversationConversationIdAndSenderAndReadFalse(chat.getConversationId(), "USER");
        return new SupportConversationResponse(chat.getConversationId(), user.getUsername(), user.getCustomerCode(), user.getEmail(), chat.getLastMessageAt(), unread);
    }

    private boolean isSupportOnline(LocalDateTime time) {
        DayOfWeek day = time.getDayOfWeek();
        boolean weekend = day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
        LocalTime start = weekend ? LocalTime.of(8, 0) : LocalTime.of(7, 0);
        LocalTime end = weekend ? LocalTime.of(16, 0) : LocalTime.of(18, 0);
        return !time.toLocalTime().isBefore(start) && time.toLocalTime().isBefore(end);
    }
}
