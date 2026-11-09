(() => {
    const token = window.api.getToken();
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}
    if (!token || String(user.role || "").toUpperCase() !== "ADMIN") {
        location.replace("/pages/login.html"); return;
    }
    document.addEventListener("DOMContentLoaded", () => {
        const name = user.fullName || user.username || "Admin";
        document.getElementById("adminName").textContent = name;
        document.querySelector(".admin-avatar").textContent = name.charAt(0).toUpperCase();
        document.getElementById("adminLogoutButton").addEventListener("click", () => {
            localStorage.removeItem("token");localStorage.removeItem("user");
            location.href = "/pages/login.html";
        });
        document.querySelectorAll(".admin-menu a").forEach(a => {
            a.classList.toggle("active",a.pathname === location.pathname);
        });
    });
})();
window.csAdmin = {
    money: n => Number(n || 0).toLocaleString("vi-VN")+" ₫",
    date: value => value ? new Date(value).toLocaleString("vi-VN") : "—",
    escape: value => String(value == null ? "" : value).replace(/[&<>"']/g,
        c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    message: (txt,ok=false) => { const el=document.getElementById("pageMessage"); if(el) {el.textContent=txt;el.className='enh-message '+(ok?'ok':'error');} }
};
