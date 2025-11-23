import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// NOTE: In a production environment, requests should be proxied through a backend 
// to keep the API key secure. For this demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const ai = new GoogleGenAI({ apiKey });

export const generateAIImages = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      },
    });

    const images: string[] = [];
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString: string = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          images.push(imageUrl);
        }
      }
    }
    
    return images;
  } catch (error) {
    console.error("Failed to generate image:", error);
    // Return a placeholder if API fails in this demo environment
    return ["https://picsum.photos/1280/720"];
  }
};

export const generateAICaptions = async (textDescription: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a catchy social media caption for a video about: ${textDescription}`,
        });
        return response.text || "Check out this amazing video!";
    } catch (error) {
        console.error("Failed to generate caption:", error);
        return "Video created with Robo AI";
    }
}
