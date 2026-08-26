import React, { useState } from 'react';
import { X, User, CheckCircle2, Shield, LogIn, ExternalLink } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, addToast } = useWallet();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Arvind Sharma',
      email: 'arvind.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Arvind (Work)',
      email: 'arvind.dev@techcorp.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Sharma (Family Co-Owner)',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectAccount = (acc: typeof accounts[0]) => {
    setUser({
      ...user,
      name: acc.name,
      email: acc.email,
      avatar: acc.avatar,
    });
    addToast({
      title: 'Google Account Switched',
      description: `Authenticated as ${acc.name} (${acc.email}) via Google OAuth 2.0.`,
      type: 'success',
    });
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setUser({
      ...user,
      name,
      email,
    });
    addToast({
      title: 'Profile Updated',
      description: `Active wallet session updated to ${email}.`,
      type: 'success',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Google Authentication & Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Single Sign-On (SSO) & Vault Ownership</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Verified Google Account
            </div>
            <div className="space-y-2">
              {accounts.map((acc) => {
                const isCurrent = user.email === acc.email;
                return (
                  <div
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-indigo-500/15 border-indigo-500/50 text-white shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800" />
                      <div>
                        <div className="font-semibold text-xs text-white">{acc.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">Switch</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Or Customize Current Profile
            </div>
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Google Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors shadow-inner"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
