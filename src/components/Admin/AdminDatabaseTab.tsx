import React, { useState, useEffect } from 'react';
import { SupabaseConfig, PortfolioData } from '../../types';
import { storageService, SUPABASE_SQL_SCHEMA } from '../../services/storage';
import { 
  Database, 
  Check, 
  Copy, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Server, 
  ShieldCheck,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface AdminDatabaseTabProps {
  portfolioData: PortfolioData;
  onDataReload: (data: PortfolioData) => void;
}

export const AdminDatabaseTab: React.FC<AdminDatabaseTabProps> = ({ portfolioData, onDataReload }) => {
  const [config, setConfig] = useState<SupabaseConfig>(storageService.getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const res = await storageService.testSupabaseConnection(config.url, config.anonKey);
    setTestResult(res);

    if (res.success) {
      const updatedConfig: SupabaseConfig = {
        url: config.url,
        anonKey: config.anonKey,
        isConnected: true
      };
      setConfig(updatedConfig);
      storageService.saveSupabaseConfig(updatedConfig);
      // Sync current portfolio data to Supabase
      await storageService.savePortfolioData(portfolioData);
    } else {
      const updatedConfig: SupabaseConfig = {
        url: config.url,
        anonKey: config.anonKey,
        isConnected: false
      };
      setConfig(updatedConfig);
      storageService.saveSupabaseConfig(updatedConfig);
    }
    setTesting(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `varunshiswal_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.hero && parsed.projects) {
          await storageService.savePortfolioData(parsed);
          onDataReload(parsed);
          alert('Portfolio data backup restored successfully!');
        } else {
          alert('Invalid backup format. Ensure it contains hero and projects.');
        }
      } catch (err) {
        alert('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all portfolio sections to original starter template data? Any unsaved edits will be replaced with defaults.')) {
      setResetting(true);
      const defaults = storageService.resetToDefault();
      await storageService.savePortfolioData(defaults);
      onDataReload(defaults);
      setResetting(false);
      alert('Portfolio reset to default template.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Database & Supabase Configuration</h3>
          <p className="text-xs text-gray-400">Connect a live Supabase instance or manage your persistent offline storage & backups.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
            config.isConnected
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              : 'bg-blue-950/60 text-blue-300 border-blue-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${config.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
            <span>{config.isConnected ? 'Supabase Cloud Connected' : 'Persistent Local Engine'}</span>
          </div>
        </div>
      </div>

      {/* Vercel Global Sync Guide Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0a0e14] to-indigo-950/40 border border-blue-500/30 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
            <Server className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Why changes aren't showing on other devices after Vercel deployment</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Important</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              When you edit inside this Admin Panel, your changes are saved to Supabase Cloud. However, for <strong>other visitors and devices</strong> to read your Supabase database, you <strong>must add these 2 Environment Variables in your Vercel Dashboard</strong>:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#111827] border border-gray-700/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-gray-400">Vercel Variable 1</div>
              <code className="text-xs font-mono font-bold text-blue-300">VITE_SUPABASE_URL</code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('VITE_SUPABASE_URL');
                alert('Copied "VITE_SUPABASE_URL" to clipboard!');
              }}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              title="Copy Key Name"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#111827] border border-gray-700/80 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-gray-400">Vercel Variable 2</div>
              <code className="text-xs font-mono font-bold text-blue-300">VITE_SUPABASE_ANON_KEY</code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('VITE_SUPABASE_ANON_KEY');
                alert('Copied "VITE_SUPABASE_ANON_KEY" to clipboard!');
              }}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              title="Copy Key Name"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 pt-1 flex items-center gap-1.5">
          <span className="text-blue-400 font-bold">Quick Step:</span> In Vercel &rarr; Your Project &rarr; Settings &rarr; Environment Variables &rarr; Add both variables &rarr; Redeploy project.
        </div>
      </div>

      {/* Supabase Connection Setup Card */}
      <div className="p-6 rounded-2xl bg-[#0a0e14] border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Supabase Cloud Sync Settings</h4>
              <p className="text-xs text-gray-400">Optional: Connect your free Supabase project to persist changes across any device.</p>
            </div>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {testResult && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            testResult.success
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-gray-500">
              When disconnected, the portfolio operates in 100% persistent local mode and instantly syncs once connected.
            </p>
            <button
              type="submit"
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Connection...' : 'Test & Save Supabase'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Migration Script Copy Box */}
      <div className="p-6 rounded-2xl bg-[#0a0e14] border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Supabase SQL Table Schema</h4>
            <p className="text-xs text-gray-400">Copy and run this in your Supabase SQL Editor to initialize the <code>site_content</code> table and Storage bucket.</p>
          </div>
          <button
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied SQL!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-[#111827] border border-gray-800 text-blue-300 font-mono text-xs overflow-x-auto max-h-48">
          <code>{SUPABASE_SQL_SCHEMA}</code>
        </pre>
      </div>

      {/* Backup, Restore & Reset Operations */}
      <div className="p-6 rounded-2xl bg-[#0a0e14] border border-gray-800 space-y-4">
        <h4 className="text-sm font-bold text-white">Data Backups & Recovery</h4>
        <p className="text-xs text-gray-400">Export a complete JSON snapshot of all your portfolio content or restore a previous backup with 1 click.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export */}
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#111827] hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import */}
          <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#111827] hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-semibold cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restore Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          {/* Reset Defaults */}
          <button
            onClick={handleResetDefaults}
            disabled={resetting}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#111827] hover:bg-red-950/40 border border-gray-700 hover:border-red-500/40 text-gray-300 hover:text-red-400 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Template Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
