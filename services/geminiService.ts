import { GoogleGenAI, Type } from "@google/genai";
import { type Question, type Answer, type CareerResult, CAREER_PATHS } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getQuestions(): Promise<Question[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "You are an expert career counselor. Generate 10 diverse multiple-choice questions for a career compass quiz, in Arabic. The questions should be comprehensive to help determine a person's interests, skills, and personality traits relevant to professional inclinations. Return the response as a JSON object that strictly follows the provided schema. Do not include any markdown formatting or escape characters in your response.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The question text in Arabic."
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                },
                description: "An array of 4 possible answers in Arabic."
              },
            },
            required: ["question", "options"],
          },
        },
      },
    });
    
    const jsonString = response.text.trim();
    const questions = JSON.parse(jsonString);
    return questions as Question[];
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions from Gemini API.");
  }
}

export async function analyzeAnswers(answers: Answer[]): Promise<CareerResult> {
  const careerPathList = Object.keys(CAREER_PATHS).join(', ');
  const prompt = `As an expert career counselor, analyze the following questions and answers from a user's career quiz. Based on their responses, determine the single most suitable career path for them from the following list: [${careerPathList}]. Provide a brief, encouraging, one-paragraph description explaining why this path is a good fit. The analysis and result must be in Arabic. Return the response as a JSON object that strictly follows the provided schema. Do not include any markdown formatting. The answers are: ${JSON.stringify(answers)}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerPath: {
              type: Type.STRING,
              description: `The suggested career path in Arabic, chosen from the predefined list.`
            },
            description: {
              type: Type.STRING,
              description: "A brief, encouraging description in Arabic."
            },
          },
          required: ["careerPath", "description"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as CareerResult;
  } catch (error) {
    console.error("Error analyzing answers:", error);
    throw new Error("Failed to analyze answers with Gemini API.");
  }
}
