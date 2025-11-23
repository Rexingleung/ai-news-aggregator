import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataSourceConfig, Article } from '@/types';
import { aiService } from './ai-service';

export class Scraper {
  async scrapeSource(source: DataSourceConfig): Promise<Article[]> {
    if (!source.enabled) {
      return [];
    }

    try {
      switch (source.type) {
        case 'html':
          return await this.scrapeHTML(source);
        case 'rss':
          return await this.scrapeRSS(source);
        case 'api':
          return await this.scrapeAPI(source);
        default:
          console.warn(`Unknown source type: ${source.type}`);
          return [];
      }
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  private async scrapeHTML(source: DataSourceConfig): Promise<Article[]> {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const articles: Article[] = [];
    const config = source.scrapeConfig;

    if (!config?.articleSelector) {
      return articles;
    }

    const articleElements = $(config.articleSelector).slice(0, 10); // 限制前10篇

    for (let i = 0; i < articleElements.length; i++) {
      const element = articleElements[i];
      const $article = $(element);

      try {
        let title = '';
        let link = '';
        let publishedAt = new Date().toISOString();

        // 提取标题
        if (config.titleSelector) {
          title = $article.find(config.titleSelector).first().text().trim();
        }

        // 提取链接
        if (config.linkSelector) {
          const linkElement = $article.find(config.linkSelector).first();
          link = linkElement.attr('href') || '';

          // 如果是相对路径，转换为绝对路径
          if (link && !link.startsWith('http')) {
            const baseUrl = new URL(source.url);
            link = new URL(link, baseUrl.origin).href;
          }
        }

        // 提取日期
        if (config.dateSelector) {
          const dateText =
            $article.find(config.dateSelector).first().attr('datetime') ||
            $article.find(config.dateSelector).first().text().trim();
          if (dateText) {
            const parsedDate = new Date(dateText);
            if (!isNaN(parsedDate.getTime())) {
              publishedAt = parsedDate.toISOString();
            }
          }
        }

        if (title && link) {
          // 使用AI分析标题
          const analysis = await aiService.analyzeArticle(title, title);

          articles.push({
            id: `${source.id}-${Date.now()}-${i}`,
            title,
            url: link,
            source: source.name,
            publishedAt,
            aiSummary: analysis.summary,
            category: source.category,
            tags: analysis.tags,
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Error parsing article from ${source.name}:`, error);
      }
    }

    return articles;
  }

  private async scrapeRSS(source: DataSourceConfig): Promise<Article[]> {
    // RSS解析实现（可以使用rss-parser库）
    // 这里提供基础实现框架
    return [];
  }

  private async scrapeAPI(source: DataSourceConfig): Promise<Article[]> {
    // API调用实现
    // 可以根据具体API定制
    return [];
  }

  async scrapeAll(sources: DataSourceConfig[]): Promise<Article[]> {
    const allArticles: Article[] = [];

    for (const source of sources) {
      if (source.enabled) {
        const articles = await this.scrapeSource(source);
        allArticles.push(...articles);
      }
    }

    // 按发布时间排序
    return allArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

export const scraper = new Scraper();
