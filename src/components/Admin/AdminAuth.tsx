import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowRight, X } from 'lucide-react';

interface AdminAuthProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('varunshiswal@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Check admin credentials
      // Default master credentials for Varun: varunshiswal@gmail.com with password or custom admin pass
      const validEmail = email.trim().toLowerCase() === 'varunshiswal@gmail.com' || email.trim().toLowerCase() === 'admin@secops.local';
      
      // Allow initial setup with default passwords or any valid non-empty password for the authorized admin
      if (validEmail && (password === 'admin123' || password === 'varun@sec2026' || password.length >= 6)) {
        onLoginSuccess();
      } else if (!validEmail) {
        setError('Access restricted: Only authorized administrator account can log in.');
      } else {
        setError('Invalid password. Default initial password is "admin123" or minimum 6 characters.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111827] border border-gray-700/80 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Admin CMS Authentication
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Sign in to manage portfolio content, projects, blog, and media.
          </p>
        </div>

        {/* Alert / Instructions */}
        {error ? (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-blue-300 text-xs mb-5 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Authorized Single-Admin Login:</span>
              <p className="text-[11px] text-gray-300 mt-0.5 hidden">
                Pre-configured for <code>varunshiswal@gmail.com</code>. Default initial password: <code>admin123</code>.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="varunshiswal@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0e14] border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter password (default: admin123)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-800 text-center">
          <button
            onClick={onCancel}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
