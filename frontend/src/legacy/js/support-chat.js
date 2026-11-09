(() => {
    const HOURS = "T2–T6: 07:00–18:00 · T7–CN: 08:00–16:00";
    let opened = false;
    let initialized = false;
    let afterId = 0;
    let polling = null;
    let loading = false;

    function localSupportOpen() {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Ho_Chi_Minh",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).formatToParts(new Date());
        const value = type => parts.find(item => item.type === type)?.value;
        const weekday = value("weekday");
        const minutes = Number(value("hour")) * 60 + Number(value("minute"));
        const weekend = weekday === "Sat" || weekday === "Sun";
        return weekend ? minutes >= 480 && minutes < 960 : minutes >= 420 && minutes < 1080;
    }

    function showError(message) {
        document.getElementById("supportError").textContent = message || "";
    }

    function appendMessage(message) {
        const thread = document.getElementById("supportMessages");
        if (thread.querySelector(`[data-message-id="${message.messageId}"]`)) {
            return;
        }
        const item = document.createElement("article");
        item.className = `support-message support-message-${String(message.sender || "SYSTEM").toLowerCase()}`;
        item.dataset.messageId = String(message.messageId);

        const content = document.createElement("p");
        content.textContent = message.content;
        item.appendChild(content);

        const time = document.createElement("time");
        const parsed = new Date(message.createdAt);
        time.textContent = Number.isNaN(parsed.getTime())
            ? ""
            : parsed.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        item.appendChild(time);

        thread.appendChild(item);
        afterId = Math.max(afterId, Number(message.messageId) || 0);
        thread.scrollTop = thread.scrollHeight;
    }

    async function refreshMessages() {
        if (!opened || !initialized || loading) {
            return;
        }
        loading = true;
        try {
            const list = await window.api.request(`/api/support/messages?afterId=${afterId}`);
            list.forEach(appendMessage);
            showError("");
        } catch (error) {
            showError(error.message || "Không thể kết nối hỗ trợ");
        } finally {
            loading = false;
        }
    }

    async function openChat() {
        let user = {};
        try {
            user = JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            user = {};
        }
        if (!window.api?.getToken() || !user.username) {
            window.location.href = `/pages/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        const panel = document.getElementById("supportPanel");
        opened = !opened;
        panel.hidden = !opened;
        document.getElementById("supportToggle").setAttribute("aria-expanded", String(opened));
        if (!opened) {
            clearInterval(polling);
            return;
        }

        document.getElementById("supportSchedule").textContent =
            `${localSupportOpen() ? "Đang trong giờ hỗ trợ" : "Ngoài giờ hỗ trợ – vẫn nhận tin nhắn"} · ${HOURS}`;

        if (!initialized) {
            try {
                await window.api.request("/api/support/conversation", { method: "POST" });
                initialized = true;
                await refreshMessages();
            } catch (error) {
                showError(error.message || "Không mở được chat");
            }
        }
        clearInterval(polling);
        polling = setInterval(refreshMessages, 4000);
        document.getElementById("supportInput").focus();
    }

    async function sendMessage(event) {
        event.preventDefault();
        if (!initialized) {
            showError("Chưa kết nối được hộp thoại");
            return;
        }
        const input = document.getElementById("supportInput");
        const content = input.value.trim();
        if (!content) {
            return;
        }
        const button = document.getElementById("supportSend");
        button.disabled = true;
        try {
            const result = await window.api.request("/api/support/messages", {
                method: "POST",
                body: JSON.stringify({ content })
            });
            input.value = "";
            appendMessage(result);
            await refreshMessages();
            showError("");
        } catch (error) {
            showError(error.message || "Không gửi được tin nhắn");
        } finally {
            button.disabled = false;
            input.focus();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!window.api || document.getElementById("supportChat")) {
            return;
        }
        const host = document.createElement("div");
        host.id = "supportChat";
        host.className = "support-chat";
        host.innerHTML = `
            <section class="support-panel" id="supportPanel" aria-label="Chat hỗ trợ ComputerStore" hidden>
                <header class="support-panel-head">
                    <div>
                        <strong>Hỗ trợ ComputerStore</strong>
                        <span>Nhắn trực tiếp cho nhân viên</span>
                    </div>
                    <button type="button" id="supportClose" aria-label="Đóng chat">×</button>
                </header>
                <p class="support-schedule" id="supportSchedule">${HOURS}</p>
                <div class="support-messages" id="supportMessages" role="log" aria-live="polite"></div>
                <p class="support-error" id="supportError" role="status"></p>
                <form id="supportForm" class="support-compose">
                    <input type="text" id="supportInput" maxlength="2000" required autocomplete="off" placeholder="Nhập tin nhắn cho Admin..." aria-label="Tin nhắn hỗ trợ">
                    <button type="submit" id="supportSend" aria-label="Gửi tin nhắn">➤</button>
                </form>
            </section>
            <button type="button" id="supportToggle" class="support-toggle" aria-controls="supportPanel" aria-expanded="false">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span>Chat hỗ trợ</span>
            </button>
        `;
        document.body.appendChild(host);
        document.getElementById("supportToggle").addEventListener("click", openChat);
        document.getElementById("supportClose").addEventListener("click", openChat);
        document.getElementById("supportForm").addEventListener("submit", sendMessage);
    });
})();
