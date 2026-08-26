import React from 'react';
import { BlogPost } from '../types';
import { X, Calendar, Clock, Tag, Share2, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';

interface BlogReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({ post, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!post) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown paragraph renderer for headings, codeblocks, lists, and bold text
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="p-4 my-4 rounded-xl bg-[#0a0e14] border border-gray-800 text-blue-300 font-mono text-xs overflow-x-auto">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeBuffer = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-xl font-bold text-white mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-3xl font-extrabold text-white mt-8 mb-4">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={idx} className="ml-5 list-disc text-gray-300 text-sm sm:text-base mb-1.5 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      } else if (line.startsWith('---')) {
        elements.push(<hr key={idx} className="my-6 border-gray-800" />);
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-3" />);
      } else {
        elements.push(
          <p key={idx} className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
            {line}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <pre key="code-end" className="p-4 my-4 rounded-xl bg-[#0a0e14] border border-gray-800 text-blue-300 font-mono text-xs overflow-x-auto">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#111827] border border-gray-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-5 sm:px-8 border-b border-gray-800 flex items-center justify-between bg-[#111827]/90 backdrop-blur-sm z-10 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog List</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              title="Copy share link"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-8 sm:px-10 overflow-y-auto">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {post.readTime}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-blue-400 font-medium">By VarunShiswal_SEC</span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-blue-950/40 text-blue-300 border border-blue-500/20 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Formatted Content */}
          <div className="article-body font-sans">
            {renderFormattedContent(post.content)}
          </div>

          {/* Author Card Footer */}
          <div className="mt-12 pt-6 border-t border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                VS
              </div>
              <div>
                <div className="text-sm font-bold text-white">VarunShiswal_SEC</div>
                <div className="text-xs text-gray-400">IT Professional | Cybersecurity Enthusiast</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
