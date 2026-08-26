import React from 'react';
import { ContactLinks } from '../types';
import { 
  ExternalLink, 
  MessageSquare,
  Github,
  Linkedin,
  Mail,
  Instagram,
  ArrowUpRight
} from 'lucide-react';

interface ContactSectionProps {
  contact: ContactLinks;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const contactCards = [
    {
      name: 'GitHub',
      handle: 'github.com/varun878',
      description: 'Repositories, projects & open-source tools',
      href: contact.github || 'https://github.com/varun878',
      icon: Github,
      iconColor: 'text-white',
      badgeColor: 'bg-white/10 text-gray-200 border-white/10',
      actionLabel: 'View GitHub',
      isEmail: false
    },
    {
      name: 'LinkedIn',
      handle: 'Varun Kumar',
      description: 'Professional networking & career updates',
      href: contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`,
      icon: Linkedin,
      iconColor: 'text-[#38bdf8]',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      actionLabel: 'Connect',
      isEmail: false
    },
    {
      name: 'Email',
      handle: 'Direct Inquiries',
      description: 'Reach out for security & infrastructure consultations',
      href: `mailto:${contact.email}`,
      icon: Mail,
      iconColor: 'text-[#f87171]',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      actionLabel: 'Send Email',
      isEmail: true
    },
    {
      name: 'Instagram',
      handle: '@varunkumar.sec',
      description: 'Cybersecurity insights & behind-the-scenes labs',
      href: contact.instagram || 'https://www.instagram.com/varunkumar.sec/',
      icon: Instagram,
      iconColor: 'text-[#c084fc]',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      actionLabel: 'Follow',
      isEmail: false
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Container */}
        <div className="bg-[#111827] p-6 sm:p-8 rounded-xl border border-white/5">
          
          {/* Section Header */}
          <div className="pb-4 mb-6 border-b border-white/5">
            <div className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect Channels</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Let's Connect
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] mt-1">
              Connect directly across professional platforms or initiate a direct email conversation.
            </p>
          </div>

          {/* Clean Connect Cards Grid with Action Link Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0a0e14] p-5 rounded-xl border border-white/5 hover:border-blue-500/40 card-glow flex flex-col justify-between group transition-all"
                >
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#111827] border border-white/5 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                        <IconComp className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${card.badgeColor}`}>
                        {card.name}
                      </span>
                    </div>

                    {/* Details: Handle/Name without displaying raw email */}
                    <div className="mb-2">
                      <div className="text-sm font-bold text-white group-hover:text-[#3b82f6] transition-colors truncate">
                        {card.handle}
                      </div>
                      <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-4 mt-2 border-t border-white/5">
                    <a
                      href={card.href}
                      target={card.isEmail ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#111827] hover:bg-[#3b82f6] text-gray-200 hover:text-white border border-white/5 hover:border-transparent text-xs font-bold transition-all shadow-sm group-hover:shadow-blue-500/20"
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
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
