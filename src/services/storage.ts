import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PortfolioData, SupabaseConfig } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'varunshiswal_portfolio_data_v1';
const SUPABASE_CONFIG_KEY = 'varunshiswal_supabase_config';
const ADMIN_AUTH_KEY = 'varunshiswal_admin_auth';

// Robust, idempotent SQL table initialization script for Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- VarunShiswal_SEC Portfolio Database Schema for Supabase
-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Create table for portfolio content
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (allows all visitors on any device to view your portfolio)
DROP POLICY IF EXISTS "Public Read Access" ON public.site_content;
CREATE POLICY "Public Read Access" 
ON public.site_content 
FOR SELECT 
TO public, anon, authenticated 
USING (true);

-- 4. Full access policy (allows admin panel to save changes globally)
DROP POLICY IF EXISTS "Allow Full Access" ON public.site_content;
CREATE POLICY "Allow Full Access" 
ON public.site_content 
FOR ALL 
TO public, anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Create Storage Bucket for Gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage Bucket Access Policies
DROP POLICY IF EXISTS "Public Gallery Read" ON storage.objects;
CREATE POLICY "Public Gallery Read" 
ON storage.objects 
FOR SELECT 
TO public, anon, authenticated 
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public Gallery Upload" ON storage.objects;
CREATE POLICY "Public Gallery Upload" 
ON storage.objects 
FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public Gallery Update" ON storage.objects;
CREATE POLICY "Public Gallery Update" 
ON storage.objects 
FOR UPDATE 
TO public, anon, authenticated 
USING (bucket_id = 'gallery');
`;

class StorageService {
  private client: SupabaseClient | null = null;

  constructor() {
    this.initSupabaseClient();
  }

  public getSupabaseConfig(): SupabaseConfig {
    // 1. Check Vite / Vercel Environment Variables
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    const envUrl = metaEnv?.VITE_SUPABASE_URL || '';
    const envKey = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

    // 2. Check LocalStorage configuration set from Admin Panel
    let localUrl = '';
    let localKey = '';
    try {
      const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        localUrl = parsed.url || '';
        localKey = parsed.anonKey || '';
      }
    } catch {
      // fallback
    }

    const activeUrl = envUrl || localUrl;
    const activeKey = envKey || localKey;

    return {
      url: activeUrl,
      anonKey: activeKey,
      isConnected: Boolean(activeUrl && activeKey)
    };
  }

  public saveSupabaseConfig(config: SupabaseConfig): void {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
    this.initSupabaseClient();
  }

  public initSupabaseClient(): void {
    const config = this.getSupabaseConfig();
    if (config.url && config.anonKey) {
      try {
        this.client = createClient(config.url, config.anonKey, {
          auth: {
            persistSession: false
          }
        });
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public async testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!url || !key) {
        return { success: false, message: 'URL and Anon Key are required.' };
      }
      const testClient = createClient(url, key, { auth: { persistSession: false } });
      const { data, error } = await testClient.from('site_content').select('key').limit(1);
      
      if (error) {
        // Missing table error check
        if (error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
          return {
            success: true,
            message: 'Connected to Supabase! However, the site_content table is missing. Copy and run the SQL migration script below in your Supabase SQL Editor.'
          };
        }
        return { success: false, message: `Supabase Error (${error.code || 'RLS'}): ${error.message}` };
      }
      return { success: true, message: 'Successfully connected and verified Supabase database!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown connection error';
      return { success: false, message: msg };
    }
  }

  public async loadPortfolioData(): Promise<PortfolioData> {
    // 1. Try to load from Supabase if client is ready
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('site_content')
          .select('data')
          .eq('key', 'portfolio_main')
          .maybeSingle();

        if (!error && data && data.data) {
          const mergedData = { ...INITIAL_PORTFOLIO_DATA, ...data.data };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
          return mergedData;
        } else if (error) {
          console.warn('Supabase query returned error, using fallback:', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...INITIAL_PORTFOLIO_DATA, ...parsed };
      }
    } catch (err) {
      console.warn('Local storage parse error:', err);
    }

    // 3. Default to Initial Data and save locally
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PORTFOLIO_DATA));
    return INITIAL_PORTFOLIO_DATA;
  }

  public async savePortfolioData(data: PortfolioData): Promise<{ success: boolean; cloudSynced: boolean; error?: string }> {
    // Always persist to local cache first
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }

    // Sync to Supabase if connected
    if (this.client) {
      try {
        const { error } = await this.client
          .from('site_content')
          .upsert({
            key: 'portfolio_main',
            data: data,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });

        if (error) {
          console.error('Supabase upsert error:', error);
          return { success: true, cloudSynced: false, error: error.message };
        }
        return { success: true, cloudSynced: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown write error';
        console.error('Supabase write exception:', err);
        return { success: true, cloudSynced: false, error: msg };
      }
    }

    return { success: true, cloudSynced: false, error: 'Supabase is not connected. Changes are only saved on this browser.' };
  }

  public async uploadMedia(file: File): Promise<{ url: string; error?: string }> {
    // If Supabase Storage is configured, attempt upload to 'gallery' bucket
    if (this.client) {
      try {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const { error } = await this.client.storage
          .from('gallery')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (!error) {
          const { data: publicUrlData } = this.client.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (publicUrlData && publicUrlData.publicUrl) {
            return { url: publicUrlData.publicUrl };
          }
        } else {
          console.warn('Supabase storage upload error, using DataURL fallback:', error.message);
        }
      } catch (err) {
        console.warn('Storage upload exception, falling back to data URL:', err);
      }
    }

    // Offline / Local fallback: Read as Base64 Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Failed to process file locally' });
      };
      reader.readAsDataURL(file);
    });
  }

  // Admin Auth Helpers
  public isAdminAuthenticated(): boolean {
    const auth = localStorage.getItem(ADMIN_AUTH_KEY);
    return auth === 'authenticated_true';
  }

  public setAdminAuthenticated(val: boolean): void {
    if (val) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'authenticated_true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }

  public resetToDefault(): PortfolioData {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PORTFOLIO_DATA));
    return INITIAL_PORTFOLIO_DATA;
  }
}

export const storageService = new StorageService();
