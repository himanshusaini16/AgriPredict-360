// Dummy ChatBot API – medicine recommendation
export const getMedicineFromChatbot = async (diseaseName) => {
  await new Promise((res) => setTimeout(res, 700));

  const medicineMap = {
    "Leaf Blight": "Apply Fungicide B twice a week",
    "Powdery Mildew": "Use Sulfur-based fungicide",
    Healthy: "No medicine required",
  };

  return medicineMap[diseaseName] || "Consult agriculture expert";
};
