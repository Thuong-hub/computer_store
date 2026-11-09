import { onMounted } from 'vue'

/**
 * Cầu nối giữa component Vue và script cũ (js/*.js, giữ nguyên 100%).
 *
 *  - Đặt <title> và class của <body> giống file HTML gốc.
 *  - Sau khi markup đã được Vue render, chạy các script cũ theo ĐÚNG thứ tự thẻ <script> gốc
 *    (script classic, scope global -> `window.api`, hàm global... hoạt động như trước),
 *  - rồi phát sự kiện DOMContentLoaded để các listener cũ (document.addEventListener("DOMContentLoaded"...))
 *    chạy như khi tải trang HTML.
 *
 * Khi muốn viết lại 1 trang bằng Vue "thuần": xoá lời gọi này trong trang đó,
 * chuyển logic sang <script setup> (ref/computed/onMounted) và import api qua module.
 */
export function useLegacyPage({ title, bodyClass = '', scripts = [] }) {
  document.title = title
  document.body.className = bodyClass

  onMounted(async () => {
    const sources = (await Promise.all(scripts.map(load => load()))).map(m => m.default)
    for (const code of sources) {
      const el = document.createElement('script')
      el.textContent = code
      document.body.appendChild(el)
    }
    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }))
  })
}
