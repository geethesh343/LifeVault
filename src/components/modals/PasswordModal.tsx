import React, { useState } from 'react';
import { X, KeyRound, RefreshCw, Eye, EyeOff, Shield, Copy, Check } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { PasswordCategory } from '../../types';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const { addPassword, familyMembers } = useWallet();

  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState<PasswordCategory>('banking');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [twoFactorKey, setTwoFactorKey] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let res = '';
    for (let i = 0; i < 18; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
  };

  const calculateStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 14) score += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    return Math.min(100, score);
  };

  const strength = calculateStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !password.trim()) return;

    addPassword({
      title,
      username: username || email || 'user',
      email: email || undefined,
      passwordEncrypted: password,
      category,
      websiteUrl: websiteUrl || undefined,
      twoFactorKey: twoFactorKey || undefined,
      strengthScore: strength,
      notes: notes || undefined,
      familySharedWith: selectedFamily,
      isCompromised: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Store Encrypted Password</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Zero-knowledge client encrypted credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Account / Service Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HDFC NetBanking, GitHub, AWS Root"
              className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-inner font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username / User ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. arvind_g98"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PasswordCategory)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner font-medium"
              >
                <option value="banking">Banking & Finance</option>
                <option value="work">Work & Cloud DevOps</option>
                <option value="email">Email Accounts</option>
                <option value="social">Social & Identity</option>
                <option value="shopping">Shopping & Payments</option>
                <option value="crypto">Crypto & Web3</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Password with Generator */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password / Secret Key *</label>
              <button
                type="button"
                onClick={generateStrongPassword}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Generate Strong
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter or generate password"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 pr-14 text-xs text-white font-mono focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Strength indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                  <span>Strength Rating</span>
                  <span
                    className={
                      strength >= 80 ? 'text-emerald-400' : strength >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }
                  >
                    {strength >= 80 ? 'Very Strong' : strength >= 50 ? 'Medium' : 'Weak'} ({strength}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      strength >= 80 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : strength >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://netbanking.bank.com"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-inner font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">2FA / TOTP Backup Key</label>
              <input
                type="text"
                value={twoFactorKey}
                onChange={(e) => setTwoFactorKey(e.target.value)}
                placeholder="TOTP Seed or SMS instructions"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-800/80 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-600/25 transition-all active:scale-95"
            >
              Encrypt & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
