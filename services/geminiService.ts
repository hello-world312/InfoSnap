
import { GoogleGenAI, Type } from "@google/genai";
import { InfographicData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const infographicSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, catchy title for the infographic, summarizing the main topic."
    },
    sections: {
      type: Type.ARRAY,
      description: "An array of sections, each containing a header and key points.",
      items: {
        type: Type.OBJECT,
        properties: {
          header: {
            type: Type.STRING,
            description: "The header for this section of the infographic."
          },
          points: {
            type: Type.ARRAY,
            description: "A list of key bullet points for this section. Keep them concise.",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["header", "points"]
      }
    },
    quote: {
      type: Type.STRING,
      description: "An optional, impactful quote extracted from the text. If no suitable quote is found, this can be omitted."
    }
  },
  required: ["title", "sections"]
};

export async function generateInfographicData(text: string): Promise<InfographicData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following text and convert it into a structured format for an infographic. Extract a main title, several sections with a header and key points, and an optional powerful quote. The output MUST be a valid JSON object matching the provided schema. Do not include any text, markdown, or backticks outside of the JSON object itself.

      Text to analyze:
      ---
      ${text}
      ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: infographicSchema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text.trim();
    const data: InfographicData = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Error generating infographic data:", error);
    throw new Error("Failed to generate infographic. The AI may not have been able to process the text. Please try again with a different input.");
  }
}
