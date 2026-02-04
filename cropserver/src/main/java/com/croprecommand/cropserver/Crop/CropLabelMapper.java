package com.croprecommand.cropserver.Crop;

import java.util.List;

public class CropLabelMapper {

    private static final List<String> CROPS = List.of(
            "apple", "banana", "blackgram", "chickpea",
            "coconut", "coffee", "cotton", "grapes",
            "jute", "kidneybeans", "lentil", "maize",
            "mango", "mothbeans", "mungbean", "muskmelon",
            "orange", "papaya", "pigeonpeas", "pomegranate",
            "rice", "watermelon"
    );

    public static String getCropName(int index) {
        return CROPS.get(index);
    }
}

