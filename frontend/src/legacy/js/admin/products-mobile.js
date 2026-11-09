document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("productsMobileMenuToggle");
    const sidebar = document.querySelector(".admin-products-page .admin-sidebar");

    if (!toggle || !sidebar) {
        return;
    }

    const setMenuOpen = open => {
        sidebar.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Đóng menu quản trị" : "Mở menu quản trị");
    };

    setMenuOpen(false);

    toggle.addEventListener("click", () => {
        setMenuOpen(!sidebar.classList.contains("is-open"));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
            setMenuOpen(false);
            toggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800 && sidebar.classList.contains("is-open")) {
            setMenuOpen(false);
        }
    });
});
