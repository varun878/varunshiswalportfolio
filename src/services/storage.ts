import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PortfolioData, SupabaseConfig } from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/initialData';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabaseCredentials';

const LOCAL_STORAGE_KEY = 'varunshiswal_portfolio_data_v1';
const ADMIN_AUTH_KEY = 'varunshiswal_admin_auth';

class StorageService {
  private client: SupabaseClient | null = null;

  constructor() {
    this.initSupabaseClient();
  }

  public getSupabaseConfig(): SupabaseConfig {
    // Credentials are hardcoded in src/config/supabaseCredentials.ts so the
    // database connection works on ANY deployment target with zero setup.
    return {
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY,
      isConnected: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
    };
  }

  public initSupabaseClient(): void {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

  public async testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.client) {
        this.initSupabaseClient();
      }
      if (!this.client) {
        return { success: false, message: 'Supabase credentials are not configured.' };
      }
      const { error } = await this.client.from('site_content').select('key').limit(1);

      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist') || error.code === '42P01') {
          return {
            success: false,
            message: 'Connected to Supabase, but the site_content table is missing. Please contact the site owner.'
          };
        }
        return { success: false, message: `Supabase Error (${error.code || 'RLS'}): ${error.message}` };
      }
      return { success: true, message: 'Live database connected and verified. All changes sync globally.' };
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
