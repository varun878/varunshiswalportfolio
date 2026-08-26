import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Image as ImageIcon, Video, Play, Maximize2, Camera } from 'lucide-react';
import { GalleryModal } from './GalleryModal';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

  const filteredItems = filterType === 'all'
    ? gallery
    : gallery.filter(item => item.type === filterType);

  return (
    <section id="gallery" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Container */}
        <div className="bg-[#111827] p-6 sm:p-8 rounded-xl border border-white/5">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-white/5 gap-4">
            <div>
              <div className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Lab Visuals</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Gallery
              </h2>
            </div>
            
            {/* Media Type Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5'
                }`}
              >
                All ({gallery.length})
              </button>
              <button
                onClick={() => setFilterType('image')}
                className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                  filterType === 'image'
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Photos</span>
              </button>
              <button
                onClick={() => setFilterType('video')}
                className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                  filterType === 'video'
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Videos</span>
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 rounded-lg bg-[#0a0e14] border border-white/5">
              <p className="text-[#9ca3af] text-sm">No gallery media uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-[#0a0e14] p-3 rounded-lg card-glow cursor-pointer group flex flex-col justify-between transition-all"
                >
                  {/* Media Preview Box */}
                  <div className="relative aspect-video w-full bg-slate-900 rounded overflow-hidden mb-3 border border-white/5">
                    {item.type === 'video' ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-gray-950">
                        {item.thumbnailUrl ? (
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-950/40">
                            <Video className="w-10 h-10 text-[#3b82f6] opacity-60" />
                          </div>
                        )}
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                          <div className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-white translate-x-0.5" />
                          </div>
                        </div>

                        {/* Video Tag */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider">
                          Video
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2.5">
                          <div className="p-1.5 rounded bg-black/70 text-white">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Caption / Title */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#3b82f6] transition-colors mb-1 truncate">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-[#9ca3af] line-clamp-2 mb-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                    {item.date && (
                      <div className="pt-2 border-t border-white/5 text-[10px] text-gray-500 font-medium">
                        {item.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <GalleryModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};
