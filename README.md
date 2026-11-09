# Computer Store – Website bán linh kiện & máy tính

Đồ án cuối kỳ: website thương mại điện tử chuyên bán máy tính và linh kiện, gồm **trang mua hàng cho khách** và **trang quản trị cho admin**. Điểm nhấn là công cụ **PC Builder** tự kiểm tra tính tương thích giữa các linh kiện, thanh toán chuyển khoản qua **SePay** và hệ thống **khuyến mãi tự động**.

> Dự án chạy ở môi trường local, được xây dựng để học và thực hành xây dựng ứng dụng web full-stack.

---

##  Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc & cấu trúc thư mục](#-kiến-trúc--cấu-trúc-thư-mục)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [Hướng dẫn cài đặt & chạy](#-hướng-dẫn-cài-đặt--chạy)
- [Cấu hình](#-cấu-hình)
- [Ảnh chụp màn hình](#-ảnh-chụp-màn-hình)
- [Hướng phát triển](#-hướng-phát-triển)

---

##  Tính năng

###  Khách hàng
- Đăng ký, đăng nhập (JWT), **xác thực email**, **quên / đặt lại mật khẩu** qua email, đổi email có xác nhận
- Xem danh sách sản phẩm, lọc theo danh mục / thương hiệu, xem chi tiết và thông số kỹ thuật
- **Giỏ hàng**, **danh sách yêu thích**, đặt hàng và theo dõi đơn hàng
- **Thanh toán chuyển khoản qua SePay** (tự động xác nhận thanh toán bằng webhook)
- **PC Builder**: tự chọn linh kiện để lắp cấu hình máy và kiểm tra tương thích (ví dụ CPU – Mainboard)
- **Đánh giá sản phẩm**
- **Khuyến mãi** và **ưu đãi thành viên** (phân hạng khách hàng / VIP)
- Yêu cầu và xem **hóa đơn**
- **Chat hỗ trợ** trực tiếp với cửa hàng
- Quản lý thông tin cá nhân

### Quản trị viên (Admin)
- **Dashboard** thống kê tổng quan và **báo cáo**
- Quản lý **sản phẩm**, danh mục, thương hiệu
- Quản lý **tồn kho** (lịch sử nhập / xuất kho)
- Quản lý **đơn hàng** (xem chi tiết, cập nhật trạng thái)
- Quản lý **khuyến mãi**; tự động gán nhãn *Bestseller* (giảm giá) cho sản phẩm bán chạy và tự tạo lịch **Black Friday**
- Quản lý **người dùng**, **đánh giá**, **yêu cầu in hóa đơn**
- Trả lời **chat hỗ trợ** khách hàng

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring MVC (REST API) |
| Bảo mật | Spring Security, JWT (jjwt 0.12) |
| Truy cập dữ liệu | Spring Data JPA / Hibernate |
| Cơ sở dữ liệu | MySQL |
| Gửi email | Spring Boot Starter Mail (SMTP Gmail) |
| Thanh toán | SePay (webhook) |
| Frontend | Vue 3, Vue Router, Vite |
| Build tool | Maven (Maven Wrapper), npm |

---

## Kiến trúc & cấu trúc thư mục

Ứng dụng tách thành 2 phần: frontend Vue giao tiếp với backend Spring Boot qua REST API (`/api/...`). Khi chạy dev, Vite proxy các request `/api` và `/images` sang backend.

```
computer_store/
├── backend/                  # Spring Boot REST API
│   ├── pom.xml
│   ├── config/
│   │   └── application.properties.example   # Mẫu cấu hình cá nhân (SMTP, SePay)
│   └── src/main/
│       ├── java/com/computerstore/backend/
│       │   ├── config/       # Cấu hình Security, mail...
│       │   ├── controller/   # admin, auth, builder, catalog, commerce, account, support
│       │   ├── service/      # Xử lý nghiệp vụ
│       │   ├── repository/   # Truy vấn dữ liệu (JPA)
│       │   ├── dto/          # Đối tượng request / response
│       │   └── ...
│       └── resources/
│           ├── application.properties    # Cấu hình chung (không chứa secret)
│           └── static/images/products/   # Ảnh sản phẩm
├── frontend/                 # Giao diện Vue 3 + Vite
│   └── src/
│       ├── router/
│       └── views/            # Các trang khách hàng + views/admin
└── database/
    └── computer_store.sql    # Script tạo CSDL + dữ liệu mẫu (đã ẩn danh)
```

---

## Cơ sở dữ liệu

Gồm khoảng 26 bảng, các nhóm chính:

- **Người dùng & xác thực:** `users`, `email_verification_tokens`, `password_reset_tokens`, `email_change_requests`
- **Danh mục sản phẩm:** `products`, `categories`, `brands`, `component_specs`
- **Mua hàng:** `cart`, `cart_items`, `orders`, `order_items`, `payments`, `wishlist`
- **PC Builder:** `pc_builds`, `pc_build_items`
- **Khuyến mãi & thành viên:** `promotions`, `product_promotions`, `promotion_redemptions`, `member_benefit_usage`
- **Vận hành:** `inventory_movements`, `invoice_print_requests`, `reviews`, `support_conversations`, `support_messages`

---

## Hướng dẫn cài đặt & chạy

### Yêu cầu
- JDK 21
- Node.js 18 trở lên
- MySQL 8

### 1. Tải mã nguồn
```bash
git clone https://github.com/<ten-ban>/<ten-repo>.git
cd <ten-repo>
```

### 2. Tạo cơ sở dữ liệu
```sql
CREATE DATABASE computer_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Sau đó import dữ liệu:
```bash
mysql -u root -p computer_store < database/computer_store.sql
```

### 3. Cấu hình backend
Mặc định backend kết nối MySQL tại `localhost:3306` với user `root`, mật khẩu rỗng. Nếu MySQL của bạn khác, hoặc muốn bật chức năng gửi email, hãy tạo file cấu hình cá nhân (xem phần [Cấu hình](#-cấu-hình)):
```bash
cd backend/config
cp application.properties.example application.properties
# rồi mở file application.properties và điền thông tin của bạn
```

### 4. Chạy backend (cổng 8080)
```bash
cd backend
./mvnw spring-boot:run        # Linux / macOS
.\mvnw spring-boot:run        # Windows PowerShell
```

### 5. Chạy frontend (cổng 5173)
```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại **http://localhost:5173**

### 6. Tài khoản demo

Dữ liệu trong `database/computer_store.sql` là **dữ liệu mẫu** (tên, email, số điện thoại đều là giả):

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin01` | `Admin@123` |
| Khách hàng | `user01` | `123456789` |

> Chức năng gửi email (xác thực, quên mật khẩu) chỉ hoạt động khi bạn cấu hình SMTP. Thông tin thanh toán SePay trong dữ liệu mẫu là số tài khoản giả, chỉ để minh họa giao diện.

---

## Cấu hình

Các thông số chính trong `application.properties`:

| Thông số | Ý nghĩa |
|---|---|
| `spring.datasource.*` | Kết nối MySQL (mặc định `localhost:3306/computer_store`) |
| `jwt.secret`, `jwt.expiration` | Khóa ký và thời hạn token đăng nhập |
| `SMTP_USER`, `SMTP_PASSWORD` | Tài khoản Gmail và **Mật khẩu ứng dụng** dùng để gửi email xác thực / đặt lại mật khẩu |
| `PUBLIC_BASE_URL` | Địa chỉ gốc dùng để tạo link trong email |
| `sepay.*` | Thông tin tài khoản ngân hàng và khóa webhook của SePay |
| `store.bestseller.*` | Quy tắc tự động gán nhãn sản phẩm bán chạy |
| `store.blackfriday.auto-enabled` | Bật / tắt tự động tạo lịch Black Friday |

Cách đặt cấu hình cá nhân (chọn 1 trong 2):

1. **Biến môi trường:** đặt `SMTP_USER`, `SMTP_PASSWORD`, `SEPAY_WEBHOOK_SECRET`... trước khi chạy backend.
2. **File cấu hình riêng:** tạo `backend/config/application.properties` (copy từ file `.example`). Spring Boot tự nạp file này và ưu tiên hơn file mặc định.

>  File `backend/config/application.properties` đã được thêm vào `.gitignore`, **không commit** thông tin SMTP / secret thật lên Git.

---

## Ảnh chụp màn hình

> Thêm ảnh vào thư mục `docs/screenshots/` rồi cập nhật đường dẫn bên dưới.

| Trang chủ | Chi tiết sản phẩm |
|---|---|
| ![Trang chủ](docs/screenshots/home.png) | ![Chi tiết sản phẩm](docs/screenshots/product-detail.png) |

| PC Builder | Giỏ hàng & thanh toán |
|---|---|
| ![PC Builder](docs/screenshots/pc-builder.png) | ![Thanh toán](docs/screenshots/checkout.png) |

| Dashboard Admin | Quản lý đơn hàng |
|---|---|
| ![Dashboard](docs/screenshots/admin-dashboard.png) | ![Đơn hàng](docs/screenshots/admin-orders.png) |

---

## Hướng phát triển

- Đóng gói bằng Docker / Docker Compose để chạy chỉ với một lệnh
- Viết thêm unit test và integration test
- Tài liệu hóa API bằng Swagger / OpenAPI
- Triển khai (deploy) lên cloud

---

## Tác giả

   Nguyễn Ngọc Thương – Sinh viên Cao đẳng Kinh tế TP.HCM / Phát triển web · [GitHub](https://github.com/Thuong-hub)
