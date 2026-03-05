import Link from 'next/link';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import Profile from '@/components/Profile';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="min-h-screen pt-16">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            标签：{decodedTag}
          </h1>
          <p className="text-slate-600 mt-2">共找到 {posts.length} 篇文章</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧个人简介 */}
          <div className="lg:col-span-3">
            <Profile />
          </div>

          {/* 中间文章列表 */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100 text-center">
                  <p className="text-slate-500">暂无该标签的文章</p>
                </div>
              ) : (
                posts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/post/${post.slug}`}>
                      <h2 className="text-xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {format(new Date(post.date), 'yyyy年MM月dd日', {
                          locale: zhCN,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                        {post.category}
                      </span>
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tag/${tag}`}
                          className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* 右侧侧边栏 */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
}