import Link from 'next/link';
import { getAllTags, getAllCategories } from '@/lib/posts';

export default function Sidebar() {
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <aside className="space-y-6">
      {/* 分类 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          分类
        </h3>
        <div className="space-y-2">
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600 text-sm"
          >
            全部文章
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600 text-sm"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600"
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
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 text-sm transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}