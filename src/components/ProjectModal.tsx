import React from 'react';
import { Project } from '../types';
import { X, ExternalLink, Github, CheckCircle, Calendar, Layers, Shield } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const getStatusBadge = (category: Project['category']) => {
    switch (category) {
      case 'completed':
        return {
          label: 'Completed Project',
          classes: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
        };
      case 'ongoing':
        return {
          label: 'Ongoing / Active Development',
          classes: 'bg-amber-950/60 text-amber-400 border-amber-500/40'
        };
      case 'contribution':
        return {
          label: 'Open-Source Contribution',
          classes: 'bg-blue-950/60 text-blue-400 border-blue-500/40'
        };
    }
  };

  const status = getStatusBadge(project.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#111827] border border-gray-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge & Date */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.classes}`}>
            {status.label}
          </span>
          {project.date && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {project.date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
          {project.title}
        </h3>

        {/* Metric / Highlight Banner */}
        {project.metrics && (
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Key Outcome: <strong>{project.metrics}</strong></span>
          </div>
        )}

        {/* Description / Case Study Body */}
        <div className="space-y-4 mb-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          <p>{project.longDescription || project.description}</p>
        </div>

        {/* Tech Stack List */}
        <div className="mb-8">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Technologies & Security Tools Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700 text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-800">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all"
            >
              <span>View Repository / Live Docs</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && project.githubUrl !== project.projectUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-medium text-sm border border-gray-700 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Source</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
