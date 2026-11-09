package com.computerstore.backend.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class ResetMailConfig {
    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender resetMailSender(
            @Value("${SMTP_HOST:}") String host,
            @Value("${SMTP_PORT:587}") int port,
            @Value("${SMTP_USER:}") String username,
            @Value("${SMTP_PASSWORD:}") String password,
            @Value("${SMTP_AUTH:true}") boolean auth,
            @Value("${SMTP_STARTTLS:true}") boolean tls) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(username);
        sender.setPassword(password);
        sender.setDefaultEncoding("UTF-8");
        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", Boolean.toString(auth));
        props.put("mail.smtp.starttls.enable", Boolean.toString(tls));
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");
        return sender;
    }
}
