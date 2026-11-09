let activeSupportConversation = null;
let supportLastMessageId = 0;
let supportLoading = false;

function supportSetError(message) {
    document.getElementById("supportAdminError").textContent = message || "";
}

function supportAppendMessage(message) {
    const thread = document.getElementById("supportAdminMessages");
    if (thread.querySelector(`[data-id="${message.messageId}"]`)) {
        return;
    }
    const bubble = document.createElement("article");
    bubble.className = `support-admin-bubble support-admin-bubble-${String(message.sender).toLowerCase()}`;
    bubble.dataset.id = String(message.messageId);
    const body = document.createElement("p");
    body.textContent = message.content;
    bubble.appendChild(body);
    const time = document.createElement("time");
    const date = new Date(message.createdAt);
    time.textContent = Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    bubble.appendChild(time);
    thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
    supportLastMessageId = Math.max(supportLastMessageId, Number(message.messageId) || 0);
}

async function supportLoadConversations() {
    try {
        const list = await window.api.request("/api/admin/support/conversations");
        const host = document.getElementById("supportConversationList");
        host.replaceChildren();
        if (!list.length) {
            host.textContent = "Chưa có tin nhắn từ khách hàng.";
            return;
        }
        for (const conversation of list) {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "support-admin-customer";
            if (conversation.conversationId === activeSupportConversation) {
                item.classList.add("active");
            }
            const name = document.createElement("strong");
            name.textContent = `${conversation.username} · ${conversation.customerCode || "Khách hàng"}`;
            if (conversation.unreadCount) {
                const badge = document.createElement("span");
                badge.className = "support-admin-unread";
                badge.textContent = `${conversation.unreadCount} mới`;
                name.appendChild(badge);
            }
            const email = document.createElement("small");
            email.textContent = conversation.email || "";
            item.append(name, email);
            item.addEventListener("click", () => supportOpenConversation(conversation));
            host.appendChild(item);
        }
    } catch (error) {
        supportSetError(error.message || "Không tải được cuộc trò chuyện");
    }
}

async function supportOpenConversation(conversation) {
    activeSupportConversation = conversation.conversationId;
    supportLastMessageId = 0;
    const thread = document.getElementById("supportAdminMessages");
    thread.replaceChildren();
    document.getElementById("supportCustomerHeader").textContent =
        `Đang trò chuyện: ${conversation.username} · ${conversation.customerCode || ""}`;
    document.getElementById("supportAdminInput").disabled = false;
    document.getElementById("supportAdminSend").disabled = false;
    await supportLoadMessages();
    await supportLoadConversations();
}

async function supportLoadMessages() {
    if (!activeSupportConversation || supportLoading) {
        return;
    }
    supportLoading = true;
    const requestConversation = activeSupportConversation;
    try {
        const list = await window.api.request(`/api/admin/support/conversations/${requestConversation}/messages?afterId=${supportLastMessageId}`);
        if (activeSupportConversation === requestConversation) {
            list.forEach(supportAppendMessage);
            await window.api.request(`/api/admin/support/conversations/${requestConversation}/read`, {
                method: "PUT"
            });
        }
        supportSetError("");
    } catch (error) {
        supportSetError(error.message || "Không tải được tin nhắn");
    } finally {
        supportLoading = false;
    }
}

async function supportReply(event) {
    event.preventDefault();
    if (!activeSupportConversation) {
        return;
    }
    const input = document.getElementById("supportAdminInput");
    const content = input.value.trim();
    if (!content) {
        return;
    }
    const button = document.getElementById("supportAdminSend");
    button.disabled = true;
    try {
        const result = await window.api.request(`/api/admin/support/conversations/${activeSupportConversation}/messages`, {
            method: "POST",
            body: JSON.stringify({ content })
        });
        input.value = "";
        supportAppendMessage(result);
        supportSetError("");
        await supportLoadConversations();
    } catch (error) {
        supportSetError(error.message || "Gửi phản hồi thất bại");
    } finally {
        button.disabled = false;
        input.focus();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let account = {};
    try {
        account = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        account = {};
    }
    if (!window.api?.getToken() || String(account.role).toUpperCase() !== "ADMIN") {
        location.href = "/pages/login.html";
        return;
    }
    const name = account.fullName || account.username || "Admin";
    document.getElementById("supportAdminName").textContent = name;
    document.getElementById("supportAdminAvatar").textContent = name.charAt(0).toUpperCase();
    document.getElementById("supportAdminLogout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        location.href = "/pages/login.html";
    });
    document.getElementById("supportAdminMenuToggle").addEventListener("click", () => {
        const sidebar = document.getElementById("supportAdminSidebar");
        const open = sidebar.classList.toggle("is-open");
        document.getElementById("supportAdminMenuToggle").setAttribute("aria-expanded", String(open));
    });
    document.getElementById("supportAdminRefresh").addEventListener("click", supportLoadConversations);
    document.getElementById("supportAdminForm").addEventListener("submit", supportReply);
    supportLoadConversations();
    setInterval(() => {
        supportLoadConversations();
        supportLoadMessages();
    }, 5000);
});
