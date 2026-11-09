package com.computerstore.backend.service.admin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.computerstore.backend.entity.Order;
import com.computerstore.backend.entity.Payment;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.PaymentRepository;

@Service
public class AdminReportService {
    private final OrderRepository orders;
    private final PaymentRepository payments;
    public AdminReportService(OrderRepository orders, PaymentRepository payments) {
        this.orders = orders;
        this.payments = payments;
    }

    @Transactional(readOnly = true)
    public Map<String,Object> report(LocalDate from, LocalDate to, String group) {
        if (from == null || to == null || to.isBefore(from)
                || ChronoUnit.DAYS.between(from,to) > 730) {
            throw new IllegalArgumentException("Chọn khoảng thời gian hợp lệ, tối đa 731 ngày");
        }
        if (!List.of("day", "month", "year").contains(group)) {
            throw new IllegalArgumentException("Kiểu thống kê không hợp lệ");
        }
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();
        List<Order> datedOrders = orders.findByCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByCreatedAtDesc(start,end);
        List<Payment> datedPayments = payments.findByPaymentStatusAndPaidAtGreaterThanEqualAndPaidAtLessThan("PAID",start,end);

    
        BigDecimal revenue = BigDecimal.ZERO;
        BigDecimal paidButUncompleted = BigDecimal.ZERO;
        Map<String,BigDecimal> revenueBuckets = new TreeMap<>();
        for (Payment payment : datedPayments) {
            Order order = orders.findById(payment.getOrderId()).orElse(null);
            if (order == null || "CANCELLED".equals(order.getStatus())) continue;
            if ("COMPLETED".equals(order.getStatus())) {
                revenue = revenue.add(payment.getAmount());
                revenueBuckets.merge(bucket(payment.getPaidAt(), group), payment.getAmount(), BigDecimal::add);
            } else {
                paidButUncompleted = paidButUncompleted.add(payment.getAmount());
            }
        }

        Map<String,Long> statuses = new HashMap<>();
        for (String status : List.of("PENDING","CONFIRMED","SHIPPING","COMPLETED","CANCELLED")) statuses.put(status,0L);
        Map<String,Long> orderBuckets = new TreeMap<>();
        for (Order order : datedOrders) {
            statuses.merge(order.getStatus(),1L,Long::sum);
            orderBuckets.merge(bucket(order.getCreatedAt(), group),1L,Long::sum);
        }
        List<Long> ids = datedOrders.stream().map(Order::getOrderId).toList();
        Map<Long,String> paymentStatus = new HashMap<>();
        if (!ids.isEmpty()) for (Payment payment : payments.findByOrderIdIn(ids)) {
            paymentStatus.put(payment.getOrderId(),payment.getPaymentStatus());
        }
        List<Map<String,Object>> rows = new ArrayList<>();
        for (Order order : datedOrders) {
            Map<String,Object> row = new HashMap<>();
            row.put("orderId",order.getOrderId());
            row.put("customer",order.getRecipientName());
            row.put("createdAt",order.getCreatedAt());
            row.put("totalAmount",order.getTotalAmount());
            row.put("status",order.getStatus());
            row.put("paymentStatus",paymentStatus.getOrDefault(order.getOrderId(),"PENDING"));
            rows.add(row);
        }
        Map<String,Map<String,Object>> seriesMap = new TreeMap<>();
        revenueBuckets.forEach((key,value) -> seriesMap.computeIfAbsent(key,k->new HashMap<>()).put("revenue",value));
        orderBuckets.forEach((key,value) -> seriesMap.computeIfAbsent(key,k->new HashMap<>()).put("orders",value));
        List<Map<String,Object>> series = new ArrayList<>();
        seriesMap.forEach((key,value) -> {
            value.putIfAbsent("revenue",BigDecimal.ZERO);
            value.putIfAbsent("orders",0L);
            value.put("period",key);
            series.add(value);
        });
        return Map.of("from",from,"to",to,"group",group,"revenue",revenue,
            "paidButUncompleted",paidButUncompleted,"orderCount",datedOrders.size(),
            "statuses",statuses,"series",series,"orders",rows);
    }

    private String bucket(LocalDateTime date, String group) {
        if ("year".equals(group)) return String.valueOf(date.getYear());
        if ("month".equals(group)) return String.format("%04d-%02d",date.getYear(),date.getMonthValue());
        return date.toLocalDate().toString();
    }
}
