import React, { useState, useEffect } from 'react';
import { PortfolioData } from '../../types';
import { storageService } from '../../services/storage';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface AdminDatabaseTabProps {
  portfolioData: PortfolioData;
  onDataReload: (data: PortfolioData) => void;
}

export const AdminDatabaseTab: React.FC<AdminDatabaseTabProps> = ({ portfolioData, onDataReload }) => {
  const config = storageService.getSupabaseConfig();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    // Verify the live database connection automatically when this tab opens.
    let active = true;
    (async () => {
      setTesting(true);
      const res = await storageService.testSupabaseConnection();
      if (active) {
        setTestResult(res);
        setTesting(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleVerifyConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await storageService.testSupabaseConnection();
    setTestResult(res);
    if (res.success) {
      // Push the current content to the cloud to guarantee it is in sync.
      await storageService.savePortfolioData(portfolioData);
    }
    setTesting(false);
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
          <h3 className="text-lg font-bold text-white">Database & Cloud Sync</h3>
          <p className="text-xs text-gray-400">Your portfolio is permanently connected to a live cloud database. Edits sync to every device automatically.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
            config.isConnected
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              : 'bg-red-950/60 text-red-300 border-red-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${config.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span>{config.isConnected ? 'Cloud Database Connected' : 'Connection Error'}</span>
          </div>
        </div>
      </div>

      {/* Live Connection Status Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0a0e14] to-blue-950/30 border border-emerald-500/30 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Global Sync is Active</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              The database connection is built directly into the site, so it works automatically on every deployment &mdash; Vercel, a custom domain, or a downloaded copy &mdash; with zero setup. Every change you save here is stored in the cloud and appears instantly for all visitors on all devices.
            </p>
          </div>
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Live cloud database &mdash; managed automatically, no configuration required.</span>
          </div>
          <button
            onClick={handleVerifyConnection}
            disabled={testing}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Verifying...' : 'Verify & Re-sync'}</span>
          </button>
        </div>
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
