import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { Github, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories: { key: 'all' | ProjectCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Projects', count: projects.length },
    { 
      key: 'completed', 
      label: 'Completed', 
      count: projects.filter(p => p.category === 'completed').length 
    },
    { 
      key: 'ongoing', 
      label: 'Ongoing', 
      count: projects.filter(p => p.category === 'ongoing').length 
    },
    { 
      key: 'contribution', 
      label: 'Contributions', 
      count: projects.filter(p => p.category === 'contribution').length 
    },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const getStatusBadge = (category: ProjectCategory) => {
    switch (category) {
      case 'completed':
        return {
          label: 'Completed',
          classes: 'bg-green-500/10 text-green-400 border border-green-500/20'
        };
      case 'ongoing':
        return {
          label: 'Ongoing',
          classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        };
      case 'contribution':
        return {
          label: 'Contribution',
          classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        };
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Container Card */}
        <div className="bg-[#111827] p-6 sm:p-8 rounded-xl border border-white/5">
          
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-white/5 gap-4">
            <div>
              <div className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Technical Portfolio</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Projects
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-6 text-sm overflow-x-auto no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`pb-1 font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'tab-active font-bold text-[#3b82f6]'
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="ml-1.5 text-xs text-gray-500 font-normal">({cat.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 rounded-lg bg-[#0a0e14] border border-white/5">
              <p className="text-[#9ca3af] text-sm">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const status = getStatusBadge(project.category);
                return (
                  <div
                    key={project.id}
                    className="bg-[#0a0e14] rounded-lg card-glow flex flex-col justify-between group transition-all overflow-hidden border border-white/5"
                  >
                    {/* Cover image if provided */}
                    {project.imageUrl && (
                      <div className="w-full aspect-video bg-[#111827] overflow-hidden border-b border-white/5 relative">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Status Badge & Date */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-[#3b82f6] text-base group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h4>
                          <span className={`status-badge ${status.classes}`}>
                            {status.label}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#9ca3af] mb-4 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div>
                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#111827] text-[10px] text-[#3b82f6] border border-blue-500/20 rounded font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <button
                            onClick={() => setActiveModalProject(project)}
                            className="text-xs font-bold text-white uppercase tracking-widest border-b border-[#3b82f6] pb-0.5 hover:text-[#3b82f6] transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Project</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`GitHub repository for ${project.title}`}
                              className="p-1.5 rounded bg-[#111827] hover:bg-gray-800 text-gray-400 hover:text-white border border-white/5 transition-colors"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
};
