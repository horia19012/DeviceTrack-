package com.example.MonitoringAndCommunication.config;

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

    // Define the device monitoring queue (existing)
    @Bean
    public Queue deviceMonitoringQueue() {
        return new Queue("device_monitoring_queue", true);  // Durable queue
    }

    // Define an additional queue (existing)
    @Bean
    public Queue deviceQueue() {
        return new Queue("device_queue", true);  // Durable queue
    }

    // Define the existing device exchange
    @Bean
    public DirectExchange deviceExchange() {
        return new DirectExchange("device_monitoring_exchange", true, false);  // Durable and non-auto-delete exchange
    }

    // Bind device monitoring queue to device exchange with a routing key
    @Bean
    public Binding deviceMonitoringBinding(Queue deviceMonitoringQueue, DirectExchange deviceExchange) {
        return BindingBuilder.bind(deviceMonitoringQueue).to(deviceExchange).with("device_monitoring_routing_key");
    }

    // Bind deviceQueue to device exchange with another routing key
    @Bean
    public Binding deviceQueueBinding(Queue deviceQueue, DirectExchange deviceExchange) {
        return BindingBuilder.bind(deviceQueue).to(deviceExchange).with("device_routing_key");
    }

    // RabbitTemplate bean with JSON message converter
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
