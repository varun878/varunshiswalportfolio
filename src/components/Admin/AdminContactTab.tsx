import React, { useState } from 'react';
import { ContactLinks } from '../../types';
import { Save, CheckCircle2, Github, Linkedin, Mail, Instagram, MapPin } from 'lucide-react';

interface AdminContactTabProps {
  contact: ContactLinks;
  onSave: (updated: ContactLinks) => void;
}

export const AdminContactTab: React.FC<AdminContactTabProps> = ({ contact, onSave }) => {
  const [formData, setFormData] = useState<ContactLinks>({ ...contact });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Contact & Social Channels</h3>
          <p className="text-xs text-gray-400">Update your external profile links, email inbox, and location info.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Contact Links Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="varunshiswal@gmail.com"
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-gray-300" />
              <span>GitHub URL</span>
            </label>
            <input
              type="url"
              required
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/varun878"
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span>LinkedIn Profile URL</span>
            </label>
            <input
              type="text"
              required
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://www.linkedin.com/in/varun-kumar-435a77298"
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram Profile URL</span>
            </label>
            <input
              type="url"
              required
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://www.instagram.com/varunkumar.sec/"
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Location / Timezone Note</span>
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="India (Available for Remote / Global Collaborations)"
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact Links</span>
          </button>
        </div>
      </form>
    </div>
  );
};
