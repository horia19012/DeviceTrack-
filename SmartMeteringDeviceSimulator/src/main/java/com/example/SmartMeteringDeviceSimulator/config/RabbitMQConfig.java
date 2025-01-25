package com.example.SmartMeteringDeviceSimulator.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    // Define the queue
    @Bean
    public Queue deviceQueue() {
        return new Queue("device_queue", true);  // Durable queue
    }

    // Define the exchange
    @Bean
    public DirectExchange deviceExchange() {
        return new DirectExchange("device_exchange", true, false);  // Durable and non-auto-delete exchange
    }

    // Bind the queue to the exchange with a routing key
    @Bean
    public Binding binding(Queue deviceQueue, DirectExchange deviceExchange) {
        return BindingBuilder.bind(deviceQueue).to(deviceExchange).with("device_routing_key");
    }

    // RabbitTemplate bean
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    // JSON message converter for RabbitMQ
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}