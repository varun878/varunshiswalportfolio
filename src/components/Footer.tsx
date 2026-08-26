import React from 'react';
import { Shield, ArrowUp, Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { ContactLinks } from '../types';

interface FooterProps {
  contact: ContactLinks;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ contact, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111827] border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-[#3b82f6]">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-white">
              VarunShiswal<span className="text-[#3b82f6] font-mono">_SEC</span>
            </span>
            <span className="text-[#9ca3af] text-xs">| IT Professional</span>
          </div>

          {/* Nav quick links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#9ca3af]">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <button onClick={onOpenAdmin} className="hover:text-[#3b82f6] transition-colors cursor-pointer">
              Admin Portal
            </button>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-2">
            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-1.5 rounded bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-1.5 rounded bg-[#0a0e14] text-[#9ca3af] hover:text-[#3b82f6] border border-white/5 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="p-1.5 rounded bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-1.5 rounded bg-[#0a0e14] text-[#9ca3af] hover:text-pink-400 border border-white/5 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-[#0a0e14] text-[#9ca3af] hover:text-white border border-white/5 transition-colors cursor-pointer"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#9ca3af] gap-2">
          <div>© 2026 VarunShiswal_SEC | All Rights Reserved</div>
          <div>Securing Digital Assets, One Packet at a Time.</div>
        </div>
      </div>
    </footer>
  );
};
