import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { storageService } from '../../services/storage';
import { ImageCropperModal, AspectRatioType } from '../ImageCropperModal';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  CheckCircle2, 
  Save, 
  X, 
  Film, 
  Crop,
  Ratio
} from 'lucide-react';

interface AdminGalleryTabProps {
  gallery: GalleryItem[];
  onSave: (updated: GalleryItem[]) => void;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({ gallery, onSave }) => {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([...gallery]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [notification, setNotification] = useState('');

  // Cropper Modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropSourceImg, setCropSourceImg] = useState<string | null>(null);
  const [cropRatio, setCropRatio] = useState<AspectRatioType>('16:9');

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    type: 'image',
    title: '',
    caption: '',
    url: '',
    date: new Date().getFullYear().toString()
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      // Video upload straight to storage
      setUploadProgress(true);
      const result = await storageService.uploadMedia(file);
      if (result.url) {
        setFormData({
          ...formData,
          url: result.url,
          type: 'video',
          title: formData.title || file.name.replace(/\.[^/.]+$/, '')
        });
        setNotification('Video uploaded!');
      } else {
        alert(result.error || 'Failed to upload video');
      }
      setUploadProgress(false);
    } else {
      // Image: Load into Image Cropper Modal so user can adjust frame ratio and crop!
      const reader = new FileReader();
      reader.onload = () => {
        setCropSourceImg(reader.result as string);
        setFormData(prev => ({
          ...prev,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
          type: 'image'
        }));
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      url: croppedDataUrl,
      type: 'image'
    }));
    setCropModalOpen(false);
    setCropSourceImg(null);
    setNotification('Image cropped & frame ratio adjusted!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.title) {
      alert('Please provide a title and media file/URL');
      return;
    }

    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      type: formData.type || 'image',
      title: formData.title,
      caption: formData.caption || '',
      url: formData.url,
      date: formData.date || new Date().getFullYear().toString()
    };

    const updated = [newItem, ...galleryList];
    setGalleryList(updated);
    onSave(updated);
    setIsUploading(false);
    setFormData({
      type: 'image',
      title: '',
      caption: '',
      url: '',
      date: new Date().getFullYear().toString()
    });
    setNotification('Gallery item added!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this media item from gallery?')) {
      const updated = galleryList.filter(g => g.id !== id);
      setGalleryList(updated);
      onSave(updated);
      setNotification('Media item removed');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Gallery Media Management</h3>
          <p className="text-xs text-gray-400">Upload photos, datacenter captures, lab diagrams, and demonstration videos with frame ratio cropping.</p>
        </div>

        <div className="flex items-center gap-3">
          {notification && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{notification}</span>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={() => setIsUploading(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload / Add Media</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload & Add Form */}
      {isUploading && (
        <div className="p-6 rounded-2xl bg-[#0a0e14] border border-blue-500/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Add Media Item</span>
            </h4>
            <button
              onClick={() => setIsUploading(false)}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* File Upload or URL input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option A: Direct File Upload with Cropper */}
              <div className="p-4 rounded-xl border border-dashed border-gray-700 hover:border-blue-500/60 transition-colors bg-[#111827] text-center flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-[#3b82f6] mb-2 opacity-80" />
                <label className="cursor-pointer">
                  <span className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all inline-flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5" />
                    <span>{uploadProgress ? 'Processing...' : 'Browse & Crop Photo / Video'}</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadProgress}
                  />
                </label>
                <p className="text-[11px] text-gray-400 mt-2">
                  Images open instantly in the interactive frame-ratio crop tool (16:9, 4:3, 1:1, etc.)
                </p>

                {/* If image already selected */}
                {formData.url && formData.type === 'image' && (
                  <div className="mt-3 flex items-center gap-2">
                    <img src={formData.url} alt="Preview" className="w-14 h-10 object-cover rounded border border-white/10" />
                    <button
                      type="button"
                      onClick={() => {
                        setCropSourceImg(formData.url!);
                        setCropModalOpen(true);
                      }}
                      className="px-2 py-1 rounded bg-[#0a0e14] border border-blue-500/30 text-blue-400 text-[11px] hover:bg-blue-900/30 flex items-center gap-1"
                    >
                      <Crop className="w-3 h-3" />
                      <span>Adjust Crop</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Option B: Direct URL */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Or Enter Direct Image/Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or https://.../video.mp4"
                    className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={formData.type === 'image'}
                      onChange={() => setFormData({ ...formData, type: 'image' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Photo / Image</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={formData.type === 'video'}
                      onChange={() => setFormData({ ...formData, type: 'video' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Video Clip</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Title & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Active Directory GPO Lab Demonstration"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Year / Date</label>
                <input
                  type="text"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="2026"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Caption / Description (Optional)</label>
              <textarea
                rows={2}
                value={formData.caption || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Briefly describe the lab setup or work context..."
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Gallery</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {galleryList.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#0a0e14] border border-gray-800 flex flex-col justify-between group relative"
          >
            {/* Preview Box */}
            <div className="aspect-video rounded-xl bg-black overflow-hidden mb-3 relative">
              {item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <Film className="w-8 h-8 text-blue-400" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/80 px-2 py-0.5 rounded text-white font-medium">Video</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                {item.type === 'image' && (
                  <button
                    onClick={() => {
                      setCropSourceImg(item.url);
                      setFormData(item);
                      setIsUploading(true);
                      setCropModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-blue-900 text-white transition-colors"
                    title="Crop this image"
                  >
                    <Crop className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-black/70 hover:bg-red-900 text-white transition-colors"
                  title="Delete media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-1">
                {item.title}
              </div>
              {item.caption && (
                <div className="text-gray-400 text-xs line-clamp-2 mb-2">
                  {item.caption}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-800/80 text-[11px] text-gray-500 flex items-center justify-between">
              <span>{item.type.toUpperCase()}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cropper Modal */}
      {cropModalOpen && cropSourceImg && (
        <ImageCropperModal
          imageSrc={cropSourceImg}
          initialRatio={cropRatio}
          title="Crop Gallery Image"
          onCropComplete={handleCropComplete}
          onClose={() => {
            setCropModalOpen(false);
            setCropSourceImg(null);
          }}
        />
      )}

    </div>
  );
};
