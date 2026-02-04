package com.croprecommand.cropserver.service;

import ai.onnxruntime.*;
import com.cloudinary.Cloudinary;
import com.croprecommand.cropserver.Crop.CropLabelMapper;
import com.croprecommand.cropserver.Crop.PredictionResult;

import com.croprecommand.cropserver.Model.CropPrediction;
import com.croprecommand.cropserver.Model.DiseasePrediction;
import com.croprecommand.cropserver.repo.CropPredictionRepository;
import com.croprecommand.cropserver.repo.DiseasePredictionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class MlModelService {

    private final ClassIndexService classIndexService;
    private final CropPredictionRepository cropRepo;
    private final DiseasePredictionRepository diseaseRepo;
    private final Cloudinary cloudinary;

    private OrtEnvironment env;
    private OrtSession cropSession;
    private OrtSession diseaseSession;

    // ✅ SINGLE constructor (important)
    public MlModelService(
            ClassIndexService classIndexService,
            CropPredictionRepository cropRepo,
            DiseasePredictionRepository diseaseRepo,
            Cloudinary cloudinary
    ) {
        this.classIndexService = classIndexService;
        this.cropRepo = cropRepo;
        this.diseaseRepo = diseaseRepo;
        this.cloudinary =cloudinary;
    }

    @Value("${debug.config:NOT_LOADED}")
    private String debug;

    @PostConstruct
    public void checkConfig() {
        System.out.println("🔥 CONFIG FILE = " + debug);
    }


    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void logMongoDbName() {
        System.out.println("🔥 MongoDB IN USE: " + mongoTemplate.getDb().getName());
    }


    // =====================================================
    // 🔄 LOAD MODELS
    // =====================================================
    @PostConstruct
    public void loadModels() throws Exception {
        env = OrtEnvironment.getEnvironment();
        cropSession = loadModel("models/crop_rf_model.onnx");
        diseaseSession = loadModel("models/crop_disease_model.onnx");
        System.out.println("✅ ONNX models loaded");
    }

    private OrtSession loadModel(String path) throws Exception {
        try (var is = getClass().getClassLoader().getResourceAsStream(path)) {
            if (is == null) {
                throw new RuntimeException("❌ Model not found: " + path);
            }
            return env.createSession(is.readAllBytes(), new OrtSession.SessionOptions());
        }
    }

    // =====================================================
    // 🌱 CROP PREDICTION + SAVE ALL INPUTS
    // =====================================================
    public PredictionResult predictCrop(
            String userId,
            float n, float p, float k,
            float temperature, float humidity,
            float ph, float rainfall
    ) throws Exception {

        float[][] inputData = {{
                n, p, k, temperature, humidity, ph, rainfall
        }};

        try (OnnxTensor tensor = OnnxTensor.createTensor(env, inputData)) {

            String inputName = cropSession.getInputInfo()
                    .keySet().iterator().next();

            OrtSession.Result result =
                    cropSession.run(Map.of(inputName, tensor));

            long[] labelArr =
                    (long[]) result.get("output_label").get().getValue();

            int index = (int) labelArr[0];
            String cropName = CropLabelMapper.getCropName(index);

            Object probObj =
                    result.get("output_probability").get().getValue();

            double confidence;

            if (probObj instanceof float[][] probs) {
                confidence = probs[0][index] * 100;
            } else {
                @SuppressWarnings("unchecked")
                OnnxMap map =
                        (OnnxMap) ((java.util.List<?>) probObj).get(0);

                @SuppressWarnings("unchecked")
                Map<Long, Float> probMap =
                        (Map<Long, Float>) map.getValue();

                confidence = probMap.get((long) index) * 100;
            }

            confidence = Math.round(confidence * 100.0) / 100.0;

            // ✅ SAVE EVERYTHING TO MONGODB
            CropPrediction data =
                    CropPrediction.builder()
                            .userId(userId)
                            .n(n)
                            .p(p)
                            .k(k)
                            .temperature(temperature)
                            .humidity(humidity)
                            .ph(ph)
                            .rainfall(rainfall)
                            .crop(cropName)
                            .confidence(confidence)
                            .createdAt(LocalDateTime.now())
                            .build();

            cropRepo.save(data);
            System.out.println("✅ Crop saved to MongoDB: " + data);

            return new PredictionResult(cropName, confidence);
        }
    }



    // =====================================================
    // 🦠 DISEASE PREDICTION (IMAGE → CNN → SAVE)
    // =====================================================
    public PredictionResult predictDisease(MultipartFile image,String userId) throws Exception {

        // 1️⃣ Upload image to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                image.getBytes(),
                Map.of(
                        "folder", "crop_disease",
                        "resource_type", "image"
                )
        );

        String imageUrl = uploadResult.get("secure_url").toString();

        // 2️⃣ Preprocess image for CNN
        float[][][][] imageTensor = preprocessImage(image);

        // 3️⃣ Predict disease
        PredictionResult result = predictDisease(imageTensor);

        // 4️⃣ Save prediction to MongoDB
        DiseasePrediction data =
                DiseasePrediction.builder()
                        .userId(userId)
                        .imageUrl(imageUrl)   // ✅ Cloudinary URL
                        .disease(result.getLabel())
                        .confidence(result.getConfidence())
                        .medicine(null) // chatbot fills later
                        .createdAt(LocalDateTime.now())
                        .build();

        diseaseRepo.save(data);

        return result;
    }


    public PredictionResult predictDisease(float[][][][] imageTensor)
            throws Exception {

        try (OnnxTensor tensor =
                     OnnxTensor.createTensor(env, imageTensor)) {

            String inputName = diseaseSession
                    .getInputInfo().keySet().iterator().next();

            OrtSession.Result result =
                    diseaseSession.run(Map.of(inputName, tensor));

            float[][] probs =
                    (float[][]) result.get(0).getValue();

            int classId = 0;
            float max = probs[0][0];

            for (int i = 1; i < probs[0].length; i++) {
                if (probs[0][i] > max) {
                    max = probs[0][i];
                    classId = i;
                }
            }

            return new PredictionResult(
                    classIndexService.getDiseaseName(classId),
                    Math.round(max * 10000.0) / 100.0
            );
        }
    }

    // =====================================================
    // 🖼 IMAGE PREPROCESSING (64x64, /255)
    // =====================================================
    private float[][][][] preprocessImage(MultipartFile file) throws Exception {

        BufferedImage original = ImageIO.read(file.getInputStream());

        BufferedImage resized =
                new BufferedImage(64, 64, BufferedImage.TYPE_3BYTE_BGR);

        Graphics2D g = resized.createGraphics();
        g.drawImage(original, 0, 0, 64, 64, null);
        g.dispose();

        float[][][][] input = new float[1][64][64][3];

        for (int y = 0; y < 64; y++) {
            for (int x = 0; x < 64; x++) {
                int pixel = resized.getRGB(x, y);

                input[0][y][x][0] = ((pixel >> 16) & 0xFF) / 255.0f;
                input[0][y][x][1] = ((pixel >> 8) & 0xFF) / 255.0f;
                input[0][y][x][2] = (pixel & 0xFF) / 255.0f;
            }
        }
        return input;
    }


}
