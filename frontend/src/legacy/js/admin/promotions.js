let adminPromotions = [];
let currentPromotionFilter = "ALL";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }

        setupAdminProfile();
        setupLogout();
        setupPromotionFilters();
        setupPromotionSearch();
        setupPromotionModal();
        setupPromotionForm();

        await loadAdminPromotions();
        setupProductPromotionManagement();
        setupBlackFridayManagement();
        await loadProductPromotionManagement();
    }
);

function checkAdminAccess() {

    const token =
        window.api?.getToken
            ? window.api.getToken()
            : localStorage.getItem("token");

    if (!token) {

        window.location.href =
            "/pages/login.html";

        return false;
    }

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem("user")
            || "null"
        );

    } catch (error) {

        user = null;
    }

    const role =
        String(
            user?.role || ""
        )
            .trim()
            .toUpperCase();

    if (role !== "ADMIN") {

        window.location.href = "/";

        return false;
    }

    return true;
}

function setupAdminProfile() {

    const nameElement =
        document.getElementById(
            "adminName"
        );

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem("user")
            || "null"
        );

    } catch (error) {

        user = null;
    }

    if (!nameElement || !user) {
        return;
    }

    nameElement.textContent =
        user.fullName
        || user.username
        || "Admin";
}

function setupLogout() {

    const button =
        document.getElementById(
            "adminLogoutButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "/pages/login.html";
        }
    );
}

async function loadAdminPromotions() {

    const tbody =
        document.getElementById(
            "adminPromotionTableBody"
        );

    tbody.innerHTML = `
        <tr>
            <td
                colspan="9"
                class="admin-table-empty"
            >
                Đang tải khuyến mãi...
            </td>
        </tr>
    `;

    try {

        const response =
            await window.api
                .getAdminPromotions();

        adminPromotions =
            Array.isArray(response)
                ? response
                : [];

        renderAdminPromotions();

    } catch (error) {

        console.error(
            "Load promotions error:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="admin-table-empty"
                >
                    Không thể tải khuyến mãi.
                </td>
            </tr>
        `;

        showAdminMessage(
            error.message
            || "Không thể tải danh sách khuyến mãi.",
            "error"
        );
    }
}

function getFilteredPromotions() {

    const search =
        document
            .getElementById(
                "adminPromotionSearch"
            )
            .value
            .trim()
            .toLowerCase();

    const now = new Date();

    return adminPromotions.filter(
        promotion => {

            const status =
                normalizeStatus(
                    promotion.status
                );

            const endAt =
                promotion.endAt
                    ? new Date(
                        promotion.endAt
                    )
                    : null;

            const isExpired =
                endAt
                && !Number.isNaN(
                    endAt.getTime()
                )
                && endAt < now;

            let matchesFilter = true;

            if (
                currentPromotionFilter
                === "ACTIVE"
            ) {

                matchesFilter =
                    status === "ACTIVE"
                    && !isExpired;

            } else if (
                currentPromotionFilter
                === "INACTIVE"
            ) {

                matchesFilter =
                    status === "INACTIVE";

            } else if (
                currentPromotionFilter
                === "EXPIRED"
            ) {

                matchesFilter =
                    isExpired;
            }

            const haystack =
                [
                    promotion.code,
                    promotion.name,
                    promotion.description
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

            const matchesSearch =
                !search
                || haystack.includes(
                    search
                );

            return (
                matchesFilter
                && matchesSearch
            );
        }
    );
}

function renderAdminPromotions() {

    const tbody =
        document.getElementById(
            "adminPromotionTableBody"
        );

    const countElement =
        document.getElementById(
            "adminPromotionCount"
        );

    const promotions =
        getFilteredPromotions();

    countElement.textContent =
        `${promotions.length} khuyến mãi`;

    if (promotions.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="admin-table-empty"
                >
                    Không có khuyến mãi phù hợp.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        promotions
            .map(
                promotion =>
                    renderPromotionRow(
                        promotion
                    )
            )
            .join("");

    setupPromotionRowActions();
}

function renderPromotionRow(
    promotion
) {

    const status =
        normalizeStatus(
            promotion.status
        );

    const endAt =
        promotion.endAt
            ? new Date(
                promotion.endAt
            )
            : null;

    const isExpired =
        endAt
        && !Number.isNaN(
            endAt.getTime()
        )
        && endAt < new Date();

    let statusText =
        status === "ACTIVE"
            ? "Đang hoạt động"
            : "Đã tắt";

    let statusClass =
        status === "ACTIVE"
            ? "active"
            : "inactive";

    if (isExpired) {

        statusText = "Hết hạn";
        statusClass = "expired";
    }

    const nextStatus =
        status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

    const toggleText =
        status === "ACTIVE"
            ? "Tắt"
            : "Bật";

    const toggleClass =
        status === "ACTIVE"
            ? "deactivate"
            : "activate";

    return `
        <tr>

            <td>
                #${promotion.promotionId ?? ""}
            </td>

            <td>
                <span class="admin-promotion-code">
                    ${escapeHtml(
                        promotion.code || ""
                    )}
                </span>
            </td>

            <td>
                <div class="admin-promotion-name">

                    <strong>
                        ${escapeHtml(
                            promotion.name
                            || "-"
                        )}
                    </strong>

                    <span>
                        ${escapeHtml(
                            promotion.description
                            || "Không có mô tả"
                        )}
                    </span>

                </div>
            </td>

            <td>
                <strong class="admin-promotion-percent">
                    ${formatPercent(
                        promotion.discountPercent
                    )}
                </strong>
            </td>

            <td>
                ${formatCurrency(
                    promotion.minOrderValue
                )}
            </td>

            <td>
                ${formatCurrency(
                    promotion.maxDiscount
                )}
            </td>

            <td>
                <div class="admin-promotion-time">

                    <span>
                        ${formatDateTime(
                            promotion.startAt
                        )}
                    </span>

                    <small>
                        đến
                    </small>

                    <span>
                        ${formatDateTime(
                            promotion.endAt
                        )}
                    </span>

                </div>
            </td>

            <td>
                <span
                    class="
                        admin-promotion-status
                        ${statusClass}
                    "
                >
                    ${statusText}
                </span>
            </td>

            <td>
                <div class="admin-promotion-actions">

                    <button
                        type="button"
                        class="admin-promotion-edit"
                        data-promotion-id="${promotion.promotionId}"
                    >
                        Sửa
                    </button>

                    <button
                        type="button"
                        class="
                            admin-promotion-toggle
                            ${toggleClass}
                        "
                        data-promotion-id="${promotion.promotionId}"
                        data-next-status="${nextStatus}"
                        data-promotion-code="${escapeAttribute(
                            promotion.code || ""
                        )}"
                    >
                        ${toggleText}
                    </button>

                </div>
            </td>

        </tr>
    `;
}

function setupPromotionFilters() {

    document
        .querySelectorAll(
            ".admin-promotion-filter"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".admin-promotion-filter"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );

                        button.classList.add(
                            "active"
                        );

                        currentPromotionFilter =
                            button.dataset.filter
                            || "ALL";

                        renderAdminPromotions();
                    }
                );
            }
        );
}

function setupPromotionSearch() {

    const input =
        document.getElementById(
            "adminPromotionSearch"
        );

    input.addEventListener(
        "input",
        renderAdminPromotions
    );
}

function setupPromotionRowActions() {

    document
        .querySelectorAll(
            ".admin-promotion-edit"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openEditPromotionModal(
                            Number(
                                button.dataset
                                    .promotionId
                            )
                        );
                    }
                );
            }
        );

    document
        .querySelectorAll(
            ".admin-promotion-toggle"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const promotionId =
                            Number(
                                button.dataset
                                    .promotionId
                            );

                        const nextStatus =
                            button.dataset
                                .nextStatus;

                        const code =
                            button.dataset
                                .promotionCode;

                        const actionText =
                            nextStatus === "ACTIVE"
                                ? "bật"
                                : "tắt";

                        const confirmed =
                            window.confirm(
                                `Bạn có chắc muốn ${actionText} mã "${code}"?`
                            );

                        if (!confirmed) {
                            return;
                        }

                        try {

                            button.disabled = true;

                            await window.api
                                .updateAdminPromotionStatus(
                                    promotionId,
                                    nextStatus
                                );

                            showAdminMessage(
                                `Đã ${actionText} mã khuyến mãi thành công.`,
                                "success"
                            );

                            await loadAdminPromotions();

                        } catch (error) {

                            console.error(
                                "Update promotion status error:",
                                error
                            );

                            showAdminMessage(
                                error.message
                                || "Không thể cập nhật trạng thái khuyến mãi.",
                                "error"
                            );

                        } finally {

                            button.disabled = false;
                        }
                    }
                );
            }
        );
}

function setupPromotionModal() {

    const addButton =
        document.getElementById(
            "addPromotionButton"
        );

    const closeButton =
        document.getElementById(
            "closePromotionModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelPromotionButton"
        );

    const overlay =
        document.querySelector(
            "#promotionModal .admin-modal-overlay"
        );

    addButton.addEventListener(
        "click",
        openCreatePromotionModal
    );

    closeButton.addEventListener(
        "click",
        closePromotionModal
    );

    cancelButton.addEventListener(
        "click",
        closePromotionModal
    );

    overlay.addEventListener(
        "click",
        closePromotionModal
    );

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closePromotionModal();
            }
        }
    );
}

function openCreatePromotionModal() {

    const form =
        document.getElementById(
            "promotionForm"
        );

    form.reset();

    document.getElementById(
        "promotionId"
    ).value = "";

    const codeInput =
        document.getElementById(
            "promotionCode"
        );

    codeInput.readOnly = false;

    document.getElementById(
        "promotionModalTitle"
    ).textContent =
        "Thêm khuyến mãi";

    document.getElementById(
        "savePromotionButton"
    ).textContent =
        "Tạo khuyến mãi";

    document.getElementById(
        "promotionModal"
    ).hidden = false;

    codeInput.focus();
}

function openEditPromotionModal(
    promotionId
) {

    const promotion =
        adminPromotions.find(
            item =>
                Number(
                    item.promotionId
                )
                ===
                Number(
                    promotionId
                )
        );

    if (!promotion) {

        showAdminMessage(
            "Không tìm thấy khuyến mãi.",
            "error"
        );

        return;
    }

    document.getElementById(
        "promotionId"
    ).value =
        promotion.promotionId;

    const codeInput =
        document.getElementById(
            "promotionCode"
        );

    codeInput.value =
        promotion.code || "";

    codeInput.readOnly = true;

    document.getElementById(
        "promotionName"
    ).value =
        promotion.name || "";

    document.getElementById(
        "promotionDescription"
    ).value =
        promotion.description || "";

    document.getElementById(
        "promotionDiscountPercent"
    ).value =
        promotion.discountPercent ?? "";

    document.getElementById(
        "promotionMinOrderValue"
    ).value =
        promotion.minOrderValue ?? "";

    document.getElementById(
        "promotionMaxDiscount"
    ).value =
        promotion.maxDiscount ?? "";

    document.getElementById(
        "promotionStartAt"
    ).value =
        toDateTimeLocalValue(
            promotion.startAt
        );

    document.getElementById(
        "promotionEndAt"
    ).value =
        toDateTimeLocalValue(
            promotion.endAt
        );

    document.getElementById(
        "promotionModalTitle"
    ).textContent =
        "Sửa khuyến mãi";

    document.getElementById(
        "savePromotionButton"
    ).textContent =
        "Lưu thay đổi";

    document.getElementById(
        "promotionModal"
    ).hidden = false;
}

function closePromotionModal() {

    const modal =
        document.getElementById(
            "promotionModal"
        );

    if (!modal) {
        return;
    }

    modal.hidden = true;
}

function setupPromotionForm() {

    const form =
        document.getElementById(
            "promotionForm"
        );

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const promotionId =
                document.getElementById(
                    "promotionId"
                ).value;

            const data =
                collectPromotionFormData();

            if (!validatePromotionData(data)) {
                return;
            }

            const button =
                document.getElementById(
                    "savePromotionButton"
                );

            try {

                button.disabled = true;

                button.textContent =
                    promotionId
                        ? "Đang lưu..."
                        : "Đang tạo...";

                if (promotionId) {

                    await window.api
                        .updateAdminPromotion(
                            Number(
                                promotionId
                            ),
                            data
                        );

                    showAdminMessage(
                        "Cập nhật khuyến mãi thành công.",
                        "success"
                    );

                } else {

                    await window.api
                        .createAdminPromotion(
                            data
                        );

                    showAdminMessage(
                        "Tạo khuyến mãi thành công.",
                        "success"
                    );
                }

                closePromotionModal();

                await loadAdminPromotions();

            } catch (error) {

                console.error(
                    "Save promotion error:",
                    error
                );

                showAdminMessage(
                    error.message
                    || "Không thể lưu khuyến mãi.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    promotionId
                        ? "Lưu thay đổi"
                        : "Tạo khuyến mãi";
            }
        }
    );
}

function collectPromotionFormData() {

    const numberOrNull =
        value => {

            if (
                value === null
                || value === undefined
                || String(value).trim() === ""
            ) {
                return null;
            }

            return Number(value);
        };

    return {

        code:
            document
                .getElementById(
                    "promotionCode"
                )
                .value
                .trim()
                .toUpperCase(),

        name:
            document
                .getElementById(
                    "promotionName"
                )
                .value
                .trim(),

        description:
            document
                .getElementById(
                    "promotionDescription"
                )
                .value
                .trim(),

        discountPercent:
            numberOrNull(
                document
                    .getElementById(
                        "promotionDiscountPercent"
                    )
                    .value
            ),

        maxDiscount:
            numberOrNull(
                document
                    .getElementById(
                        "promotionMaxDiscount"
                    )
                    .value
            ),

        minOrderValue:
            numberOrNull(
                document
                    .getElementById(
                        "promotionMinOrderValue"
                    )
                    .value
            ),

        startAt:
            normalizeDateTimeForBackend(
                document
                    .getElementById(
                        "promotionStartAt"
                    )
                    .value
            ),

        endAt:
            normalizeDateTimeForBackend(
                document
                    .getElementById(
                        "promotionEndAt"
                    )
                    .value
            )
    };
}

function validatePromotionData(data) {

    if (!data.code) {

        showAdminMessage(
            "Vui lòng nhập mã khuyến mãi.",
            "error"
        );

        return false;
    }

    if (!data.name) {

        showAdminMessage(
            "Vui lòng nhập tên khuyến mãi.",
            "error"
        );

        return false;
    }

    if (
        data.discountPercent === null
        || data.discountPercent < 0
        || data.discountPercent > 100
    ) {

        showAdminMessage(
            "Phần trăm giảm phải từ 0 đến 100.",
            "error"
        );

        return false;
    }

    if (!data.startAt || !data.endAt) {

        showAdminMessage(
            "Vui lòng chọn thời gian bắt đầu và kết thúc.",
            "error"
        );

        return false;
    }

    const start =
        new Date(data.startAt);

    const end =
        new Date(data.endAt);

    if (end <= start) {

        showAdminMessage(
            "Thời gian kết thúc phải sau thời gian bắt đầu.",
            "error"
        );

        return false;
    }

    return true;
}

function normalizeStatus(status) {

    return String(
        status || "INACTIVE"
    )
        .trim()
        .toUpperCase();
}

function formatCurrency(value) {

    if (
        value === null
        || value === undefined
        || value === ""
    ) {
        return "-";
    }

    const number =
        Number(value);

    if (Number.isNaN(number)) {
        return "-";
    }

    return (
        new Intl.NumberFormat(
            "vi-VN"
        ).format(number)
        + " đ"
    );
}

function formatPercent(value) {

    const number =
        Number(value);

    if (Number.isNaN(number)) {
        return "-";
    }

    return `${number}%`;
}

function formatDateTime(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return escapeHtml(
            String(value)
        );
    }

    return new Intl.DateTimeFormat(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);
}

function toDateTimeLocalValue(value) {

    if (!value) {
        return "";
    }

    const text =
        String(value);

    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/
            .test(text)
    ) {

        return text.slice(0, 16);
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const pad =
        number =>
            String(number)
                .padStart(2, "0");

    return (
        date.getFullYear()
        + "-"
        + pad(
            date.getMonth() + 1
        )
        + "-"
        + pad(
            date.getDate()
        )
        + "T"
        + pad(
            date.getHours()
        )
        + ":"
        + pad(
            date.getMinutes()
        )
    );
}

function normalizeDateTimeForBackend(value) {

    if (!value) {
        return null;
    }

    return value.length === 16
        ? `${value}:00`
        : value;
}

function showAdminMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "adminMessage"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message || "";

    element.classList.remove(
        "success",
        "error"
    );

    if (type) {

        element.classList.add(
            type
        );
    }

    if (message) {

        window.setTimeout(
            () => {

                if (
                    element.textContent
                    === message
                ) {

                    element.textContent = "";

                    element.classList.remove(
                        "success",
                        "error"
                    );
                }

            },
            3500
        );
    }
}

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

function escapeAttribute(value) {

    return escapeHtml(value);
}


let productPromotions = [];
let adminProductsForPromotion = [];
let currentProductPromotionFilter = "ALL";

function productPromotionTypeLabel(type) {
    switch (String(type || "").toUpperCase()) {
        case "NEW_PRODUCT": return "Sản phẩm mới";
        case "BESTSELLER": return "Bestseller";
        case "SALE": return "Sale";
        case "BLACK_FRIDAY": return "Black Friday";
        default: return type || "-";
    }
}

function productPromotionTypePercent(type) {
    switch (String(type || "").toUpperCase()) {
        case "NEW_PRODUCT": return 5;
        case "BESTSELLER": return 10;
        case "SALE": return 15;
        case "BLACK_FRIDAY": return 30;
        default: return null;
    }
}

async function loadProductPromotionManagement() {
    try {
        const [promotions, products] = await Promise.all([
            window.api.request("/api/admin/promotions/product"),
            window.api.getAdminProducts()
        ]);
        productPromotions = Array.isArray(promotions) ? promotions : [];
        adminProductsForPromotion = Array.isArray(products)
            ? products.filter(product => String(product.status || "").toUpperCase() !== "DELETED")
            : [];
        populateProductPromotionProducts();
        renderProductPromotions();
        renderBlackFridayProducts();
        await loadBlackFridayCampaign();
    } catch (error) {
        showAdminMessage(error.message || "Không thể tải ưu đãi sản phẩm.", "error");
    }
}

function productName(productId) {
    const product = adminProductsForPromotion.find(item => Number(item.productId) === Number(productId));
    return product ? product.name : `Sản phẩm #${productId}`;
}

function populateProductPromotionProducts() {
    const select = document.getElementById("productPromotionProductId");
    if (!select) return;
    select.innerHTML = adminProductsForPromotion
        .map(product => `<option value="${product.productId}">${escapeHtml(product.name)} (#${product.productId})</option>`)
        .join("");
}

function filteredProductPromotions() {
    const query = document.getElementById("productPromotionSearch")?.value.trim().toLowerCase() || "";
    return productPromotions.filter(item => {
        const type = String(item.promotionType || "").toUpperCase();
        const matchesType = currentProductPromotionFilter === "ALL" || type === currentProductPromotionFilter;
        const haystack = `${productName(item.productId)} ${type}`.toLowerCase();
        return matchesType && (!query || haystack.includes(query));
    });
}

function renderProductPromotions() {
    const tbody = document.getElementById("productPromotionTableBody");
    if (!tbody) return;
    const rows = filteredProductPromotions();
    if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="admin-table-empty">Chưa có ưu đãi sản phẩm.</td></tr>`;
        return;
    }
    tbody.innerHTML = rows.map(item => {
        const status = String(item.status || "INACTIVE").toUpperCase();
        const expired = item.endAt && new Date(item.endAt) < new Date();
        const statusText = expired ? "Hết hạn" : status === "ACTIVE" ? "Đang hoạt động" : "Đã tắt";
        const statusClass = expired ? "expired" : status === "ACTIVE" ? "active" : "inactive";
        return `
            <tr>
                <td>#${item.promotionId}</td>
                <td><strong>${escapeHtml(productName(item.productId))}</strong><br><small>#${item.productId}</small></td>
                <td>${productPromotionTypeLabel(item.promotionType)}</td>
                <td><strong>${formatPercent(
                    productPromotionTypePercent(item.promotionType) ?? item.discountPercent
                )}</strong></td>
                <td><div class="admin-promotion-time"><span>${formatDateTime(item.startAt)}</span><small>đến</small><span>${formatDateTime(item.endAt)}</span></div></td>
                <td><span class="admin-promotion-status ${statusClass}">${statusText}</span></td>
                <td><div class="admin-promotion-actions">
                    <button type="button" class="product-promotion-edit" data-id="${item.promotionId}">Sửa</button>
                    <button type="button" class="product-promotion-toggle ${status === "ACTIVE" ? "deactivate" : "activate"}" data-id="${item.promotionId}" data-next="${status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}">${status === "ACTIVE" ? "Tắt" : "Bật"}</button>
                </div></td>
            </tr>`;
    }).join("");
    document.querySelectorAll(".product-promotion-edit").forEach(button => {
        button.addEventListener("click", () => openProductPromotionModal(Number(button.dataset.id)));
    });
    document.querySelectorAll(".product-promotion-toggle").forEach(button => {
        button.addEventListener("click", async () => {
            try {
                await window.api.request(`/api/admin/promotions/product/${button.dataset.id}/status`, {
                    method: "PUT",
                    body: JSON.stringify({ status: button.dataset.next })
                });
                showAdminMessage("Đã cập nhật trạng thái ưu đãi sản phẩm.", "success");
                await loadProductPromotionManagement();
            } catch (error) {
                showAdminMessage(error.message || "Không thể cập nhật trạng thái.", "error");
            }
        });
    });
}

function setProductPromotionDefaultDates(type) {
    const now = new Date();
    const normalizedType = String(type).toUpperCase();
    const durationDays = normalizedType === "NEW_PRODUCT" ? 30 : normalizedType === "BLACK_FRIDAY" ? 1 : 365;
    const end = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const toLocal = value => {
        const pad = n => String(n).padStart(2, "0");
        return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
    };
    if (normalizedType === "BLACK_FRIDAY") {
        const day = blackFridayDateFor(now.getFullYear());
        const next = new Date(`${day}T00:00:00`);
        next.setDate(next.getDate() + 1);
        document.getElementById("productPromotionStartAt").value = `${day}T00:00`;
        document.getElementById("productPromotionEndAt").value = toLocal(next);
        return;
    }
    document.getElementById("productPromotionStartAt").value = toLocal(now);
    document.getElementById("productPromotionEndAt").value = toLocal(end);
}

function syncProductPromotionTypeFields() {
    const type = document.getElementById("productPromotionType").value;
    const percentInput = document.getElementById("productPromotionDiscount");
    const fixed = productPromotionTypePercent(type);
    if (fixed !== null) {
        percentInput.value = fixed;
        percentInput.readOnly = true;
    } else {
        percentInput.readOnly = false;
        percentInput.min = 20;
        percentInput.max = 40;
        if (Number(percentInput.value) < 20 || Number(percentInput.value) > 40) percentInput.value = 20;
    }
}

function openProductPromotionModal(id = null) {
    const modal = document.getElementById("productPromotionModal");
    const form = document.getElementById("productPromotionForm");
    form.reset();
    document.getElementById("productPromotionId").value = "";
    document.getElementById("productPromotionStatus").value = "ACTIVE";
    document.getElementById("productPromotionType").value = "SALE";
    syncProductPromotionTypeFields();
    setProductPromotionDefaultDates("SALE");

    if (id) {
        const item = productPromotions.find(value => Number(value.promotionId) === Number(id));
        if (!item) return;
        document.getElementById("productPromotionId").value = item.promotionId;
        document.getElementById("productPromotionProductId").value = item.productId;
        document.getElementById("productPromotionType").value = item.promotionType;
        document.getElementById("productPromotionDiscount").value = item.discountPercent;
        document.getElementById("productPromotionStartAt").value = toDateTimeLocalValue(item.startAt);
        document.getElementById("productPromotionEndAt").value = toDateTimeLocalValue(item.endAt);
        document.getElementById("productPromotionStatus").value = item.status || "ACTIVE";
        syncProductPromotionTypeFields();
        document.getElementById("productPromotionModalTitle").textContent = "Sửa ưu đãi sản phẩm";
        document.getElementById("saveProductPromotionButton").textContent = "Lưu thay đổi";
    } else {
        document.getElementById("productPromotionModalTitle").textContent = "Thêm ưu đãi sản phẩm";
        document.getElementById("saveProductPromotionButton").textContent = "Lưu ưu đãi";
    }
    modal.hidden = false;
}

function closeProductPromotionModal() {
    const modal = document.getElementById("productPromotionModal");
    if (modal) modal.hidden = true;
}

function setupProductPromotionManagement() {
    document.getElementById("addProductPromotionButton")?.addEventListener("click", () => openProductPromotionModal());
    document.getElementById("closeProductPromotionModal")?.addEventListener("click", closeProductPromotionModal);
    document.getElementById("cancelProductPromotionButton")?.addEventListener("click", closeProductPromotionModal);
    document.querySelector("#productPromotionModal .admin-modal-overlay")?.addEventListener("click", closeProductPromotionModal);
    document.getElementById("productPromotionType")?.addEventListener("change", () => {
        syncProductPromotionTypeFields();
        setProductPromotionDefaultDates(document.getElementById("productPromotionType").value);
    });
    document.getElementById("productPromotionSearch")?.addEventListener("input", renderProductPromotions);
    document.querySelectorAll(".product-promotion-filter").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".product-promotion-filter").forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            currentProductPromotionFilter = button.dataset.productFilter || "ALL";
            renderProductPromotions();
        });
    });
    document.getElementById("productPromotionForm")?.addEventListener("submit", async event => {
        event.preventDefault();
        const id = document.getElementById("productPromotionId").value;
        const data = {
            productId: Number(document.getElementById("productPromotionProductId").value),
            promotionType: document.getElementById("productPromotionType").value,
            discountPercent: Number(document.getElementById("productPromotionDiscount").value),
            startAt: normalizeDateTimeForBackend(document.getElementById("productPromotionStartAt").value),
            endAt: normalizeDateTimeForBackend(document.getElementById("productPromotionEndAt").value),
            status: document.getElementById("productPromotionStatus").value
        };
        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `/api/admin/promotions/product/${id}` : "/api/admin/promotions/product";
            await window.api.request(url, { method, body: JSON.stringify(data) });
            closeProductPromotionModal();
            showAdminMessage(id ? "Đã cập nhật ưu đãi sản phẩm." : "Đã tạo ưu đãi sản phẩm.", "success");
            await loadProductPromotionManagement();
        } catch (error) {
            showAdminMessage(error.message || "Không thể lưu ưu đãi sản phẩm.", "error");
        }
    });
}

function getBlackFridayProductCategory(product) {
    return String(
        product?.category?.name
        || product?.categoryName
        || ""
    ).trim();
}

function getBlackFridaySelectedChecks() {
    return Array.from(
        document.querySelectorAll(
            ".black-friday-product-check:checked"
        )
    );
}

function updateBlackFridaySelectionCount() {
    const countElement = document.getElementById(
        "blackFridaySelectionCount"
    );

    if (!countElement) {
        return;
    }

    const selected = getBlackFridaySelectedChecks().length;
    const total = document.querySelectorAll(
        ".black-friday-product-check"
    ).length;

    countElement.textContent =
        `Đã chọn: ${selected}/${total} sản phẩm`;

    document
        .querySelectorAll(".black-friday-percent-button")
        .forEach(button => {
            button.disabled = selected === 0;
        });

    const categoryButton = document.getElementById(
        "blackFridaySelectCategory"
    );

    if (categoryButton) {
        categoryButton.disabled = !document.getElementById(
            "blackFridayCategorySelect"
        )?.value;
    }
}

function setBlackFridaySelection(filter) {
    document
        .querySelectorAll(".black-friday-product-check")
        .forEach(check => {
            const product = adminProductsForPromotion.find(
                item => Number(item.productId) === Number(check.dataset.productId)
            );

            check.checked = Boolean(product && filter(product));
            check.closest(".black-friday-product-row")?.classList.toggle(
                "is-selected",
                check.checked
            );
        });

    updateBlackFridaySelectionCount();
}

function populateBlackFridayCategories() {
    const select = document.getElementById(
        "blackFridayCategorySelect"
    );

    if (!select) {
        return;
    }

    const categories = Array.from(
        new Set(
            adminProductsForPromotion
                .map(getBlackFridayProductCategory)
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b, "vi"));

    select.innerHTML =
        `<option value="">Chọn danh mục</option>`
        + categories
            .map(category =>
                `<option value="${escapeAttribute(category)}">${escapeHtml(category)}</option>`
            )
            .join("");
}

function applyBlackFridayBulkPercent(percent) {
    const selected = getBlackFridaySelectedChecks();

    if (!selected.length) {
        showAdminMessage(
            "Vui lòng chọn ít nhất một sản phẩm.",
            "error"
        );
        return;
    }

    selected.forEach(check => {
        const input = document.querySelector(
            `.black-friday-product-percent[data-product-id="${check.dataset.productId}"]`
        );

        if (input) {
            input.value = percent;
        }
    });

    showAdminMessage(
        `Đã áp dụng mức giảm ${percent}% cho ${selected.length} sản phẩm đã chọn.`,
        "success"
    );
}

function renderBlackFridayProducts() {
    const container = document.getElementById("blackFridayProducts");

    if (!container) {
        return;
    }

    container.innerHTML = adminProductsForPromotion.map(product => `
        <label class="black-friday-product-row">
            <span>
                <input
                    type="checkbox"
                    class="black-friday-product-check"
                    data-product-id="${product.productId}"
                >
                <strong>${escapeHtml(product.name)}</strong>
                <br>
                <small>
                    #${product.productId}
                    · ${escapeHtml(getBlackFridayProductCategory(product) || "Chưa phân loại")}
                    · ${formatCurrency(product.price)}
                    · Tồn ${Number(product.stockQuantity ?? 0)}
                </small>
            </span>
            <input
                type="number"
                class="black-friday-product-percent"
                data-product-id="${product.productId}"
                min="30"
                max="30"
                step="1"
                value="30"
                readonly
            >
            <span>%</span>
        </label>`).join("");

    document
        .querySelectorAll(".black-friday-product-check")
        .forEach(check => {
            check.addEventListener(
                "change",
                () => {
                    check.closest(".black-friday-product-row")?.classList.toggle(
                        "is-selected",
                        check.checked
                    );
                    updateBlackFridaySelectionCount();
                }
            );
        });

    populateBlackFridayCategories();
    updateBlackFridaySelectionCount();
}

function blackFridayDateFor(year) {
    // Black Friday = ngày sau Lễ Tạ ơn (thứ Năm thứ 4 của tháng 11)
    const first = new Date(Number(year), 10, 1);
    const offset = (4 - first.getDay() + 7) % 7;
    const thanksgiving = 1 + offset + 21;
    const pad = n => String(n).padStart(2, "0");
    const d = new Date(Number(year), 10, thanksgiving + 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function loadBlackFridayCampaign() {
    const yearInput = document.getElementById("blackFridayYear");
    const dateInput = document.getElementById("blackFridayDate");

    if (!yearInput || !dateInput) {
        return;
    }

    const year = new Date().getFullYear();

    if (!yearInput.dataset.bfBound) {
        yearInput.dataset.bfBound = "1";
        yearInput.addEventListener("change", () => {
            if (yearInput.value) {
                dateInput.value = blackFridayDateFor(yearInput.value);
            }
        });
    }

    try {
        const campaign = await window.api.request(
            `/api/admin/promotions/black-friday?year=${year}`
        );

        yearInput.value = campaign.year || year;
        dateInput.value = campaign.saleDate || blackFridayDateFor(year);
        document.getElementById("blackFridayEnabled").checked =
            Boolean(campaign.enabled);

        const selected = new Set(
            (campaign.items || []).map(item => Number(item.productId))
        );

        document
            .querySelectorAll(".black-friday-product-check")
            .forEach(check => {
                const id = Number(check.dataset.productId);
                check.checked = selected.has(id);
                check.closest(".black-friday-product-row")?.classList.toggle(
                    "is-selected",
                    check.checked
                );

                const percent = document.querySelector(
                    `.black-friday-product-percent[data-product-id="${id}"]`
                );

                if (percent && selected.has(id)) {
                    percent.value = 30;
                }
            });

        updateBlackFridaySelectionCount();
    } catch (error) {
        yearInput.value = year;
        dateInput.value = blackFridayDateFor(year);
        updateBlackFridaySelectionCount();
    }
}

function setupBlackFridayManagement() {
    document.getElementById("blackFridaySelectAll")?.addEventListener(
        "click",
        () => setBlackFridaySelection(() => true)
    );

    document.getElementById("blackFridayClearAll")?.addEventListener(
        "click",
        () => setBlackFridaySelection(() => false)
    );

    document.getElementById("blackFridaySelectSelling")?.addEventListener(
        "click",
        () => setBlackFridaySelection(product =>
            String(product.status || "").toUpperCase() === "ACTIVE"
        )
    );

    document.getElementById("blackFridaySelectInStock")?.addEventListener(
        "click",
        () => setBlackFridaySelection(product =>
            Number(product.stockQuantity ?? 0) > 0
        )
    );

    document.getElementById("blackFridaySelectCategory")?.addEventListener(
        "click",
        () => {
            const category = document.getElementById(
                "blackFridayCategorySelect"
            )?.value;

            if (!category) {
                showAdminMessage(
                    "Vui lòng chọn một danh mục.",
                    "error"
                );
                return;
            }

            setBlackFridaySelection(product =>
                getBlackFridayProductCategory(product).toLowerCase()
                === category.toLowerCase()
            );
        }
    );

    document.getElementById("blackFridayCategorySelect")?.addEventListener(
        "change",
        updateBlackFridaySelectionCount
    );

    document
        .querySelectorAll(".black-friday-percent-button")
        .forEach(button => {
            button.addEventListener(
                "click",
                () => applyBlackFridayBulkPercent(
                    Number(button.dataset.bulkPercent)
                )
            );
        });

    document.getElementById("blackFridayForm")?.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            const year = Number(
                document.getElementById("blackFridayYear").value
            );

            const saleDate = document.getElementById(
                "blackFridayDate"
            ).value;

            const enabled = document.getElementById(
                "blackFridayEnabled"
            ).checked;

            const items = getBlackFridaySelectedChecks().map(check => {
                const id = Number(check.dataset.productId);
                const input = document.querySelector(
                    `.black-friday-product-percent[data-product-id="${id}"]`
                );

                const discountPercent = Number(input?.value || 30);

                return {
                    productId: id,
                    discountPercent
                };
            });

            const invalidItem = items.find(
                item =>
                    !Number.isFinite(item.discountPercent)
                    || item.discountPercent !== 30
            );

            if (invalidItem) {
                showAdminMessage(
                    "Black Friday chỉ được giảm đúng 30%.",
                    "error"
                );
                return;
            }

            if (enabled && items.length === 0) {
                showAdminMessage(
                    "Vui lòng chọn ít nhất một sản phẩm khi bật Black Friday.",
                    "error"
                );
                return;
            }

            try {
                await window.api.request(
                    "/api/admin/promotions/black-friday",
                    {
                        method: "PUT",
                        body: JSON.stringify({
                            year,
                            saleDate,
                            enabled,
                            items
                        })
                    }
                );

                showAdminMessage(
                    "Đã lưu lịch Black Friday. Mỗi năm chỉ có một campaign.",
                    "success"
                );

                await loadProductPromotionManagement();
            } catch (error) {
                showAdminMessage(
                    error.message || "Không thể lưu Black Friday.",
                    "error"
                );
            }
        }
    );

    updateBlackFridaySelectionCount();
}
