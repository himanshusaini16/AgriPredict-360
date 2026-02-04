package com.croprecommand.cropserver.Model;

public class DiseaseRequest {

    // Image path OR base64 (choose one approach)
    private String imagePath;

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}

