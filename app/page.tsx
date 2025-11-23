'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/article-card';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', tag: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArticles = async (refresh = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.tag) params.append('tag', filter.tag);
      if (refresh) params.append('refresh', 'true');

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const filteredArticles = articles.filter((article) =>
    searchTerm
      ? article.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const categories = Array.from(
    new Set(articles.map((a) => a.category))
  ).filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI 资讯聚合器
          </h1>
          <p className="text-gray-600">
            实时获取主流网站的AI相关资讯，由AI智能分析总结
          </p>
        </header>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜索
              </label>
              <input
                type="text"
                placeholder="搜索文章标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={filter.category}
                onChange={(e) =>
                  setFilter({ ...filter, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => fetchArticles(true)}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? '加载中...' : '刷新数据'}
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading && articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">正在获取最新资讯...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">暂无文章</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && articles.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            显示 {filteredArticles.length} / {articles.length} 篇文章
          </div>
        )}
      </div>
    </main>
  );
}
