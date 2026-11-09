let adminReviews = [];
let currentReviewFilter = "ALL";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }

        setupAdminProfile();
        setupLogout();
        setupReviewFilters();
        setupReviewSearch();

        await loadAdminReviews();
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

async function loadAdminReviews() {

    const tbody =
        document.getElementById(
            "adminReviewTableBody"
        );

    tbody.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="admin-table-empty"
            >
                Đang tải đánh giá...
            </td>
        </tr>
    `;

    try {

        const response =
            await window.api
                .getAdminReviews();

        adminReviews =
            Array.isArray(response)
                ? response
                : [];

        renderAdminReviews();

    } catch (error) {

        console.error(
            "Load admin reviews error:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Không thể tải đánh giá.
                </td>
            </tr>
        `;

        showAdminMessage(
            error.message
            || "Không thể tải danh sách đánh giá.",
            "error"
        );
    }
}

function getFilteredReviews() {

    const keyword =
        document
            .getElementById(
                "adminReviewSearch"
            )
            .value
            .trim()
            .toLowerCase();

    return adminReviews.filter(
        review => {

            const status =
                normalizeStatus(
                    review.status
                );

            let matchesFilter = true;

            if (
                currentReviewFilter
                === "ACTIVE"
            ) {

                matchesFilter =
                    status === "ACTIVE";

            } else if (
                currentReviewFilter
                === "HIDDEN"
            ) {

                matchesFilter =
                    status === "HIDDEN";

            } else if (
                currentReviewFilter
                === "LOW_RATING"
            ) {

                matchesFilter =
                    Number(
                        review.rating
                    ) <= 2;
            }

            const haystack =
                [
                    review.username,
                    review.productName,
                    review.comment,
                    review.reviewId,
                    review.productId,
                    review.userId
                ]
                    .filter(
                        value =>
                            value !== null
                            && value !== undefined
                    )
                    .join(" ")
                    .toLowerCase();

            const matchesSearch =
                !keyword
                || haystack.includes(
                    keyword
                );

            return (
                matchesFilter
                && matchesSearch
            );
        }
    );
}

function setupReviewFilters() {

    document
        .querySelectorAll(
            ".admin-review-filter"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".admin-review-filter"
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

                        currentReviewFilter =
                            button.dataset.filter
                            || "ALL";

                        renderAdminReviews();
                    }
                );
            }
        );
}

function setupReviewSearch() {

    const input =
        document.getElementById(
            "adminReviewSearch"
        );

    input.addEventListener(
        "input",
        renderAdminReviews
    );
}

function renderAdminReviews() {

    const tbody =
        document.getElementById(
            "adminReviewTableBody"
        );

    const countElement =
        document.getElementById(
            "adminReviewCount"
        );

    const reviews =
        getFilteredReviews();

    countElement.textContent =
        `${reviews.length} đánh giá`;

    if (reviews.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Không có đánh giá phù hợp.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        reviews
            .map(
                review =>
                    renderReviewRow(
                        review
                    )
            )
            .join("");

    setupReviewActions();
}

function renderReviewRow(review) {

    const status =
        normalizeStatus(
            review.status
        );

    const isActive =
        status === "ACTIVE";

    const nextStatus =
        isActive
            ? "HIDDEN"
            : "ACTIVE";

    const actionText =
        isActive
            ? "Ẩn"
            : "Hiện";

    const actionClass =
        isActive
            ? "hide"
            : "show";

    const statusText =
        isActive
            ? "Đang hiển thị"
            : "Đã ẩn";

    const statusClass =
        isActive
            ? "active"
            : "hidden";

    return `
        <tr>

            <td>
                #${review.reviewId ?? ""}
            </td>

            <td>
                <div class="admin-review-user">

                    <strong>
                        ${escapeHtml(
                            review.username
                            || "Không xác định"
                        )}
                    </strong>

                    <span>
                        User ID:
                        ${review.userId ?? "-"}
                    </span>

                </div>
            </td>

            <td>
                <div class="admin-review-product">

                    <strong>
                        ${escapeHtml(
                            review.productName
                            || "Không xác định"
                        )}
                    </strong>

                    <span>
                        Product ID:
                        ${review.productId ?? "-"}
                    </span>

                </div>
            </td>

            <td>
                ${renderStars(
                    review.rating
                )}
            </td>

            <td>
                <div class="admin-review-comment">
                    ${escapeHtml(
                        review.comment
                        || "Không có nội dung"
                    )}
                </div>
            </td>

            <td>
                ${formatDateTime(
                    review.createdAt
                )}
            </td>

            <td>
                <span
                    class="
                        admin-review-status
                        ${statusClass}
                    "
                >
                    ${statusText}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="
                        admin-review-action
                        ${actionClass}
                    "
                    data-review-id="${review.reviewId}"
                    data-next-status="${nextStatus}"
                    data-username="${escapeAttribute(
                        review.username || ""
                    )}"
                >
                    ${actionText}
                </button>
            </td>

        </tr>
    `;
}

function setupReviewActions() {

    document
        .querySelectorAll(
            ".admin-review-action"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const reviewId =
                            Number(
                                button.dataset
                                    .reviewId
                            );

                        const nextStatus =
                            button.dataset
                                .nextStatus;

                        const username =
                            button.dataset
                                .username;

                        const verb =
                            nextStatus === "HIDDEN"
                                ? "ẩn"
                                : "hiện lại";

                        const confirmed =
                            window.confirm(
                                `Bạn có chắc muốn ${verb} đánh giá của "${username}"?`
                            );

                        if (!confirmed) {
                            return;
                        }

                        try {

                            button.disabled = true;

                            await window.api
                                .updateAdminReviewStatus(
                                    reviewId,
                                    nextStatus
                                );

                            showAdminMessage(
                                nextStatus === "HIDDEN"
                                    ? "Đã ẩn đánh giá thành công."
                                    : "Đã hiển thị lại đánh giá thành công.",
                                "success"
                            );

                            await loadAdminReviews();

                        } catch (error) {

                            console.error(
                                "Update review status error:",
                                error
                            );

                            showAdminMessage(
                                error.message
                                || "Không thể cập nhật trạng thái đánh giá.",
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

function normalizeStatus(status) {

    return String(
        status || ""
    )
        .trim()
        .toUpperCase();
}

function renderStars(rating) {

    const value =
        Math.max(
            0,
            Math.min(
                5,
                Number(rating) || 0
            )
        );

    const filled =
        "★".repeat(value);

    const empty =
        "☆".repeat(5 - value);

    return `
        <div class="admin-review-stars">
            <span>${filled}</span>${empty}
            <small>${value}/5</small>
        </div>
    `;
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
