import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface AIRecommendation {
  packId: number;
  title: string;
  reason: string;
  confidence: number;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: Array<{
    type: 'upload' | 'save' | 'export' | 'navigate';
    label: string;
    data?: any;
  }>;
}

export async function generateChatResponse(
  userMessage: string,
  context?: {
    userId: string;
    currentPack?: any;
    recentActivities?: any[];
    userProgress?: any[];
  }
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are an AI learning assistant for a mobile learning app. You help users with their learning journey, provide explanations, and suggest actions.

Context about the user:
- Current learning pack: ${context?.currentPack ? context.currentPack.title : 'None'}
- Recent activities: ${context?.recentActivities?.length || 0} activities
- Available actions: upload files, save progress, export results, navigate to different sections

Respond in a helpful, encouraging tone. Keep responses concise for mobile viewing. Always end with helpful suggestions or actions when appropriate.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      message: result.message || "죄송합니다. 응답을 생성하는데 문제가 발생했습니다.",
      suggestions: result.suggestions || [],
      actions: result.actions || [],
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "죄송합니다. 현재 AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      suggestions: ["다시 시도하기", "도움말 보기"],
    };
  }
}

export async function generateLearningRecommendations(
  userId: string,
  userActivities: any[],
  completedPacks: any[]
): Promise<AIRecommendation[]> {
  try {
    const prompt = `Based on the user's learning history, generate 3-5 personalized learning pack recommendations.

User Activities: ${JSON.stringify(userActivities.slice(0, 10))}
Completed Packs: ${JSON.stringify(completedPacks.slice(0, 5))}

Return a JSON object with "recommendations" array containing:
- packId (number): The recommended pack ID
- title (string): The pack title
- reason (string): Brief explanation why this is recommended
- confidence (number): Confidence score 0-1`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.recommendations || [];
  } catch (error) {
    console.error("Recommendation generation error:", error);
    return [];
  }
}

export async function processUploadedFile(
  fileContent: string,
  fileType: string,
  userId: string
): Promise<{
  summary: string;
  suggestedActions: string[];
  extractedContent?: any;
}> {
  try {
    const prompt = `Process this uploaded learning material and provide insights.

File Type: ${fileType}
Content Preview: ${fileContent.slice(0, 2000)}...

Return a JSON object with:
- summary (string): Brief summary of the content
- suggestedActions (array): Suggested actions the user can take
- extractedContent (object): Any structured data extracted from the file`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      summary: result.summary || "파일이 성공적으로 업로드되었습니다.",
      suggestedActions: result.suggestedActions || ["학습팩 생성", "내용 요약", "퀴즈 생성"],
      extractedContent: result.extractedContent,
    };
  } catch (error) {
    console.error("File processing error:", error);
    return {
      summary: "파일 처리 중 오류가 발생했습니다.",
      suggestedActions: ["다시 업로드", "지원팀 문의"],
    };
  }
}

export async function generateQuizFromContent(content: string): Promise<{
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}> {
  try {
    const prompt = `Generate 3-5 multiple choice questions from this learning content:

${content}

Return a JSON object with "questions" array containing:
- question (string): The question text
- options (array): 4 multiple choice options
- correctAnswer (number): Index of correct answer (0-3)
- explanation (string): Brief explanation of the correct answer`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error("Quiz generation error:", error);
    return { questions: [] };
  }
}
