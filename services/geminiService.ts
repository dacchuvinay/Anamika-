import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash';

const systemInstruction = `You are FitBot AI, a knowledgeable and encouraging fitness and nutrition assistant. 
Your goal is to provide safe, helpful, and motivational guidance to users. 
Do not provide medical advice. Keep your responses concise and easy to understand.
Encourage users on their fitness journey.`;

export const getAIAssistantResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: API Key is not configured. Please check your environment variables.";
  }
  
  try {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<Omit<FoodItem, 'id'>[]> => {
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: `Analyze the food items in this image. Identify each distinct item and estimate its calories. 
        Return the result as a JSON array of objects, where each object has a "name" (string) and "calories" (number). 
        For example: [{"name": "Scrambled Eggs", "calories": 150}, {"name": "Toast", "calories": 80}].
        If no food is identifiable, return an empty array.`
    };

    try {
        const response = await ai.models.generateContent({
            model: visionModel,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER }
                        },
                        required: ["name", "calories"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString);

        if (Array.isArray(parsedResult)) {
            return parsedResult as Omit<FoodItem, 'id'>[];
        }
        return [];

    } catch (error) {
        console.error("Error analyzing food image with Gemini API:", error);
        throw new Error("Failed to analyze image. The AI may be busy. Please try again.");
    }
};
