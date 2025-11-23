import { NextRequest, NextResponse } from 'next/server';
import { scraper } from '@/lib/scraper';
import dataSources from '@/config/data-sources.json';
import { DataSourceConfigSchema } from '@/types';

// 缓存文章数据
let cachedArticles: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const refresh = searchParams.get('refresh') === 'true';

  try {
    // 检查是否需要重新抓取
    const now = Date.now();
    if (refresh || cachedArticles.length === 0 || now - lastFetchTime > CACHE_DURATION) {
      console.log('Fetching fresh articles...');
      
      // 验证配置
      const validatedSources = dataSources
        .map((source) => {
          try {
            return DataSourceConfigSchema.parse(source);
          } catch (error) {
            console.error(`Invalid source config: ${source.name}`, error);
            return null;
          }
        })
        .filter((source) => source !== null);

      // 抓取所有数据源
      cachedArticles = await scraper.scrapeAll(validatedSources);
      lastFetchTime = now;
    }

    // 过滤文章
    let filteredArticles = [...cachedArticles];

    if (category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === category
      );
    }

    if (tag) {
      filteredArticles = filteredArticles.filter((article) =>
        article.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    return NextResponse.json({
      articles: filteredArticles,
      total: filteredArticles.length,
      cachedAt: new Date(lastFetchTime).toISOString(),
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
