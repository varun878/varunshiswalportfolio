import React, { useState } from 'react';
import { SkillCategory } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Layers, CheckCircle2 } from 'lucide-react';

interface AdminSkillsTabProps {
  skills: SkillCategory[];
  onSave: (updated: SkillCategory[]) => void;
}

export const AdminSkillsTab: React.FC<AdminSkillsTabProps> = ({ skills, onSave }) => {
  const [categories, setCategories] = useState<SkillCategory[]>([...skills]);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [activeSkillInputs, setActiveSkillInputs] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState('');

  const handleAddCategory = () => {
    if (!newCatTitle.trim()) return;
    const newCat: SkillCategory = {
      id: `cat_${Date.now()}`,
      title: newCatTitle.trim(),
      description: newCatDesc.trim() || 'Technical competencies & tools',
      skills: []
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    onSave(updated);
    setNewCatTitle('');
    setNewCatDesc('');
    setNotification('New category added!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Delete this skill category?')) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      onSave(updated);
      setNotification('Category removed');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleAddSkillToCat = (catId: string) => {
    const skillName = (activeSkillInputs[catId] || '').trim();
    if (!skillName) return;

    const updated = categories.map(c => {
      if (c.id === catId && !c.skills.includes(skillName)) {
        return { ...c, skills: [...c.skills, skillName] };
      }
      return c;
    });

    setCategories(updated);
    onSave(updated);
    setActiveSkillInputs({ ...activeSkillInputs, [catId]: '' });
  };

  const handleRemoveSkillFromCat = (catId: string, skill: string) => {
    const updated = categories.map(c => {
      if (c.id === catId) {
        return { ...c, skills: c.skills.filter(s => s !== skill) };
      }
      return c;
    });
    setCategories(updated);
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Skills & Competencies Management</h3>
          <p className="text-xs text-gray-400">Manage technical categories and skill tags displayed across your portfolio.</p>
        </div>

        {notification && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Add New Category Card */}
      <div className="p-5 rounded-2xl bg-[#0a0e14] border border-gray-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Add New Category</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Category Name (e.g. Cloud & DevOps)"
            value={newCatTitle}
            onChange={(e) => setNewCatTitle(e.target.value)}
            className="sm:col-span-1 bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Short description (optional)"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            className="sm:col-span-1 bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-[#0a0e14] border border-gray-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>{cat.title}</span>
                </h4>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-700"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {cat.description && (
                <p className="text-xs text-gray-400 mb-4">{cat.description}</p>
              )}

              {/* Skills in Category */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111827] text-gray-200 text-xs border border-gray-700/80"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkillFromCat(cat.id, skill)}
                      className="hover:text-red-400"
                      title="Remove skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add skill input */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-800/80">
              <input
                type="text"
                placeholder="Add skill (e.g. Wireshark, Bash)..."
                value={activeSkillInputs[cat.id] || ''}
                onChange={(e) => setActiveSkillInputs({ ...activeSkillInputs, [cat.id]: e.target.value })}
                className="flex-1 bg-[#111827] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkillToCat(cat.id);
                  }
                }}
              />
              <button
                onClick={() => handleAddSkillToCat(cat.id)}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
