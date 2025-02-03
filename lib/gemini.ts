import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export type AssistantContext = {
  type: 'strategy' | 'calendar' | 'call' | 'general';
  data?: any;
};

export async function getGeminiResponse(
  message: string,
  context: AssistantContext
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build context-aware prompt
    let contextPrompt = '';
    switch (context.type) {
      case 'strategy':
        contextPrompt = `As a real estate AI assistant, help with strategy. Current context: ${JSON.stringify(context.data)}. `;
        break;
      case 'calendar':
        contextPrompt = `As a real estate AI assistant, help with calendar and scheduling. Current context: ${JSON.stringify(context.data)}. `;
        break;
      case 'call':
        contextPrompt = `As a real estate AI assistant, help with call management. Current context: ${JSON.stringify(context.data)}. `;
        break;
      default:
        contextPrompt = 'As a real estate AI assistant, ';
    }

    const prompt = `${contextPrompt}User query: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again.";
  }
} 