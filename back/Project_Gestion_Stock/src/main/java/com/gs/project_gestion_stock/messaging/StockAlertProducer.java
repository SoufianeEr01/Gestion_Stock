package com.gs.project_gestion_stock.messaging;

import com.gs.project_gestion_stock.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StockAlertProducer {

    private final RabbitTemplate rabbitTemplate;

    public StockAlertProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendStockAlert(String produitId, int quantiteRestante) {
        Map<String, Object> message = new HashMap<>();
        message.put("produitId", produitId);
        message.put("quantiteRestante", quantiteRestante);
        rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_NAME, message);
    }
}
