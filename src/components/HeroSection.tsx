import React from 'react';
import { HeroContent, ContactLinks } from '../types';
import { 
  ArrowRight, 
  Mail, 
  Download,
  FileText,
  Server,
  Network,
  ShieldCheck,
  User
} from 'lucide-react';

interface HeroSectionProps {
  hero: HeroContent;
  contact: ContactLinks;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, contact }) => {
  return (
    <section id="about" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Ambience: Subtle Tech Grid */}
      <div className="absolute inset-0 tech-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Hero Card */}
          <div className="lg:col-span-8 bg-[#111827] p-6 sm:p-8 md:p-10 rounded-xl card-glow">
            
            {/* Status / Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0e14] border border-white/10 text-xs font-semibold text-gray-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
              <span>{hero.badgeText || 'Enterprise IT & Security • it-guy'}</span>
              <span className="text-gray-600">•</span>
              <span className="text-[#3b82f6]">{hero.availability || 'Available for Opportunities'}</span>
            </div>

            {/* Profile Avatar + Name Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              {hero.avatarUrl ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-xl shadow-blue-500/10 shrink-0 bg-[#0a0e14]">
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <div>
                {/* Name with Accent Glow */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1.5 accent-glow tracking-tight">
                  {hero.name || 'VarunShiswal_SEC'}
                </h1>
                
                {/* Subtitle / it-guy */}
                <p className="text-[#3b82f6] font-bold text-xs sm:text-sm tracking-widest uppercase">
                  {hero.subtitle || 'IT PROFESSIONAL | IT-GUY | CYBERSECURITY ENTHUSIAST'}
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[#9ca3af] text-sm sm:text-base leading-relaxed mb-6">
              {hero.bio}
            </p>

            {/* Highlight Bullet Points */}
            <ul className="space-y-2.5 mb-8">
              {hero.highlights && hero.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center text-xs sm:text-sm text-[#e5e7eb] gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons: View Projects, Contact, and Download Resume */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3b82f6] hover:bg-blue-500 text-white rounded-lg font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {hero.resumeUrl ? (
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={hero.resumeFilename || 'Varun_Shiswal_Resume.pdf'}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/30 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/10 hover:border-white/30 text-white rounded-lg font-bold text-xs sm:text-sm transition-all hover:bg-white/5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#3b82f6]" />
                  <span>Request Resume</span>
                </a>
              )}

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/10 hover:border-white/30 text-white rounded-lg font-bold text-xs sm:text-sm transition-all hover:bg-white/5 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#3b82f6]" />
                <span>Let's Connect</span>
              </a>
            </div>
          </div>

          {/* Quick Connect & Domains Card (Right Column) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Connect Section */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/5">
              <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-4">
                Connect
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0a0e14] p-3 rounded border border-white/5 hover:border-white/20 flex items-center gap-2.5 transition-all text-gray-300 hover:text-white"
                  >
                    <div className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
                    <span className="text-xs font-medium truncate">GitHub</span>
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0a0e14] p-3 rounded border border-white/5 hover:border-blue-400/40 flex items-center gap-2.5 transition-all text-gray-300 hover:text-white"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-xs font-medium truncate">LinkedIn</span>
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="bg-[#0a0e14] p-3 rounded border border-white/5 hover:border-red-400/40 flex items-center gap-2.5 transition-all text-gray-300 hover:text-white"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-xs font-medium truncate">Email</span>
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0a0e14] p-3 rounded border border-white/5 hover:border-purple-400/40 flex items-center gap-2.5 transition-all text-gray-300 hover:text-white"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    <span className="text-xs font-medium truncate">Instagram</span>
                  </a>
                )}
              </div>
            </div>

            {/* Core Domain Competencies Card */}
            <div className="bg-[#111827] p-6 rounded-xl border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-widest mb-3">
                Focus Areas
              </h3>
              
              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <Server className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                <span>Systems Administration (Linux / Windows Server)</span>
              </div>
              
              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <Network className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                <span>Network Engineering & Wireshark Traffic Triage</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                <span>Vulnerability Assessment & Active Directory Auditing</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
