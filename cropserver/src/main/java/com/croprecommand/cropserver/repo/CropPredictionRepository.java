package com.croprecommand.cropserver.repo;



import com.croprecommand.cropserver.Model.CropPrediction;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CropPredictionRepository
        extends MongoRepository<CropPrediction, String> {
    List<CropPrediction> findByUserId(String userId);
}
