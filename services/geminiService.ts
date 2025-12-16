import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<{ imageUrl: string | null; textResponse: string | null }> => {
  try {
    const ai = getGeminiClient();
    
    // Using gemini-2.5-flash-image (Nano Banana) for image editing tasks
    const model = "gemini-2.5-flash-image";

    // Simpler prompt to reduce chance of refusal or text-only response
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    let imageUrl: string | null = null;
    let textResponse: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts;
      
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            const base64Response = part.inlineData.data;
            // The SDK or model usually defaults to PNG for edits.
            // Using a safe fallback if mimeType is missing in the response object.
            const responseMime = part.inlineData.mimeType || 'image/png'; 
            imageUrl = `data:${responseMime};base64,${base64Response}`;
          } else if (part.text) {
            textResponse = part.text;
          }
        }
      }
    }

    // Log for debugging if no image found
    if (!imageUrl && !textResponse) {
       console.warn("Gemini response was empty or malformed:", response);
    }

    return { imageUrl, textResponse };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process image with Gemini.");
  }
};