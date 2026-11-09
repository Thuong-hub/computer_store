let adminUsers = [];

let currentUserStatusFilter =
    "ALL";


 
 
 

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!checkAdminAccess()) {
            return;
        }


        setupAdminUser();

        setupLogout();

        setupStatusFilters();

        setupSearch();

        await loadAdminUsers();
    }
);


 
 
 

function checkAdminAccess() {

    const token =
        window.api.getToken();


    if (!token) {

        window.location.href =
            "/pages/login.html";

        return false;
    }


    let user = {};


    try {

        user =
            JSON.parse(
                localStorage.getItem("user")
                || "{}"
            );

    } catch {
        user = {};
    }


    if (
        String(user.role || "")
            .toUpperCase()
        !==
        "ADMIN"
    ) {

        window.location.href = "/";

        return false;
    }


    return true;
}


 
 
 

function setupAdminUser() {

    let user = {};


    try {

        user =
            JSON.parse(
                localStorage.getItem("user")
                || "{}"
            );

    } catch {
        user = {};
    }


    const displayName =
        user.fullName
        ||
        user.username
        ||
        "Admin";


    document.getElementById(
        "adminName"
    ).textContent =
        displayName;


    document.querySelector(
        ".admin-avatar"
    ).textContent =
        displayName
            .charAt(0)
            .toUpperCase();
}


 
 
 

function setupLogout() {

    document.getElementById(
        "adminLogoutButton"
    ).addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "/pages/login.html";
        }
    );
}


 
 
 

async function loadAdminUsers() {

    const body =
        document.getElementById(
            "adminUserTableBody"
        );


    body.innerHTML = `
        <tr>

            <td
                colspan="8"
                class="admin-table-empty"
            >
                Đang tải tài khoản...
            </td>

        </tr>
    `;


    try {

        const response =
            await window.api.getAdminUsers();


        adminUsers =
            Array.isArray(response)
                ? response
                : [];


        renderAdminUsers();


    } catch (error) {

        console.error(
            "Load users error:",
            error
        );


        body.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Không thể tải tài khoản.
                </td>

            </tr>
        `;


        showAdminUserMessage(
            error.message
            || "Không thể tải danh sách tài khoản.",
            "error"
        );
    }
}


 
 
 

function renderAdminUsers() {

    const body =
        document.getElementById(
            "adminUserTableBody"
        );


    const filtered =
        adminUsers.filter(user => {

            if (
                currentUserStatusFilter
                ===
                "ALL"
            ) {
                return true;
            }


            return (
                String(
                    user.status || ""
                ).toUpperCase()
                ===
                currentUserStatusFilter
            );
        });


    document.getElementById(
        "adminUserCount"
    ).textContent =
        `${filtered.length} tài khoản`;


    if (filtered.length === 0) {

        body.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    class="admin-table-empty"
                >
                    Không có tài khoản phù hợp.
                </td>

            </tr>
        `;

        return;
    }


    body.innerHTML =
        filtered
            .map(user => {

                const role =
                    String(
                        user.role || ""
                    ).toUpperCase();


                const status =
                    String(
                        user.status || ""
                    ).toUpperCase();


                const initial =
                    String(
                        user.fullName
                        ||
                        user.username
                        ||
                        "U"
                    )
                        .charAt(0)
                        .toUpperCase();


                return `

                    <tr>

                        <td>
                            #${user.userId}
                        </td>


                        <td>

                            <div class="admin-user-name">

                                <div class="admin-user-avatar">
                                    ${escapeHtml(initial)}
                                </div>


                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            user.fullName
                                            || user.username
                                        )}
                                    </strong>

                                    <span>
                                        @${escapeHtml(user.username)}
                                    </span>
                                    <span class="admin-customer-code">
                                        Mã KH: ${escapeHtml(user.customerCode || "--")}
                                    </span>
                                    <span class="admin-customer-code">
                                        Hạng: ${user.customerTier === "VIP" ? "VIP ★" : "Thường"}
                                        · ${Number(user.completedPaidOrders || 0)} đơn
                                        · ${Number(user.qualifiedSpending || 0).toLocaleString("vi-VN")}đ
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${escapeHtml(
                                user.email || "--"
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                user.phone || "--"
                            )}
                        </td>


                        <td>

                            <span
                                class="
                                    admin-role-badge
                                    ${role.toLowerCase()}
                                "
                            >
                                ${
                                    role === "ADMIN"
                                        ? "Admin"
                                        : "Khách hàng"
                                }
                            </span>

                        </td>


                        <td>

                            <span
                                class="
                                    admin-user-status
                                    ${status.toLowerCase()}
                                "
                            >
                                ${
                                    status === "ACTIVE"
                                        ? "Hoạt động"
                                        : status === "DELETED"
                                            ? "Đã xóa"
                                            : "Đã khóa"
                                }
                            </span>

                        </td>


                        <td>
                            ${formatDate(
                                user.createdAt
                            )}
                        </td>


                        <td>

                            ${
                                role === "ADMIN"

                                ? `
                                    <button
                                        type="button"
                                        class="admin-user-action"
                                        disabled
                                    >
                                        Tài khoản Admin
                                    </button>
                                `

                                : status === "DELETED"
                                    ? `
                                        <div class="admin-user-actions">
                                            <button type="button" class="admin-user-restore"
                                                data-user-id="${user.userId}"
                                                data-username="${escapeHtml(user.username)}">
                                                Khôi phục
                                            </button>
                                            ${user.registrationReleased
                                                ? `<span class="admin-user-deleted-label">Đã mở đăng ký lại</span>`
                                                : `<button type="button" class="admin-user-release"
                                                    data-user-id="${user.userId}"
                                                    data-username="${escapeHtml(user.username)}">
                                                    Cho đăng ký lại
                                                </button>`}
                                        </div>
                                    `
                                    : `
                                        <div class="admin-user-actions">
                                            <button
                                                type="button"
                                                class="admin-user-action ${status === "ACTIVE" ? "block" : "unblock"}"
                                                data-user-id="${user.userId}"
                                                data-username="${escapeHtml(user.username)}"
                                                data-status="${status === "ACTIVE" ? "BLOCKED" : "ACTIVE"}"
                                            >
                                                ${status === "ACTIVE" ? "Khóa" : "Mở khóa"}
                                            </button>
                                            <button
                                                type="button"
                                                class="admin-user-delete"
                                                data-user-id="${user.userId}"
                                                data-username="${escapeHtml(user.username)}"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    `
                            }

                        </td>

                    </tr>
                `;

            })
            .join("");


    setupUserActionButtons();
    setupUserDeleteButtons();
    setupUserRestoreButtons();
    setupUserReleaseButtons();
}


 
 
 

function setupStatusFilters() {

    document
        .querySelectorAll(
            ".admin-user-filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".admin-user-filter"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );
                        });


                    button.classList.add(
                        "active"
                    );


                    currentUserStatusFilter =
                        button.dataset.status;


                    renderAdminUsers();
                }
            );
        });
}


 
 
 

function setupSearch() {

    const input =
        document.getElementById(
            "adminUserSearch"
        );


    const button =
        document.getElementById(
            "adminUserSearchButton"
        );


    async function search() {

        const keyword =
            input.value.trim();


        try {

            const response =
                await window.api.searchAdminUsers(
                    keyword
                );


            adminUsers =
                Array.isArray(response)
                    ? response
                    : [];


            renderAdminUsers();


        } catch (error) {

            showAdminUserMessage(
                error.message
                || "Không thể tìm kiếm tài khoản.",
                "error"
            );
        }
    }


    button.addEventListener(
        "click",
        search
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                search();
            }
        }
    );


    input.addEventListener(
        "input",
        () => {

            if (!input.value.trim()) {

                loadAdminUsers();
            }
        }
    );
}


 
 
 

function setupUserActionButtons() {

    document
        .querySelectorAll(
            ".admin-user-action[data-user-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const userId =
                        Number(
                            button.dataset.userId
                        );


                    const username =
                        button.dataset.username;


                    const status =
                        button.dataset.status;


                    await changeUserStatus(
                        userId,
                        username,
                        status
                    );
                }
            );
        });
}


 
 
 

function setupUserDeleteButtons() {
    document.querySelectorAll(".admin-user-delete[data-user-id]").forEach(button => {
        button.addEventListener("click", async () => {
            const userId = Number(button.dataset.userId);
            const username = button.dataset.username;
            const accepted = window.confirm(
                `Xóa tài khoản "${username}"? Tài khoản sẽ không thể đăng nhập. Lịch sử đơn hàng vẫn được giữ lại.`
            );
            if (!accepted) {
                return;
            }
            try {
                button.disabled = true;
                await window.api.deleteAdminUser(userId);
                showAdminUserMessage("Đã xóa tài khoản thành công.", "success");
                await loadAdminUsers();
            } catch (error) {
                showAdminUserMessage(error.message || "Không thể xóa tài khoản.", "error");
                button.disabled = false;
            }
        });
    });
}

function setupUserRestoreButtons() {
    document.querySelectorAll(".admin-user-restore[data-user-id]").forEach(button => {
        button.addEventListener("click", async () => {
            const accepted = window.confirm(
                `Khôi phục tài khoản "${button.dataset.username}"? Mã khách hàng và lịch sử đơn sẽ giữ nguyên.`
            );
            if (!accepted) return;
            button.disabled = true;
            try {
                await window.api.restoreAdminUser(Number(button.dataset.userId));
                showAdminUserMessage("Đã khôi phục tài khoản.", "success");
                await loadAdminUsers();
            } catch (error) {
                showAdminUserMessage(error.message || "Không thể khôi phục tài khoản.", "error");
                button.disabled = false;
            }
        });
    });
}

function setupUserReleaseButtons() {
    document.querySelectorAll(".admin-user-release[data-user-id]").forEach(button => {
        button.addEventListener("click", async () => {
            const accepted = window.confirm(
                `Cho phép đăng ký lại username và Gmail của "${button.dataset.username}"? ` +
                "Tài khoản cũ vẫn bị xóa và giữ lịch sử; tài khoản mới không nhận lại ưu đãi khách mới."
            );
            if (!accepted) return;
            button.disabled = true;
            try {
                await window.api.allowAdminUserRegistration(Number(button.dataset.userId));
                showAdminUserMessage("Đã mở quyền đăng ký lại. Cần xác minh OTP ở Gmail mới đăng ký.", "success");
                await loadAdminUsers();
            } catch (error) {
                showAdminUserMessage(error.message || "Không thể mở quyền đăng ký lại.", "error");
                button.disabled = false;
            }
        });
    });
}

async function changeUserStatus(
    userId,
    username,
    status
) {

    const actionText =
        status === "BLOCKED"
            ? "khóa"
            : "mở khóa";


    const confirmed =
        window.confirm(
            `Bạn có chắc muốn ${actionText} tài khoản "${username}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await window.api.updateAdminUserStatus(
            userId,
            status
        );


        showAdminUserMessage(
            status === "BLOCKED"
                ? "Khóa tài khoản thành công."
                : "Mở khóa tài khoản thành công.",
            "success"
        );


        await loadAdminUsers();


    } catch (error) {

        console.error(
            "Update user status error:",
            error
        );


        showAdminUserMessage(
            error.message
            || "Không thể cập nhật tài khoản.",
            "error"
        );
    }
}


 
 
 

function showAdminUserMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "adminMessage"
        );


    element.textContent =
        message;


    element.className =
        `admin-message ${type}`;


    setTimeout(
        () => {

            element.textContent = "";

            element.className =
                "admin-message";

        },
        3500
    );
}


 
 
 

function formatDate(value) {

    if (!value) {
        return "--";
    }


    return new Date(
        value
    ).toLocaleDateString(
        "vi-VN"
    );
}


 
 
 

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}