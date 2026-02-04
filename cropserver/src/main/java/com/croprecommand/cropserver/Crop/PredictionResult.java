package com.croprecommand.cropserver.Crop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PredictionResult {
    private String label;
    private double confidence;
}
