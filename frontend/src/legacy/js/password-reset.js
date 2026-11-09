document.addEventListener("DOMContentLoaded", () => {
    const forgot = document.getElementById("forgotForm");
    const reset = document.getElementById("resetPasswordForm");
    const status = document.getElementById("resetMessage");
    const button = document.getElementById("resetButton");
    const message = (text,ok) => {
        status.textContent = text;
        status.className = "auth-message " + (ok ? "success" : "error");
    };
    async function send(endpoint,payload) {
        button.disabled = true;
        try {
            return await window.api.request(endpoint,{method:"POST",body:JSON.stringify(payload)});
        } finally {button.disabled = false;}
    }
    if (forgot) forgot.addEventListener("submit",async e => {
        e.preventDefault();
        try {
            const res = await send("/api/auth/forgot-password",{email:document.getElementById("email").value.trim()});
            message(res.message,true);
        } catch(err) { message(err.message || "Không gửi được email.",false); }
    });
    if (reset) {
        
        const url = new URL(location.href);
        const token = url.searchParams.get("token");
        if (token) history.replaceState(null,"","/pages/reset-password.html");
        if (!token) { message("Liên kết không hợp lệ. Hãy yêu cầu liên kết mới.",false);button.disabled = true; }
        reset.addEventListener("submit",async e => {
            e.preventDefault();
            const pass = document.getElementById("newPassword").value;
            const confirm = document.getElementById("confirmPassword").value;
            if (pass !== confirm) { message("Hai mật khẩu không khớp.",false);return; }
            try {
                const res = await send("/api/auth/reset-password",{token,newPassword:pass});
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                message((res?.message || "Đổi mật khẩu thành công.") + " Đang chuyển đến trang đăng nhập...", true);
                reset.reset();
                button.disabled = true;
                window.setTimeout(() => {
                    window.location.replace("/pages/login.html");
                }, 1800);
            } catch(err) { message(err.message || "Không thể đặt lại mật khẩu.",false); }
        });
    }
});
