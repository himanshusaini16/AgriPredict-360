package com.croprecommand.cropserver.Crop;

public class CropRequest {

    private String userId;
    private float n;
    private float p;
    private float k;
    private float temperature;
    private float humidity;
    private float ph;
    private float rainfall;

    public CropRequest() {}

    public CropRequest(String userId,float n, float p, float k,
                       float temperature, float humidity,
                       float ph, float rainfall) {
        this.userId = userId;
        this.n = n;
        this.p = p;
        this.k = k;
        this.temperature = temperature;
        this.humidity = humidity;
        this.ph = ph;
        this.rainfall = rainfall;
    }

    public float getN() { return n; }
    public void setN(float n) { this.n = n; }

    public float getP() { return p; }
    public void setP(float p) { this.p = p; }

    public float getK() { return k; }
    public void setK(float k) { this.k = k; }

    public float getTemperature() { return temperature; }
    public void setTemperature(float temperature) { this.temperature = temperature; }

    public float getHumidity() { return humidity; }
    public void setHumidity(float humidity) { this.humidity = humidity; }

    public float getPh() { return ph; }
    public void setPh(float ph) { this.ph = ph; }

    public float getRainfall() { return rainfall; }
    public void setRainfall(float rainfall) { this.rainfall = rainfall; }

    public String getUserId() {
        return userId;
    }
}
