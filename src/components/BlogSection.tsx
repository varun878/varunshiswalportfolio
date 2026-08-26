import React, { useState } from 'react';
import { BlogPost } from '../types';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogReaderModal } from './BlogReaderModal';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTag, setActiveTag] = useState<string>('all');

  const allTags = ['all', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  const filteredPosts = activeTag === 'all'
    ? posts
    : posts.filter(p => p.tags.includes(activeTag));

  return (
    <section id="blog" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Container */}
        <div className="bg-[#111827] p-6 sm:p-8 rounded-xl border border-white/5">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-white/5 gap-4">
            <div>
              <div className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Engineering Notes</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Security Blog & Field Writeups
              </h2>
            </div>

            {/* Tag Filters */}
            {allTags.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {allTags.map((tag) => {
                  const isActive = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#3b82f6] text-white font-bold'
                          : 'bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5'
                      }`}
                    >
                      {tag === 'all' ? 'All Topics' : `#${tag}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blog Post List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 rounded-lg bg-[#0a0e14] border border-white/5">
              <p className="text-[#9ca3af] text-sm">No blog posts available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-[#0a0e14] p-5 rounded-lg card-glow flex flex-col justify-between cursor-pointer group transition-all"
                >
                  <div>
                    {/* Meta: Date & Read time */}
                    <div className="flex items-center gap-3 text-[11px] text-[#9ca3af] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#3b82f6]" />
                        {post.date}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#3b82f6]" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-[#3b82f6] transition-colors mb-2.5 leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-[#9ca3af] line-clamp-3 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#111827] text-[#3b82f6] border border-blue-500/20 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Read Article Trigger */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider group-hover:text-[#3b82f6] transition-colors">
                      <span className="border-b border-[#3b82f6] pb-0.5">Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <BlogReaderModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </section>
  );
};
