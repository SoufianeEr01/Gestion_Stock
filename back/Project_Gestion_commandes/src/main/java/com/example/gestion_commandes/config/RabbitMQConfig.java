package com.example.gestion_commandes.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.MessageListenerContainer;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.gestion_commandes.messaging.StockAlertConsumer;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    public static final String STOCK_ALERT_QUEUE = "stock.alert";

    // Définition de la queue
    @Bean
    public Queue stockAlertQueue() {
        return new Queue(STOCK_ALERT_QUEUE, true); // Durable
    }

    // Convertisseur JSON
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Adapter avec méthode exacte et convertisseur
    @Bean
    public MessageListenerAdapter messageListenerAdapter(StockAlertConsumer listener,
                                                         Jackson2JsonMessageConverter converter) {
        MessageListenerAdapter adapter = new MessageListenerAdapter(listener, "recevoirAlerte"); // Méthode correcte
        adapter.setMessageConverter(converter); // Important
        return adapter;
    }

    // Listener container
    @Bean
    public MessageListenerContainer messageListenerContainer(ConnectionFactory connectionFactory,
                                                             MessageListenerAdapter listenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(STOCK_ALERT_QUEUE);
        container.setMessageListener(listenerAdapter);
        return container;
    }
}
