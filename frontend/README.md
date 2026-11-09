# Computer Store – Frontend (Vue 3 + Vite)

Frontend tách riêng khỏi `backend/`. **Không file nào trong `backend/` bị sửa**, và toàn bộ CSS/JS gốc
được copy nguyên văn (giống từng byte) nên giao diện và logic giữ nguyên.

## Chạy

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173  (proxy /api và /images -> http://localhost:8080)
npm run build      # xuất ra dist/
```

Backend Spring Boot vẫn chạy như cũ (`./mvnw spring-boot:run`, cổng 8080).
Nếu backend chạy cổng khác: `BACKEND_URL=http://localhost:9090 npm run dev`.

## Cấu trúc

```
frontend/
  index.html                  # điểm vào Vite (#app dùng display:contents để không tạo thêm box layout)
  vite.config.js              # plugin Vue (giữ whitespace), proxy /api, /images
  src/
    main.js, App.vue          # khởi tạo app + <router-view>
    router/index.js           # URL giữ nguyên: /, /pages/login.html, /pages/admin/orders.html ...
    composables/useLegacyPage.js   # chạy script cũ + phát DOMContentLoaded sau khi Vue render
    views/*.vue, views/admin/*.vue # mỗi trang HTML cũ = 1 component (markup nguyên văn trong <template>)
    styles/<trang>.css        # chỉ chứa @import các file css gốc theo ĐÚNG thứ tự thẻ <link> cũ
    assets/css/**             # CSS gốc, không sửa
    legacy/js/**              # JS gốc, không sửa (api.js, cart.js, pc-builder.js ...)
```

## Cách hoạt động

- Mỗi trang là 1 component; markup được chuyển nguyên văn vào `<template>`.
- Script cũ được nạp bằng `useLegacyPage()` theo đúng thứ tự thẻ `<script>` ban đầu, nên `window.api`,
  `getElementById`, `localStorage("token")`... hoạt động y như trước.
- URL không đổi, nên `<a href="/pages/cart.html">`, `window.location.href = ...` và các redirect cũ
  (`/pages/admin-orders.html` -> `/pages/admin/orders.html`) đều còn dùng được.
- Điều hướng giữa các trang là tải trang thật (như bản HTML nhiều trang), vì script cũ khởi tạo biến global một lần/trang.

## Viết lại dần sang Vue "thuần"

Làm từng trang một: mở `views/XxxPage.vue`, bỏ `useLegacyPage(...)`, chuyển logic của `legacy/js/xxx.js`
sang `<script setup>` (`ref`, `computed`, `onMounted`), thay `getElementById` bằng binding (`v-for`, `v-if`, `v-model`).
Các trang khác không bị ảnh hưởng. Khi cả trang đã chuyển xong có thể xoá file JS cũ tương ứng.
Nên bắt đầu với trang nhỏ: `login`, `forgot-password`, `verify-email`.

## Ghi chú

- `checkout.html` gốc thiếu 1 thẻ `</div>` (trình duyệt tự đóng). Bản Vue thêm tường minh thẻ này (xem comment đầu file) –
  DOM kết quả giống hệt; bản gốc trong `backend/` không đổi.
- `admin/sales.html` chỉ là trang chuyển hướng -> thành route `redirect` sang `/pages/admin/promotions.html`.
- Triển khai production: serve `dist/` bằng web server (nginx...) có fallback `try_files $uri /index.html`
  và proxy `/api`, `/images` về backend.
