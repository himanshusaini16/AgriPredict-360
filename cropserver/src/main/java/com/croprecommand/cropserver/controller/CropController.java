package com.croprecommand.cropserver.controller;

import com.croprecommand.cropserver.Crop.CropRequest;
import com.croprecommand.cropserver.Crop.PredictionResult;
import com.croprecommand.cropserver.Model.CropPrediction;
import com.croprecommand.cropserver.Model.DiseasePrediction;
import com.croprecommand.cropserver.repo.CropPredictionRepository;
import com.croprecommand.cropserver.repo.DiseasePredictionRepository;
import com.croprecommand.cropserver.service.MlModelService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/crop")
public class CropController {

    private final MlModelService mlModelService;
    private final CropPredictionRepository cropRepo;
    private final DiseasePredictionRepository diseaseRepo;

    public CropController(MlModelService mlModelService,CropPredictionRepository cropRepo, DiseasePredictionRepository diseaseRepo) {
        this.mlModelService = mlModelService;
        this.cropRepo=cropRepo;
        this.diseaseRepo = diseaseRepo;
    }

    // =====================================================
    // 🌱 CROP PREDICTION (with userId)
    // =====================================================
    @PostMapping("/predict")
    public PredictionResult predictCrop(
            @RequestBody CropRequest req
    ) throws Exception {

        return mlModelService.predictCrop(
                req.getUserId(),          // ✅ userId
                req.getN(),
                req.getP(),
                req.getK(),
                req.getTemperature(),
                req.getHumidity(),
                req.getPh(),
                req.getRainfall()
        );
    }

    // =====================================================
    // 🦠 DISEASE PREDICTION (image + userId)
    // =====================================================
    @PostMapping(
            value = "/predict-disease",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public PredictionResult predictDisease(
            @RequestParam("image") MultipartFile image,
            @RequestParam("userId") String userId   // ✅ ADD THIS
    ) throws Exception {

        return mlModelService.predictDisease(
                image,
                userId
        );
    }

    @GetMapping("/all-crop/{userId}")
    public List<CropPrediction> getCropPredictionsByUser(
            @PathVariable String userId
    ) {
        return cropRepo.findByUserId(userId);
    }


    @GetMapping("/disease/{userId}")
    public List<DiseasePrediction> getDiseasePredictionsByUser(
            @PathVariable String userId
    ) {
        return diseaseRepo.findByUserId(userId);
    }

    @DeleteMapping("/delete-crop/{predictionId}")
    public void deleteCropPrediction(
            @PathVariable String predictionId
    ) {
        cropRepo.deleteById(predictionId);
    }

    @DeleteMapping("/disease/{predictionId}")
    public void deleteDiseasePrediction(
            @PathVariable String predictionId
    ) {
        diseaseRepo.deleteById(predictionId);
    }



}
