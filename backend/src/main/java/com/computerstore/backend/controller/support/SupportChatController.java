package com.computerstore.backend.controller.support;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.computerstore.backend.dto.request.SupportSendRequest;
import com.computerstore.backend.dto.response.SupportConversationResponse;
import com.computerstore.backend.dto.response.SupportMessageResponse;
import com.computerstore.backend.service.support.SupportChatService;

@RestController
@RequestMapping("/api/support")
public class SupportChatController {

    private final SupportChatService support;

    public SupportChatController(SupportChatService support) {
        this.support = support;
    }

    @PostMapping("/conversation")
    public SupportConversationResponse conversation(Authentication authentication) {
        return support.getOrCreate(authentication.getName());
    }

    @GetMapping("/messages")
    public List<SupportMessageResponse> messages(Authentication authentication,
                                                   @RequestParam(defaultValue = "0") long afterId) {
        return support.userMessages(authentication.getName(), Math.max(0, afterId));
    }

    @PostMapping("/messages")
    public SupportMessageResponse send(Authentication authentication,
                                       @RequestBody SupportSendRequest request) {
        return support.sendUser(authentication.getName(), request.getContent());
    }
}
