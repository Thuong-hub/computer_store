document.addEventListener("DOMContentLoaded", () => {
    const ui=window.csAdmin;
    const today=new Date(), pad=n=>String(n).padStart(2,'0');
    const fmt=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    document.getElementById('reportTo').value=fmt(today);
    document.getElementById('reportFrom').value=fmt(new Date(today.getFullYear(),0,1));
    let report=null;
    const names={PENDING:'Chờ xử lý',CONFIRMED:'Đã xác nhận',SHIPPING:'Đang giao',COMPLETED:'Hoàn thành',CANCELLED:'Đã hủy'};
    function visibleOrders() {return report ? report.orders.filter(o => document.getElementById('orderStatusFilter').value==='ALL' || o.status===document.getElementById('orderStatusFilter').value) : [];}
    function showOrders() {
        const rows=visibleOrders();
        document.getElementById('reportRows').innerHTML=rows.length?rows.map(o=>`<tr><td>#${o.orderId}</td><td>${ui.escape(o.customer)}</td><td>${ui.date(o.createdAt)}</td><td>${ui.money(o.totalAmount)}</td><td>${ui.escape(o.paymentStatus)}</td><td><span class="enh-tag ${o.status.toLowerCase()}">${names[o.status] || ui.escape(o.status)}</span></td><td><a class="enh-link" href="/pages/admin/order-detail.html?id=${o.orderId}">Xem →</a></td></tr>`).join(''):'<tr><td colspan="7">Không có đơn hàng phù hợp.</td></tr>';
    }
    async function load() {
        const from=document.getElementById('reportFrom').value;
        const to=document.getElementById('reportTo').value;
        const group=document.getElementById('reportGroup').value;
        if (!from || !to || to<from) {ui.message('Khoảng ngày không hợp lệ.');return;}
        try {
            report=await window.api.request(`/api/admin/reports?${new URLSearchParams({from,to,group})}`);
            ui.message('Đã cập nhật báo cáo.',true);
            document.getElementById('reportRevenue').textContent=ui.money(report.revenue);
            document.getElementById('reportPaidPending').textContent=ui.money(report.paidButUncompleted);
            document.getElementById('reportOrders').textContent=report.orderCount;
            document.getElementById('reportCompleted').textContent=report.statuses.COMPLETED||0;
            const statuses=['PENDING','CONFIRMED','SHIPPING','COMPLETED','CANCELLED'];
            document.getElementById('reportStatus').innerHTML=statuses.map(s=>`<article class="s-${s.toLowerCase()}"><span>${names[s]}</span><strong>${report.statuses[s]||0}</strong></article>`).join('');
            const max=Math.max(1,...report.series.map(x=>Number(x.revenue)));
            document.getElementById('revenueChart').innerHTML=report.series.length ? report.series.map(x=>`<div class="enh-bar-col" title="${ui.escape(x.period)}: ${ui.money(x.revenue)}; ${x.orders} đơn"><span>${ui.money(x.revenue)}</span><div class="enh-bar-area"><div class="enh-bar" style="height:${Math.max(2,Number(x.revenue)/max*100)}%"></div></div><small>${ui.escape(x.period)}</small><em>${x.orders} đơn</em></div>`).join('') : '<p>Không có giao dịch hay đơn hàng trong khoảng đã chọn.</p>';
            showOrders();
        } catch(err) {ui.message(err.message);}
    }
    document.getElementById('reportForm').addEventListener('submit',e=>{e.preventDefault();load();});
    document.getElementById('orderStatusFilter').addEventListener('change',showOrders);
    document.getElementById('exportOrders').onclick=()=>{
        const head=['Mã đơn','Khách hàng','Ngày đặt','Tổng tiền','Thanh toán','Trạng thái'];
        const csv=[head,...visibleOrders().map(o=>[o.orderId,o.customer,o.createdAt,o.totalAmount,o.paymentStatus,o.status])].map(row=>row.map(val=>'"'+String(val??'').replaceAll('"','""')+'"').join(',')).join('\r\n');
        const link=document.createElement('a');const url=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'}));
        link.href=url;link.download='computerstore-orders.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
    load();
});
