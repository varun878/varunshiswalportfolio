/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData } from './types';
import { INITIAL_PORTFOLIO_DATA } from './data/initialData';
import { storageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { BlogSection } from './components/BlogSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminAuth } from './components/Admin/AdminAuth';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Lock, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    // Load portfolio data from storage / Supabase
    const initData = async () => {
      try {
        const loaded = await storageService.loadPortfolioData();
        setData(loaded);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
    setIsAdminLoggedIn(storageService.isAdminAuthenticated());

    // Check for /admin in path or #admin in hash
    const handleUrlCheck = () => {
      const isUrlAdmin = window.location.pathname.includes('/admin') || window.location.hash.includes('#admin');
      if (isUrlAdmin) {
        if (storageService.isAdminAuthenticated()) {
          setIsAdminViewOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects', 'skills', 'blog', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsAdminViewOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    storageService.setAdminAuthenticated(true);
    setIsAuthModalOpen(false);
    setIsAdminViewOpen(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    storageService.setAdminAuthenticated(false);
    setIsAdminViewOpen(false);
    if (window.location.hash.includes('#admin')) {
      window.location.hash = '';
    }
  };

  const handleUpdateData = (updated: PortfolioData) => {
    setData(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e14] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 animate-pulse">
          <Shield className="w-6 h-6" />
        </div>
        <div className="text-sm font-semibold text-gray-300">Loading VarunShiswal_SEC Portfolio...</div>
      </div>
    );
  }

  // If Admin Panel is open in full view
  if (isAdminViewOpen && isAdminLoggedIn) {
    return (
      <AdminPanel
        portfolioData={data}
        onUpdatePortfolioData={handleUpdateData}
        onCloseAdmin={() => setIsAdminViewOpen(false)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e5e7eb] selection:bg-blue-600 selection:text-white flex flex-col relative">
      
      {/* Navigation Bar */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection hero={data.hero} contact={data.contact} />
        <ProjectsSection projects={data.projects} />
        <SkillsSection skills={data.skills} />
        <BlogSection posts={data.blog} />
        <GallerySection gallery={data.gallery} />
        <ContactSection contact={data.contact} />
      </main>

      {/* Footer */}
      <Footer contact={data.contact} onOpenAdmin={handleOpenAdmin} />

      {/* Floating Admin Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={handleOpenAdmin}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl border backdrop-blur-md transition-all ${
            isAdminLoggedIn
              ? 'bg-[#111827]/90 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/60'
              : 'bg-[#111827]/90 text-gray-300 border-gray-700/80 hover:text-white hover:border-blue-500/60'
          }`}
          title="Open CMS Admin Dashboard (/admin)"
        >
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>{isAdminLoggedIn ? 'Admin Panel (Active)' : 'Admin Dashboard'}</span>
        </button>
      </div>

      {/* Admin Login Modal */}
      {isAuthModalOpen && (
        <AdminAuth
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setIsAuthModalOpen(false)}
        />
      )}

    </div>
  );
}
