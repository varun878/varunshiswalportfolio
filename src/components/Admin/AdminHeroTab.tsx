import React, { useState } from 'react';
import { HeroContent } from '../../types';
import { storageService } from '../../services/storage';
import { ImageCropperModal } from '../ImageCropperModal';
import { 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  User, 
  Upload, 
  FileText, 
  Crop, 
  Image as ImageIcon,
  Download,
  X
} from 'lucide-react';

interface AdminHeroTabProps {
  hero: HeroContent;
  onSave: (updated: HeroContent) => void;
}

export const AdminHeroTab: React.FC<AdminHeroTabProps> = ({ hero, onSave }) => {
  const [formData, setFormData] = useState<HeroContent>({ ...hero });
  const [newHighlight, setNewHighlight] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  // Image crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropSourceImg, setCropSourceImg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData({
      ...formData,
      highlights: [...formData.highlights, newHighlight.trim()]
    });
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, idx) => idx !== index)
    });
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...formData.highlights];
    updated[index] = val;
    setFormData({ ...formData, highlights: updated });
  };

  // Avatar file chosen -> Open cropper modal
  const handleAvatarFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropSourceImg(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input so same file can be re-selected if needed
  };

  // When crop is finished in modal
  const handleCropComplete = async (croppedDataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: croppedDataUrl
    }));
    setCropModalOpen(false);
    setCropSourceImg(null);
  };

  // Resume PDF upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    const result = await storageService.uploadMedia(file);
    if (result.url) {
      setFormData(prev => ({
        ...prev,
        resumeUrl: result.url,
        resumeFilename: file.name
      }));
    } else {
      alert('Failed to upload resume file.');
    }
    setResumeUploading(false);
  };

  const handleRemoveResume = () => {
    setFormData(prev => ({
      ...prev,
      resumeUrl: undefined,
      resumeFilename: undefined
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Hero / Introduction Settings</h3>
          <p className="text-xs text-gray-400">Configure your profile picture with live frame cropping, resume PDF, bio, and key highlights.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Picture (Avatar) with Cropper & Resume Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-[#0a0e14] border border-white/5">
          
          {/* Profile Picture with Cropper */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Profile Avatar / Photo (with Interactive Ratio Cropper)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#111827] border border-blue-500/30 overflow-hidden flex items-center justify-center relative shrink-0">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#3b82f6] hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Crop Photo</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileSelected}
                    className="hidden"
                  />
                </label>

                {formData.avatarUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCropSourceImg(formData.avatarUrl!);
                        setCropModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#111827] text-gray-300 hover:text-white border border-white/10 text-[11px]"
                    >
                      <Crop className="w-3 h-3 text-[#3b82f6]" />
                      <span>Re-Crop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: undefined })}
                      className="text-[11px] text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-[#9ca3af] mt-2">
              Supports interactive 1:1 square, 4:3, 16:9, and free ratio cropping with zoom & rotation.
            </p>
          </div>

          {/* Resume PDF Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Resume Document (PDF / DOC)
            </label>

            {formData.resumeUrl ? (
              <div className="p-3 rounded-lg bg-[#111827] border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-white truncate">
                      {formData.resumeFilename || 'Varun_Shiswal_Resume.pdf'}
                    </div>
                    <span className="text-[10px] text-green-400">Ready for visitor download</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={formData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={formData.resumeFilename || 'resume.pdf'}
                    className="p-1.5 rounded bg-gray-800 text-gray-300 hover:text-white"
                    title="Download/View Resume"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="p-1.5 rounded bg-gray-800 text-red-400 hover:text-red-300"
                    title="Remove Resume"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="p-4 rounded-lg border border-dashed border-gray-700 hover:border-blue-500/50 bg-[#111827] text-center flex flex-col items-center justify-center cursor-pointer transition-colors">
                <FileText className="w-6 h-6 text-[#3b82f6] mb-1.5 opacity-80" />
                <span className="text-xs text-blue-400 font-semibold">
                  {resumeUploading ? 'Uploading...' : 'Browse Resume PDF File'}
                </span>
                <span className="text-[10px] text-gray-500 mt-1">Uploads PDF for the "Download Resume" public button</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={resumeUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="VarunShiswal_SEC"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Professional Subtitle / Tagline (e.g. it-guy)
            </label>
            <input
              type="text"
              required
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="IT Professional | it-guy | Cybersecurity Enthusiast"
            />
          </div>

          {/* Status Badge Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Header Badge Text
            </label>
            <input
              type="text"
              value={formData.badgeText}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="Enterprise IT & Security • it-guy"
            />
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Availability Status
            </label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="Available for Projects & Full-time Roles"
            />
          </div>
        </div>

        {/* Bio Paragraph */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Introductory Bio Paragraph (2-3 sentences)
          </label>
          <textarea
            rows={3}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Introduce your practical IT & Cybersecurity background..."
          />
        </div>

        {/* Highlight Bullets */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Highlight Bullet Points (3-4 concise points)
          </label>

          <div className="space-y-2.5 mb-3">
            {formData.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  className="flex-1 bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(idx)}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-700 transition-colors"
                  title="Remove highlight"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new highlight */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Add another highlight point..."
              className="flex-1 bg-[#0a0e14] border border-gray-700/60 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddHighlight();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Hero Changes</span>
          </button>
        </div>
      </form>

      {/* Image Cropper Modal */}
      {cropModalOpen && cropSourceImg && (
        <ImageCropperModal
          imageSrc={cropSourceImg}
          initialRatio="1:1"
          title="Crop Profile Avatar"
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
