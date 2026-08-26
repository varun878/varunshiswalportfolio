import React, { useState } from 'react';
import { PortfolioData } from '../../types';
import { storageService } from '../../services/storage';
import { 
  Shield, 
  LayoutDashboard, 
  FolderGit2, 
  Layers, 
  BookOpen, 
  Camera, 
  Mail, 
  Database, 
  LogOut, 
  ExternalLink, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { AdminHeroTab } from './AdminHeroTab';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminSkillsTab } from './AdminSkillsTab';
import { AdminBlogTab } from './AdminBlogTab';
import { AdminGalleryTab } from './AdminGalleryTab';
import { AdminContactTab } from './AdminContactTab';
import { AdminDatabaseTab } from './AdminDatabaseTab';

interface AdminPanelProps {
  portfolioData: PortfolioData;
  onUpdatePortfolioData: (data: PortfolioData) => void;
  onCloseAdmin: () => void;
  onLogout: () => void;
}

type AdminTab = 'hero' | 'projects' | 'skills' | 'blog' | 'gallery' | 'contact' | 'database';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  portfolioData,
  onUpdatePortfolioData,
  onCloseAdmin,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [syncStatus, setSyncStatus] = useState<string>('All changes synchronized');

  const handleHeroSave = async (updatedHero: PortfolioData['hero']) => {
    const updated: PortfolioData = { ...portfolioData, hero: updatedHero };
    onUpdatePortfolioData(updated);
    const result = await storageService.savePortfolioData(updated);
    if (result.cloudSynced) {
      setSyncStatus('Hero content saved & synced to Supabase Cloud globally');
    } else {
      setSyncStatus('Saved on this browser (Cloud database not connected or blocked)');
    }
  };

  const handleProjectsSave = async (updatedProjects: PortfolioData['projects']) => {
    const updated: PortfolioData = { ...portfolioData, projects: updatedProjects };
    onUpdatePortfolioData(updated);
    const result = await storageService.savePortfolioData(updated);
    if (result.cloudSynced) {
      setSyncStatus('Projects saved & synced to Supabase Cloud globally');
    } else {
      setSyncStatus('Saved on this browser (Cloud database not connected or blocked)');
    }
  };

  const handleSkillsSave = async (updatedSkills: PortfolioData['skills']) => {
    const updated: PortfolioData = { ...portfolioData, skills: updatedSkills };
    onUpdatePortfolioData(updated);
    const result = await storageService.savePortfolioData(updated);
    if (result.cloudSynced) {
      setSyncStatus('Skills saved & synced to Supabase Cloud globally');
    } else {
      setSyncStatus('Saved on this browser (Cloud database not connected or blocked)');
    }
  };

  const handleBlogSave = async (updatedBlog: PortfolioData['blog']) => {
    const updated: PortfolioData = { ...portfolioData, blog: updatedBlog };
    onUpdatePortfolioData(updated);
    const result = await storageService.savePortfolioData(updated);
    if (result.cloudSynced) {
      setSyncStatus('Blog posts saved & synced to Supabase Cloud globally');
    } else {
      setSyncStatus('Saved on this browser (Cloud database not connected or blocked)');
    }
  };

  const handleGallerySave = async (updatedGallery: PortfolioData['gallery']) => {
    const updated: PortfolioData = { ...portfolioData, gallery: updatedGallery };
    onUpdatePortfolioData(updated);
    const result = await storageService.savePortfolioData(updated);
    if (result.cloudSynced) {
      setSyncStatus('Gallery media saved & synced to Supabase Cloud globally');
    } else {
      setSyncStatus('Saved on this browser (Cloud database not connected or blocked)');
    }
  };

  const handleContactSave = async (updatedContact: PortfolioData['contact']) => {
    const updated: PortfolioData = { ...portfolioData, contact: updatedContact };
    onUpdatePortfolioData(updated);
    const result = await storageService.savePortfolioData(updated);
    if (result.cloudSynced) {
      setSyncStatus('Contact channels saved & synced to Supabase Cloud globally');
    } else {
      setSyncStatus('Saved on this browser (Cloud database not connected or blocked)');
    }
  };

  const navItems = [
    { id: 'hero' as AdminTab, label: 'Hero / Intro', icon: <LayoutDashboard className="w-4 h-4" />, count: null },
    { id: 'projects' as AdminTab, label: 'Projects', icon: <FolderGit2 className="w-4 h-4" />, count: portfolioData.projects.length },
    { id: 'skills' as AdminTab, label: 'Skills', icon: <Layers className="w-4 h-4" />, count: portfolioData.skills.length },
    { id: 'blog' as AdminTab, label: 'Blog Posts', icon: <BookOpen className="w-4 h-4" />, count: portfolioData.blog.length },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: <Camera className="w-4 h-4" />, count: portfolioData.gallery.length },
    { id: 'contact' as AdminTab, label: 'Contact Links', icon: <Mail className="w-4 h-4" />, count: null },
    { id: 'database' as AdminTab, label: 'Database & Sync', icon: <Database className="w-4 h-4" />, count: null },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e5e7eb] flex flex-col">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0e141f] border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Live Portfolio</span>
          </button>
          
          <div className="h-4 w-px bg-gray-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white hidden sm:inline">
              VarunShiswal_SEC CMS Dashboard
            </span>
          </div>
        </div>

        {/* Sync Status & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{syncStatus}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-red-950/40 text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/40 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-[#111827] border border-gray-800/80 rounded-2xl p-3 space-y-1 sticky top-20">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Content Sections
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.count !== null && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-gray-800/80">
              <button
                onClick={onCloseAdmin}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 bg-[#111827] border border-gray-800/80 rounded-2xl p-6 sm:p-8 min-h-[600px]">
          {activeTab === 'hero' && (
            <AdminHeroTab
              hero={portfolioData.hero}
              onSave={handleHeroSave}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsTab
              projects={portfolioData.projects}
              onSave={handleProjectsSave}
            />
          )}

          {activeTab === 'skills' && (
            <AdminSkillsTab
              skills={portfolioData.skills}
              onSave={handleSkillsSave}
            />
          )}

          {activeTab === 'blog' && (
            <AdminBlogTab
              posts={portfolioData.blog}
              onSave={handleBlogSave}
            />
          )}

          {activeTab === 'gallery' && (
            <AdminGalleryTab
              gallery={portfolioData.gallery}
              onSave={handleGallerySave}
            />
          )}

          {activeTab === 'contact' && (
            <AdminContactTab
              contact={portfolioData.contact}
              onSave={handleContactSave}
            />
          )}

          {activeTab === 'database' && (
            <AdminDatabaseTab
              portfolioData={portfolioData}
              onDataReload={(reloaded) => onUpdatePortfolioData(reloaded)}
            />
          )}
        </main>

      </div>

    </div>
  );
};
