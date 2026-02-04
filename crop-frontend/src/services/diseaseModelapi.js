// Dummy ML disease model API
export const getDiseaseFromModel = async (imageFile) => {
  await new Promise((res) => setTimeout(res, 800));

  // Simulate ML output
  const diseases = ["Leaf Blight", "Powdery Mildew", "Healthy"];
  return diseases[Math.floor(Math.random() * diseases.length)];
};
