package com.croprecommand.cropserver.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class ClassIndexService {

    private final Map<Integer, String> idxToClass = new HashMap<>();

    @PostConstruct
    public void loadClassIndices() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = new ClassPathResource("class_indices.json").getInputStream();

        Map<String, Integer> classIndices =
                mapper.readValue(is, new TypeReference<>() {});

        classIndices.forEach((label, index) ->
                idxToClass.put(index, label));
    }

    // Explicit name (clear intent)
    public String getDiseaseName(int index) {
        return idxToClass.getOrDefault(index, "Unknown disease");
    }
}

