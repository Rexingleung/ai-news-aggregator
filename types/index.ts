import { z } from 'zod';

// 数据源配置Schema
export const DataSourceConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean().default(true),
  url: z.string().url(),
  type: z.enum(['rss', 'html', 'api']),
  scrapeConfig: z.object({
    articleSelector: z.string().optional(),
    titleSelector: z.string().optional(),
    linkSelector: z.string().optional(),
    dateSelector: z.string().optional(),
    contentSelector: z.string().optional(),
    apiEndpoint: z.string().optional(),
    apiKey: z.string().optional(),
  }).optional(),
  updateInterval: z.number().default(3600000), // 默认1小时
  category: z.string().default('AI'),
});

export type DataSourceConfig = z.infer<typeof DataSourceConfigSchema>;

// 文章Schema
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  publishedAt: z.string(),
  summary: z.string().optional(),
  aiSummary: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  scrapedAt: z.string(),
});

export type Article = z.infer<typeof ArticleSchema>;

// AI分析结果
export const AIAnalysisSchema = z.object({
  summary: z.string(),
  tags: z.array(z.string()),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  keyPoints: z.array(z.string()).optional(),
});

export type AIAnalysis = z.infer<typeof AIAnalysisSchema>;
