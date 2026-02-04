
export const getCropFromModel = async (formData) => {
  await new Promise((res) => setTimeout(res, 800));

  const { rainfall, temperature, nitrogen } = formData;

  if (rainfall > 200 && temperature > 25) return "Rice";
  if (nitrogen > 80) return "Sugarcane";
  if (temperature < 25) return "Wheat";

  return "Maize";
};
