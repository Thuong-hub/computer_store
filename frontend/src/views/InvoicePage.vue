<!-- Markup được chuyển nguyên văn từ backend/src/main/resources/static/pages/invoice.html -->
<template>

    <div class="invoice-toolbar" id="invoiceToolbar">
        <div class="toolbar-brand">COMPUTER<span>STORE</span></div>
        <div class="toolbar-actions">
            <a id="returnToOrder" class="toolbar-back" href="/pages/orders.html">
                <span aria-hidden="true">←</span>
                <span>Quay lại đơn hàng</span>
            </a>
            <button id="printInvoiceButton" class="toolbar-print" type="button" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M7 8V3h10v5"/>
                    <rect x="4" y="8" width="16" height="10" rx="2"/>
                    <path d="M7 15h10v6H7z"/>
                    <path d="M17 11.5h.01"/>
                </svg>
                <span>In hóa đơn <small>· Lưu PDF</small></span>
            </button>
        </div>
    </div>

    <main class="invoice-shell">
        <div class="invoice-alert" id="invoiceMessage" role="status" aria-live="polite">Đang tải dữ liệu đơn hàng...</div>
        <article class="invoice-sheet" id="invoiceContent" aria-label="Phiếu bán hàng ComputerStore" hidden></article>
    </main>
</template>

<script setup>
import '../styles/pages-invoice.css'
import { useLegacyPage } from '../composables/useLegacyPage'

useLegacyPage({
  title: "In hóa đơn - ComputerStore",
  bodyClass: "",
  scripts: [
    () => import('../legacy/js/api.js?raw'),
    () => import('../legacy/js/invoice.js?raw'),
    () => import('../legacy/js/support-chat.js?raw'),
  ],
})
</script>
