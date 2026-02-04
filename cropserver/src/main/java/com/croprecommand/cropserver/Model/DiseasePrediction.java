package com.croprecommand.cropserver.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "disease_predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseasePrediction {

    @Id
    private String id;

    // userId
    private String userId;

    // 🖼 Image info
    private String imageUrl;

    // 🦠 Prediction
    private String disease;
    private double confidence;

    // 💊 Filled later by chatbot
    private String medicine;

    private LocalDateTime createdAt;
}
