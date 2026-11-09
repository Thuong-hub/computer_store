document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("verifyForm");
    const emailInput = document.getElementById("verifyEmail");
    const codeInput = document.getElementById("verifyCode");
    const message = document.getElementById("verifyMessage");
    const verifyButton = document.getElementById("verifyButton");
    const resendButton = document.getElementById("resendCodeButton");
    const query = new URLSearchParams(window.location.search);
    emailInput.value = query.get("email") || "";

    function show(text, success) {
        message.textContent = text;
        message.className = success ? "success" : "error";
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const email = emailInput.value.trim();
        const code = codeInput.value.trim();
        if (!/^[0-9]{6}$/.test(code)) {
            show("Vui lòng nhập đúng mã gồm 6 chữ số", false);
            return;
        }
        verifyButton.disabled = true;
        try {
            const result = await window.api.request("/api/auth/verify-email", {
                method: "POST",
                body: JSON.stringify({ email, code })
            });
            show(result.message || "Xác minh thành công", true);
            codeInput.disabled = true;
            resendButton.disabled = true;
            setTimeout(() => {
                window.location.href = "/pages/login.html";
            }, 1400);
        } catch (error) {
            show(error.message || "Không thể xác minh", false);
        } finally {
            verifyButton.disabled = false;
        }
    });

    resendButton.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        if (!email) {
            show("Vui lòng nhập email", false);
            return;
        }
        resendButton.disabled = true;
        try {
            const result = await window.api.request("/api/auth/resend-verification", {
                method: "POST",
                body: JSON.stringify({ email })
            });
            show(result.message || "Đã xử lý yêu cầu gửi lại mã", true);
        } catch (error) {
            show(error.message || "Chưa thể gửi lại mã", false);
        } finally {
            resendButton.disabled = false;
        }
    });
});
