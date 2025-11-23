'use client';

import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 flex-1">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2"
            >
              {article.title}
            </a>
          </h3>
        </div>

        {article.aiSummary && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {article.aiSummary}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
          <span className="font-medium">{article.source}</span>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 text-xs bg-gray-100 rounded">
              {article.category}
            </span>
            <time>
              {formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}
