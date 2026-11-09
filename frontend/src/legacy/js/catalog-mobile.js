document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("mobileFilterToggle");
    const sidebar = document.getElementById("productFilterSidebar");
    const close = document.getElementById("mobileFilterClose");

    if (!toggle || !sidebar) {
        return;
    }

    document.body.classList.add("catalog-enhanced");

    function setOpen(open) {
        sidebar.classList.toggle("mobile-filters-open", open);
        toggle.setAttribute("aria-expanded", String(open));

        if (open) {
            sidebar.scrollIntoView({ block: "nearest" });
        }
    }

    toggle.addEventListener("click", () => {
        setOpen(!sidebar.classList.contains("mobile-filters-open"));
    });

    close?.addEventListener("click", () => {
        setOpen(false);
        toggle.focus();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && sidebar.classList.contains("mobile-filters-open")) {
            setOpen(false);
            toggle.focus();
        }
    });

    window.matchMedia("(min-width: 761px)").addEventListener("change", event => {
        if (event.matches) {
            setOpen(false);
        }
    });
});
