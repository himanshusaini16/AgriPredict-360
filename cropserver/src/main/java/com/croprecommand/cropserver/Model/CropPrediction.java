package com.croprecommand.cropserver.Model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "crop_predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropPrediction {

    @Id
    private String id;

    // userId
    private String userId;

    // 🔢 User entered values
    private float n;
    private float p;
    private float k;
    private float temperature;
    private float humidity;
    private float ph;
    private float rainfall;

    // 🌱 Prediction result
    private String crop;
    private double confidence;

    private LocalDateTime createdAt;
}
