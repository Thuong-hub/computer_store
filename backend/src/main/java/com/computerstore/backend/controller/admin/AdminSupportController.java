package com.computerstore.backend.controller.admin;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.computerstore.backend.dto.request.SupportSendRequest;
import com.computerstore.backend.dto.response.SupportConversationResponse;
import com.computerstore.backend.dto.response.SupportMessageResponse;
import com.computerstore.backend.service.support.SupportChatService;

@RestController
@RequestMapping("/api/admin/support")
public class AdminSupportController {

    private final SupportChatService support;

    public AdminSupportController(SupportChatService support) {
        this.support = support;
    }

    @GetMapping("/conversations")
    public List<SupportConversationResponse> conversations() {
        return support.adminConversations();
    }

    @GetMapping("/conversations/{id}/messages")
    public List<SupportMessageResponse> messages(@PathVariable Long id,
                                                   @RequestParam(defaultValue = "0") long afterId) {
        return support.adminMessages(id, Math.max(0, afterId));
    }

    @PutMapping("/conversations/{id}/read")
    public void markRead(@PathVariable Long id) {
        support.markAdminRead(id);
    }

    @PostMapping("/conversations/{id}/messages")
    public SupportMessageResponse reply(@PathVariable Long id,
                                        @RequestBody SupportSendRequest request) {
        return support.sendAdmin(id, request.getContent());
    }
}
