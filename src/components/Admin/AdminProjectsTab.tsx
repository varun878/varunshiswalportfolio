import React, { useState } from 'react';
import { Project, ProjectCategory } from '../../types';
import { ImageCropperModal } from '../ImageCropperModal';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Save, 
  X, 
  FolderPlus, 
  Upload, 
  Crop, 
  Image as ImageIcon 
} from 'lucide-react';

interface AdminProjectsTabProps {
  projects: Project[];
  onSave: (updated: Project[]) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({ projects, onSave }) => {
  const [projectList, setProjectList] = useState<Project[]>([...projects]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [notification, setNotification] = useState('');

  // Image Cropping state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropSourceImg, setCropSourceImg] = useState<string | null>(null);

  const emptyProject: Project = {
    id: '',
    title: '',
    category: 'completed',
    description: '',
    longDescription: '',
    techStack: [],
    projectUrl: '',
    githubUrl: '',
    imageUrl: '',
    date: new Date().getFullYear().toString(),
    metrics: ''
  };

  const [formData, setFormData] = useState<Project>(emptyProject);

  const startCreate = () => {
    setFormData({
      ...emptyProject,
      id: `proj_${Date.now()}`
    });
    setTechInput('');
    setIsCreating(true);
    setEditingProject(null);
  };

  const startEdit = (proj: Project) => {
    setFormData({ ...proj });
    setTechInput('');
    setEditingProject(proj);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setIsCreating(false);
    setFormData(emptyProject);
  };

  const handleImageFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropSourceImg(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: croppedDataUrl
    }));
    setCropModalOpen(false);
    setCropSourceImg(null);
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tag: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tag)
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Project[];

    if (isCreating) {
      updated = [formData, ...projectList];
    } else {
      updated = projectList.map(p => p.id === formData.id ? formData : p);
    }

    setProjectList(updated);
    onSave(updated);
    cancelEdit();
    setNotification(isCreating ? 'Project created successfully!' : 'Project updated successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projectList.filter(p => p.id !== id);
      setProjectList(updated);
      onSave(updated);
      if (editingProject?.id === id) {
        cancelEdit();
      }
      setNotification('Project deleted');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Projects Management</h3>
          <p className="text-xs text-gray-400">Add, edit, and organize completed, ongoing, and open-source contribution projects with cover image cropping.</p>
        </div>

        <div className="flex items-center gap-3">
          {notification && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{notification}</span>
            </div>
          )}

          {!isCreating && !editingProject && (
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Modal/Form */}
      {(isCreating || editingProject) && (
        <div className="p-6 rounded-2xl bg-[#0a0e14] border border-blue-500/40 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-blue-400" />
              <span>{isCreating ? 'Create New Project' : `Editing: ${editingProject?.title}`}</span>
            </h4>
            <button
              onClick={cancelEdit}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Enterprise Vulnerability Scanner"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category / Status</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="completed">Completed Project</option>
                  <option value="ongoing">Ongoing Project</option>
                  <option value="contribution">Open-Source Contribution</option>
                </select>
              </div>
            </div>

            {/* Cover Image Upload with Cropper */}
            <div className="p-3.5 rounded-xl bg-[#111827] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded bg-[#0a0e14] border border-white/10 overflow-hidden flex items-center justify-center relative shrink-0">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Project Cover" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Project Cover Image / Diagram</div>
                  <div className="text-[11px] text-gray-400">Optional thumbnail for project card with interactive 16:9 crop</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Crop Cover</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelected}
                    className="hidden"
                  />
                </label>
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setCropSourceImg(formData.imageUrl!);
                      setCropModalOpen(true);
                    }}
                    className="p-1.5 rounded bg-gray-800 text-gray-300 hover:text-white text-xs border border-white/10"
                    title="Adjust Crop"
                  >
                    <Crop className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Date / Year</label>
                <input
                  type="text"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="2026 / In Progress"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Key Outcome / Metric (Optional)</label>
                <input
                  type="text"
                  value={formData.metrics || ''}
                  onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                  placeholder="e.g. Reduced audit triage time by 65%"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Short Description (2-3 lines for card)</label>
              <textarea
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary for project card..."
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Case Study Details (Shown in modal)</label>
              <textarea
                rows={4}
                value={formData.longDescription || ''}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                placeholder="In-depth breakdown of architecture, challenge, methodology, and outcome..."
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Tech Stack Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Tech & Tools Used</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 text-blue-300 text-xs border border-gray-700"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
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
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add tool tag (e.g. Wireshark, Python, Nmap)..."
                  className="flex-1 bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-gray-200 hover:bg-gray-700 cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Live Demo / Docs URL</label>
                <input
                  type="url"
                  value={formData.projectUrl || ''}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  placeholder="https://github.com/varun878"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/varun878"
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isCreating ? 'Create Project' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List Table */}
      <div className="rounded-2xl bg-[#0a0e14] border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#111827] text-gray-400 uppercase font-semibold border-b border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Tools</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projectList.map((p) => (
                <tr key={p.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt={p.title} className="w-10 h-8 rounded object-cover border border-white/10" />
                      )}
                      <div>
                        <div className="font-bold text-white text-sm mb-0.5">{p.title}</div>
                        <div className="text-gray-400 line-clamp-1 max-w-sm">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      p.category === 'completed' 
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                        : p.category === 'ongoing'
                        ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                        : 'bg-blue-950/50 text-blue-300 border-blue-500/30'
                    }`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.techStack.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                          {t}
                        </span>
                      ))}
                      {p.techStack.length > 3 && (
                        <span className="text-[10px] text-gray-500">+{p.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-blue-600/20 text-gray-300 hover:text-blue-300 border border-gray-700 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-700 cursor-pointer"
                        title="Delete Project"
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

      {/* Image Cropper Modal */}
      {cropModalOpen && cropSourceImg && (
        <ImageCropperModal
          imageSrc={cropSourceImg}
          initialRatio="16:9"
          title="Crop Project Cover Image"
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
