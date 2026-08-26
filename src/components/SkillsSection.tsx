import React, { useState } from 'react';
import { SkillCategory } from '../types';
import { 
  Code2, 
  Wrench, 
  Monitor, 
  ShieldAlert, 
  Search,
  Layers
} from 'lucide-react';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('lang') || lower.includes('code')) {
      return <Code2 className="w-4 h-4 text-[#3b82f6]" />;
    }
    if (lower.includes('tool') || lower.includes('platform')) {
      return <Wrench className="w-4 h-4 text-[#3b82f6]" />;
    }
    if (lower.includes('os') || lower.includes('operat') || lower.includes('system')) {
      return <Monitor className="w-4 h-4 text-[#3b82f6]" />;
    }
    return <ShieldAlert className="w-4 h-4 text-[#3b82f6]" />;
  };

  return (
    <section id="skills" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Container */}
        <div className="bg-[#111827] p-6 sm:p-8 rounded-xl border border-white/5">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/5 gap-4">
            <div>
              <div className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Technical Stack</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Skills & Competencies
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0e14] border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {skills.map((category) => {
              const filteredSkills = searchTerm
                ? category.skills.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                : category.skills;

              return (
                <div
                  key={category.id}
                  className="bg-[#0a0e14] p-5 rounded-lg border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    {/* Category Title */}
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(category.title)}
                      <p className="text-[11px] uppercase font-bold text-[#3b82f6] tracking-wider">
                        {category.title}
                      </p>
                    </div>

                    {category.description && (
                      <p className="text-[11px] text-[#9ca3af] mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Skills Tags List */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {filteredSkills.length === 0 ? (
                        <span className="text-[11px] text-gray-600 italic">No matching skills</span>
                      ) : (
                        filteredSkills.map((skill, sIdx) => {
                          const isMatch = searchTerm && skill.toLowerCase().includes(searchTerm.toLowerCase());
                          return (
                            <span
                              key={sIdx}
                              className={`px-2 py-1 text-[11px] rounded border transition-all ${
                                isMatch
                                  ? 'bg-blue-600/30 text-blue-300 border-blue-400 font-semibold'
                                  : 'bg-[#111827] text-gray-300 border-white/5 hover:border-white/20'
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#9ca3af]">
                    <span>{category.skills.length} Items</span>
                    <span className="text-[#3b82f6] font-semibold">Verified</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
