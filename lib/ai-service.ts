import OpenAI from 'openai';
import { AIAnalysis } from '@/types';

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async analyzeArticle(title: string, content: string): Promise<AIAnalysis> {
    if (!this.openai) {
      // 如果没有配置OpenAI，返回基础分析
      return {
        summary: title,
        tags: this.extractBasicTags(title + ' ' + content),
      };
    }

    try {
      const prompt = `请分析以下AI相关文章，提供：
1. 简短摘要（2-3句话）
2. 关键标签（3-5个）
3. 关键要点（3-5个）

标题: ${title}
内容: ${content.slice(0, 1000)}

请以JSON格式返回，格式如下：
{
  "summary": "文章摘要",
  "tags": ["标签1", "标签2"],
  "keyPoints": ["要点1", "要点2"]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '你是一个AI新闻分析助手，擅长总结和分析AI相关的技术文章。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content_response = response.choices[0]?.message?.content;
      if (!content_response) {
        throw new Error('No response from AI');
      }

      // 解析JSON响应
      const jsonMatch = content_response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          summary: analysis.summary || title,
          tags: analysis.tags || [],
          keyPoints: analysis.keyPoints,
        };
      }

      return {
        summary: title,
        tags: this.extractBasicTags(title),
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        summary: title,
        tags: this.extractBasicTags(title),
      };
    }
  }

  private extractBasicTags(text: string): string[] {
    const keywords = [
      'LLM',
      'GPT',
      'AI',
      'Machine Learning',
      'Deep Learning',
      'Neural Network',
      'Transformer',
      'ChatGPT',
      'Claude',
      'Gemini',
      'OpenAI',
      'Anthropic',
      'Google',
      'Microsoft',
      'AGI',
      'NLP',
      'Computer Vision',
      'Robotics',
      'Reinforcement Learning',
    ];

    const foundTags: string[] = [];
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundTags.push(keyword);
      }
    }

    return foundTags.slice(0, 5);
  }
}

export const aiService = new AIService();
