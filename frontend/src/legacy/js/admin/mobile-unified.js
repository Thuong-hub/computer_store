document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".admin-sidebar");
    const logo = sidebar?.querySelector(".admin-logo");
    const menu = sidebar?.querySelector(".admin-menu");

    if (sidebar && logo && menu) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "admin-unified-menu-toggle";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", "adminUnifiedMenu");
        toggle.innerHTML = "<span aria-hidden=\"true\">☰</span> Menu";
        menu.id = "adminUnifiedMenu";
        logo.insertAdjacentElement("afterend", toggle);

        const setOpen = (open) => {
            sidebar.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.innerHTML = open
                ? "<span aria-hidden=\"true\">×</span> Đóng"
                : "<span aria-hidden=\"true\">☰</span> Menu";
        };

        toggle.addEventListener("click", () => {
            setOpen(!sidebar.classList.contains("is-open"));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setOpen(false));
        });
    }

    document.querySelectorAll(".admin-table, .enh-table").forEach((table) => {
        const headings = Array.from(table.querySelectorAll("thead th"))
            .map((cell) => cell.textContent.trim());
        const body = table.querySelector("tbody");

        if (!body || !headings.length) {
            return;
        }

        const labelRows = () => {
            Array.from(body.rows).forEach((row) => {
                const cells = Array.from(row.cells);
                if (cells.length === 1 && cells[0].colSpan > 1) {
                    cells[0].removeAttribute("data-label");
                    return;
                }

                cells.forEach((cell, index) => {
                    const heading = headings[index];
                    if (heading) {
                        cell.dataset.label = heading;
                    }
                });
            });
        };

        labelRows();
        const observer = new MutationObserver(labelRows);
        observer.observe(body, { childList: true });
    });
});
