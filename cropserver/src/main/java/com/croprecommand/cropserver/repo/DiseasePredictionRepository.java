package com.croprecommand.cropserver.repo;

import com.croprecommand.cropserver.Model.DiseasePrediction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DiseasePredictionRepository
        extends MongoRepository<DiseasePrediction, String> {

    List<DiseasePrediction> findByUserId(String userId);

}
