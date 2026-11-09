document.addEventListener("DOMContentLoaded", () => {
    const api = window.api;
    const ui = window.csAdmin;
    const byId = id => document.getElementById(id);
    const tbody = byId("invBody");
    const panel = byId("inventoryAdjustPanel");
    const form = byId("adjustForm");
    const submitButton = byId("adjustSubmit");
    const errorBox = byId("adjustError");
    const historyBody = byId("invHistory");
    let products = [];
    let selected = null;
    let saving = false;
    let linkedProductId = new URLSearchParams(window.location.search).get("productId");

    const mandatoryIds = [
        "invBody", "invHistory", "inventoryHistoryError", "invSearch", "invFilter", "invProducts",
        "invUnits", "invValue", "invLow", "invReload",
        "inventoryAdjustPanel", "adjustForm", "adjustSubmit", "adjustError",
        "adjustClose", "adjustMode", "adjustQty", "adjustNote",
        "adjustPreview", "adjustCurrentStock", "adjustProduct"
    ];
    const missing = mandatoryIds.filter(id => !byId(id));
    if (!api?.request || !ui || missing.length) {
        const detail = missing.length ? `Thiếu thành phần: ${missing.join(", ")}.` : "Chưa tải được api.js hoặc admin-enhancements.js.";
        const message = `Giao diện Tổng kho không đồng bộ. ${detail} Hãy sao chép đầy đủ admin-inventory.html, admin-inventory.js và tải lại trang.`;
        console.error(message);
        if (tbody) tbody.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
        const messageEl = byId("pageMessage");
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = "enh-message error";
        }
        return;
    }

    const renderMessage = (text, success = false) => ui.message(text, success);
    const asStock = value => Number.isInteger(Number(value)) ? Number(value) : 0;

    function render() {
        const search = byId("invSearch").value.trim().toLocaleLowerCase("vi");
        const filter = byId("invFilter").value;
        const visible = products.filter(product => {
            const stock = asStock(product.stockQuantity);
            return String(product.name || "").toLocaleLowerCase("vi").includes(search)
                && (filter === "all" || (filter === "low" && stock <= 5)
                    || (filter === "empty" && stock === 0));
        });

        tbody.innerHTML = visible.length ? visible.map(product => {
            const id = Number(product.productId);
            const stock = asStock(product.stockQuantity);
            return `<tr class="inventory-row">
                <td class="inventory-cell-id" data-label="Mã">#${id}</td>
                <td class="inventory-cell-product" data-label="Sản phẩm"><strong>${ui.escape(product.name)}</strong></td>
                <td class="inventory-cell-price" data-label="Giá bán">${ui.money(product.price)}</td>
                <td class="inventory-cell-stock" data-label="Tồn kho"><span class="enh-stock ${stock <= 5 ? "low" : ""}">${stock}</span></td>
                <td class="inventory-cell-status" data-label="Trạng thái">${ui.escape(product.status)}</td>
                <td class="inventory-cell-action" data-label="Thao tác"><button class="enh-btn small" type="button" data-inventory-id="${id}" aria-label="Nhập hoặc xuất kho ${ui.escape(product.name)}">Nhập / xuất</button></td>
            </tr>`;
        }).join("") : '<tr class="enh-empty-row"><td colspan="6">Không có sản phẩm phù hợp.</td></tr>';
    }

    async function loadInventory() {
        try {
            const data = await api.request("/api/admin/inventory");
            products = Array.isArray(data.products) ? data.products : [];
            byId("invProducts").textContent = data.totalProducts ?? products.length;
            byId("invUnits").textContent = Number(data.totalUnits || 0).toLocaleString("vi-VN");
            byId("invValue").textContent = ui.money(data.inventoryRetailValue);
            byId("invLow").textContent = data.lowStockProducts ?? 0;
            if (selected) {
                selected = products.find(p => Number(p.productId) === Number(selected.productId)) || null;
                if (selected) {
                    updateProductHeading();
                    updatePreview();
                } else {
                    closeEditor();
                }
            }
            render();
            if (linkedProductId !== null) {
                const requestedProductId = Number(linkedProductId);
                linkedProductId = null;
                if (Number.isSafeInteger(requestedProductId) && requestedProductId > 0) {
                    openEditor(requestedProductId);
                }
            }
        } catch (err) {
            const detail = err?.message || "Lỗi không xác định";
            tbody.innerHTML = `<tr class="enh-empty-row"><td colspan="6">Không tải được danh sách kho. Vui lòng kiểm tra kết nối/API và nhấn Làm mới.</td></tr>`;
            renderMessage(`Không lấy được danh sách kho: ${detail}`);
        }
    }

    async function loadHistory() {
        try {
            const rows = await api.request("/api/admin/inventory/movements");
            historyBody.innerHTML = Array.isArray(rows) && rows.length ? rows.map(entry => `<tr class="inventory-history-row">
                <td class="inventory-history-time" data-label="Thời điểm">${ui.date(entry.createdAt)}</td>
                <td class="inventory-history-product" data-label="Mã SP">#${ui.escape(entry.productId)}</td>
                <td class="inventory-history-action" data-label="Loại">${ui.escape(entry.action)}</td>
                <td class="inventory-history-delta ${entry.quantityDelta > 0 ? "enh-positive" : "enh-negative"}" data-label="Chênh lệch">${entry.quantityDelta > 0 ? "+" : ""}${ui.escape(entry.quantityDelta)}</td>
                <td class="inventory-history-quantity" data-label="Trước → Sau">${ui.escape(entry.quantityBefore)} → ${ui.escape(entry.quantityAfter)}</td>
                <td class="inventory-history-order" data-label="Đơn">${entry.orderId ? "#" + ui.escape(entry.orderId) : "—"}</td>
                <td class="inventory-history-note" data-label="Người thực hiện / Lý do">${ui.escape(entry.actor)} / ${ui.escape(entry.note)}</td>
            </tr>`).join("") : '<tr class="enh-empty-row"><td colspan="7">Chưa có lịch sử biến động kho.</td></tr>';
            byId("inventoryHistoryError").textContent = "";
        } catch (err) {
            historyBody.innerHTML = '<tr class="enh-empty-row"><td colspan="7">Không thể đọc nhật ký kho.</td></tr>';
            byId("inventoryHistoryError").textContent = `Lỗi tải lịch sử: ${err.message}. Hãy kiểm tra bảng inventory_movements đã được tạo trong MySQL.`;
        }
    }

    function updateProductHeading() {
        if (!selected) return;
        const stock = asStock(selected.stockQuantity);
        byId("adjustProduct").textContent = `${selected.name} (#${selected.productId})`;
        byId("adjustCurrentStock").textContent = stock.toLocaleString("vi-VN");
    }

    function updatePreview() {
        if (!selected) return;
        const mode = byId("adjustMode").value;
        const rawQty = byId("adjustQty").value;
        const qty = Number(rawQty);
        const before = asStock(selected.stockQuantity);
        const preview = byId("adjustPreview");
        if (!rawQty || !Number.isSafeInteger(qty) || qty < 0) {
            preview.textContent = "Nhập số lượng để xem tồn kho dự kiến.";
            preview.className = "enh-stock-preview";
            return;
        }
        const after = mode === "IN" ? before + qty : mode === "OUT" ? before - qty : qty;
        const invalid = after < 0 || after > 2147483647;
        preview.textContent = invalid
            ? "Không thể thực hiện: số lượng xuất vượt tồn kho hoặc số lượng không hợp lệ."
            : `Tồn kho dự kiến: ${before.toLocaleString("vi-VN")} → ${after.toLocaleString("vi-VN")} sản phẩm`;
        preview.className = `enh-stock-preview${invalid ? " invalid" : ""}`;
    }

    function openEditor(productId) {
        selected = products.find(product => Number(product.productId) === Number(productId)) || null;
        if (!selected) {
            renderMessage("Không tìm thấy sản phẩm. Vui lòng làm mới trang.");
            return;
        }
        form.reset();
        errorBox.textContent = "";
        updateProductHeading();
        updatePreview();
        panel.hidden = false;
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
        byId("adjustQty").focus({ preventScroll: true });
    }

    function closeEditor() {
        if (saving) return;
        selected = null;
        panel.hidden = true;
        form.reset();
        errorBox.textContent = "";
    }

    tbody.addEventListener("click", event => {
        const button = event.target.closest("button[data-inventory-id]");
        if (button) openEditor(button.dataset.inventoryId);
    });

    byId("adjustClose").addEventListener("click", closeEditor);
    byId("adjustMode").addEventListener("change", updatePreview);
    byId("adjustQty").addEventListener("input", updatePreview);
    byId("invSearch").addEventListener("input", render);
    byId("invFilter").addEventListener("change", render);
    byId("invReload").addEventListener("click", () => Promise.all([loadInventory(), loadHistory()]));

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (saving || !selected) return;
        const productId = Number(selected.productId);
        const mode = byId("adjustMode").value;
        const quantity = Number(byId("adjustQty").value);
        const note = byId("adjustNote").value.trim();
        const before = asStock(selected.stockQuantity);
        const result = mode === "IN" ? before + quantity : mode === "OUT" ? before - quantity : quantity;
        errorBox.textContent = "";

        if (!["IN", "OUT", "SET"].includes(mode)) {
            errorBox.textContent = "Thao tác không hợp lệ."; return;
        }
        if (!Number.isSafeInteger(quantity) || quantity < 0 || (mode !== "SET" && quantity === 0)) {
            errorBox.textContent = "Vui lòng nhập số lượng nguyên hợp lệ, lớn hơn 0 khi nhập/xuất."; return;
        }
        if (result < 0 || result > 2147483647) {
            errorBox.textContent = "Không thể xuất nhiều hơn số tồn hiện tại hoặc đặt số lượng vượt giới hạn."; return;
        }
        if (!note || note.length > 255) {
            errorBox.textContent = "Vui lòng ghi lý do (tối đa 255 ký tự)."; return;
        }

        saving = true;
        submitButton.disabled = true;
        submitButton.textContent = "Đang lưu...";
        byId("adjustClose").disabled = true;
        try {
            const response = await api.request(`/api/admin/inventory/${productId}/adjust`, {
                method: "POST", body: JSON.stringify({mode, quantity, note})
            });
            saving = false;
            submitButton.disabled = false;
            byId("adjustClose").disabled = false;
            submitButton.textContent = "Lưu kho";
            closeEditor();
            const actionName = mode === "IN" ? "Nhập kho" : mode === "OUT" ? "Xuất kho" : "Điều chỉnh kho";
            renderMessage(`${actionName} thành công cho sản phẩm #${productId}. Số lượng mới: ${response.stockQuantity}.`, true);
            await Promise.all([loadInventory(), loadHistory()]);
        } catch (err) {
            const original = err && err.message ? err.message : "Không rõ lỗi";
            errorBox.textContent = original.includes("500")
                ? `Không lưu được (HTTP 500). Kiểm tra log Spring Boot và bảng inventory_movements trong MySQL. Chi tiết: ${original}`
                : `Không lưu được: ${original}`;
            errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } finally {
            saving = false;
            submitButton.disabled = false;
            byId("adjustClose").disabled = false;
            submitButton.textContent = "Lưu kho";
        }
    });

    const menuToggle = byId("inventoryMenuToggle");
    const sidebar = byId("inventorySidebar");
    if (menuToggle && sidebar) {
        const setMenuOpen = open => {
            sidebar.classList.toggle("is-open", open);
            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute("aria-label", open ? "Đóng menu quản trị" : "Mở menu quản trị");
        };
        menuToggle.addEventListener("click", () => {
            setMenuOpen(!sidebar.classList.contains("is-open"));
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });
        document.addEventListener("click", event => {
            if (sidebar.classList.contains("is-open") && !sidebar.contains(event.target)) {
                setMenuOpen(false);
            }
        });
    }

    loadInventory();
    loadHistory();
});
