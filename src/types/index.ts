export type ProjectCategory = 'completed' | 'ongoing' | 'contribution';

export interface HeroContent {
  name: string;
  subtitle: string;
  bio: string;
  highlights: string[];
  availability: string;
  location: string;
  badgeText: string;
  avatarUrl?: string;
  resumeUrl?: string;
  resumeFilename?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  techStack: string[];
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  date?: string;
  metrics?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description?: string;
  skills: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  tags: string[];
  author?: string;
  coverImage?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  caption?: string;
  date?: string;
  thumbnailUrl?: string;
}

export interface ContactLinks {
  github: string;
  linkedin: string;
  email: string;
  instagram: string;
  location?: string;
  phone?: string;
}

export interface PortfolioData {
  hero: HeroContent;
  projects: Project[];
  skills: SkillCategory[];
  blog: BlogPost[];
  gallery: GalleryItem[];
  contact: ContactLinks;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
