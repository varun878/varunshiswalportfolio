import React from 'react';
import { GalleryItem } from '../types';
import { X, Play, Calendar, Eye } from 'lucide-react';

interface GalleryModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#111827] border border-gray-700/80 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Container */}
        <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-hidden">
          {item.type === 'video' ? (
            <video
              src={item.url}
              controls
              autoPlay
              className="max-h-[60vh] w-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={item.url}
              alt={item.title}
              className="max-h-[60vh] w-full object-contain"
            />
          )}
        </div>

        {/* Info & Caption Area */}
        <div className="p-6 sm:p-8 bg-[#111827]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">
              {item.title}
            </h3>
            {item.date && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {item.date}
              </span>
            )}
          </div>

          {item.caption && (
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
