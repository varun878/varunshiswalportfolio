import React, { useState, useEffect } from 'react';
import { Shield, Lock, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminLoggedIn, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Blog', href: '#blog' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0e14]/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Brand Zone */}
          <a
            href="#about"
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-500/80 transition-all">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              VarunShiswal<span className="text-[#3b82f6] font-mono">_SEC</span>
            </span>
          </a>

          {/* Navigation Links Zone */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#9ca3af]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#3b82f6] font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className={`px-3.5 py-1.5 border rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isAdminLoggedIn
                  ? 'border-emerald-500/60 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/30'
                  : 'border-[#3b82f6] text-[#3b82f6] hover:bg-blue-600/10'
              }`}
              title="Open Admin Content Management Dashboard"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin Portal'}</span>
            </button>

            <a
              href="#contact"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded bg-[#3b82f6] hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Contact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded bg-[#111827] border border-white/5 text-gray-300 hover:text-white"
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-[#111827] border border-white/5 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e141f] border-b border-white/5 px-4 pt-3 pb-5 space-y-2 mt-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-[#3b82f6] hover:bg-gray-800/60 rounded transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-[#3b82f6] text-[#3b82f6] hover:bg-blue-600/10"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded bg-[#3b82f6] text-white hover:bg-blue-500"
            >
              <span>Contact Varun</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
