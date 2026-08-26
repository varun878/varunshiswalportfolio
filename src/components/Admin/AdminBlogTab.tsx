import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, Save, X, BookOpen, Eye } from 'lucide-react';

interface AdminBlogTabProps {
  posts: BlogPost[];
  onSave: (updated: BlogPost[]) => void;
}

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ posts, onSave }) => {
  const [postList, setPostList] = useState<BlogPost[]>([...posts]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [notification, setNotification] = useState('');

  const emptyPost: BlogPost = {
    id: '',
    title: '',
    slug: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    excerpt: '',
    content: '',
    tags: []
  };

  const [formData, setFormData] = useState<BlogPost>(emptyPost);

  const startCreate = () => {
    setFormData({
      ...emptyPost,
      id: `post_${Date.now()}`
    });
    setTagInput('');
    setIsCreating(true);
    setEditingPost(null);
  };

  const startEdit = (p: BlogPost) => {
    setFormData({ ...p });
    setTagInput('');
    setEditingPost(p);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setIsCreating(false);
    setFormData(emptyPost);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: BlogPost[];

    const finalPost = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (isCreating) {
      updated = [finalPost, ...postList];
    } else {
      updated = postList.map(p => p.id === finalPost.id ? finalPost : p);
    }

    setPostList(updated);
    onSave(updated);
    cancelEdit();
    setNotification(isCreating ? 'Blog article published!' : 'Article updated successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updated = postList.filter(p => p.id !== id);
      setPostList(updated);
      onSave(updated);
      if (editingPost?.id === id) {
        cancelEdit();
      }
      setNotification('Article deleted');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Blog & Technical Notes Management</h3>
          <p className="text-xs text-gray-400">Write, edit, and publish technical guides, audit walkthroughs, and research notes.</p>
        </div>

        <div className="flex items-center gap-3">
          {notification && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{notification}</span>
            </div>
          )}

          {!isCreating && !editingPost && (
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Form */}
      {(isCreating || editingPost) && (
        <div className="p-6 rounded-2xl bg-[#0a0e14] border border-blue-500/40 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>{isCreating ? 'Write New Blog Article' : `Editing: ${editingPost?.title}`}</span>
            </h4>
            <button
              onClick={cancelEdit}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Practical Vulnerability Assessment with Nmap"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5 min read"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Excerpt / Summary (Shown on card)</label>
              <textarea
                rows={2}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A concise summary introducing the key takeaways of the article..."
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Article Content (Supports Markdown headings #, ##, ###, bullet points, and ```code blocks```)
              </label>
              <textarea
                rows={10}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="### Introduction&#10;&#10;Write your in-depth technical analysis here...&#10;&#10;```bash&#10;nmap -sS -p- 192.168.1.1&#10;```"
                className="w-full font-mono bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Tags / Topics</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 text-blue-300 text-xs border border-gray-700"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag (e.g. Wireshark, Active Directory)..."
                  className="flex-1 bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-gray-200 hover:bg-gray-700"
                >
                  Add Tag
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isCreating ? 'Publish Article' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog List Table */}
      <div className="rounded-2xl bg-[#0a0e14] border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#111827] text-gray-400 uppercase font-semibold border-b border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Title & Excerpt</th>
                <th className="px-5 py-3.5">Published Date</th>
                <th className="px-5 py-3.5">Tags</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {postList.map((post) => (
                <tr key={post.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-white text-sm mb-0.5">{post.title}</div>
                    <div className="text-gray-400 line-clamp-1 max-w-md">{post.excerpt}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                    {post.date}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {post.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-800 text-blue-300 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-blue-600/20 text-gray-300 hover:text-blue-300 border border-gray-700"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-700"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
