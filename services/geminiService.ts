import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogDraft = async (topic: string, context: string): Promise<{ title: string; content: string }> => {
  const model = "gemini-2.5-flash";

  const systemInstruction = `
    You are a professional, creative blog writer and journalist. 
    Your task is to write engaging, well-structured blog posts based on a topic or rough notes.
    Use Markdown formatting for the content (headers, bold, lists).
    Keep the tone thoughtful and personal, suitable for a daily journal or tech blog.
  `;

  const prompt = `
    Write a blog post draft.
    
    Topic/Title Idea: ${topic}
    Context/Notes: ${context}
    
    Return a JSON object with:
    1. A catchy 'title' (if the provided one is simple, improve it).
    2. The 'content' in Markdown format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated.");
    }

    const json = JSON.parse(text);
    return {
      title: json.title,
      content: json.content
    };

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};