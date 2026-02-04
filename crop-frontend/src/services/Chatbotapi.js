
export const getCropFromChatbot = async (formData) => {
  await new Promise((res) => setTimeout(res, 1000));

  const { ph, rainfall } = formData;

  if (ph >= 6 && ph <= 7 && rainfall > 150) return "Rice";
  if (rainfall < 100) return "Millet";

  return "Barley";
};
