package com.computerstore.backend.service.commerce;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.computerstore.backend.entity.User;
import com.computerstore.backend.repository.MemberBenefitUsageRepository;
import com.computerstore.backend.repository.OrderRepository;
import com.computerstore.backend.repository.UserRepository;
import com.computerstore.backend.service.auth.CustomerEmailHistoryService;

class MembershipServiceTest {

    @Test
    void vipDiscountIsTwentyPercentOfTheOrderTotal() {
        UserRepository users = mock(UserRepository.class);
        OrderRepository orders = mock(OrderRepository.class);
        MemberBenefitUsageRepository usages = mock(MemberBenefitUsageRepository.class);
        CustomerEmailHistoryService emails = mock(CustomerEmailHistoryService.class);
        when(orders.countQualifiedVipOrders(1L)).thenReturn(10L);
        when(orders.sumQualifiedVipSpending(1L)).thenReturn(new BigDecimal("300000000"));

        MembershipService service = new MembershipService(users, orders, usages, emails);
        User user = new User();
        user.setUserId(1L);
        user.setCustomerCode("CUS-1");
        user.setCustomerTier("VIP");

        MembershipService.Quote quote = service.quote(user, new BigDecimal("50000000"));

        assertEquals(20, quote.percent());
        assertEquals(0, new BigDecimal("10000000.00").compareTo(quote.discountAmount()));
        assertEquals(0, new BigDecimal("40000000.00").compareTo(quote.totalAmount()));

        MembershipService.Quote smallerOrder = service.quote(user, new BigDecimal("1000000"));
        assertEquals(20, smallerOrder.percent());
        assertEquals(0, new BigDecimal("200000.00").compareTo(smallerOrder.discountAmount()));
    }
}
