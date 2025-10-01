export const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Failed to analyze image");
  }

  return await response.json();
};
