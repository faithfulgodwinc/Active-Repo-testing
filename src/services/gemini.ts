import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { config } from '../config/env';
import { AiOutput } from '../types';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        this.genAI = new GoogleGenerativeAI(config.google.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    }

    async generateContent(diff: string): Promise<AiOutput | null> {
        const prompt = `
      You are a senior developer and technical content creator.
      Analyze the following code diff and generate documentation, a social media post, and a video script.
      
      Input Diff:
      ${diff}

      Requirements:
      1. Documentation: A markdown snippet explaining the changes.
      2. Social Post: A professional LinkedIn post announcing the update.
      3. Video Script: A visual description for an AI video generator (like Veo) to demonstrate the change.

      Return ONLY a raw JSON object with the following structure:
      {
        "documentation": "string",
        "social_post": "string",
        "video_script": "string",
        "is_significant": boolean
      }
      
      If the change is trivial (typos, formatting, minor version bumps), set "is_significant" to false and leave other fields empty.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json\n?|\n?```/g, '');
            const data = JSON.parse(jsonStr);

            if (!data.is_significant) {
                return null;
            }

            return {
                documentation: data.documentation,
                social_post: data.social_post,
                video_script: data.video_script
            };
        } catch (error) {
            console.error('Error generating content:', error);
            return null;
        }
    }
}
