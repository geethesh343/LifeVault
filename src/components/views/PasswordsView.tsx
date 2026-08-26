import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Unlock,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { PasswordItem } from '../../types';

interface PasswordsViewProps {
  onOpenAddPwd: () => void;
}

export const PasswordsView: React.FC<PasswordsViewProps> = ({ onOpenAddPwd }) => {
  const {
    passwords,
    isVaultLocked,
    unlockVault,
    lockVault,
    deletePassword,
    addToast,
  } = useWallet();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockVault(enteredPin)) {
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const toggleReveal = (id: string) => {
    if (revealedIds.includes(id)) {
      setRevealedIds(revealedIds.filter((i) => i !== id));
    } else {
      setRevealedIds([...revealedIds, id]);
    }
  };

  const handleCopyPassword = (pwd: PasswordItem) => {
    navigator.clipboard.writeText(pwd.passwordEncrypted);
    setCopiedId(pwd.id);
    addToast({
      title: 'Password Copied to Clipboard',
      description: 'Will auto-clear in 15 seconds for your security.',
      type: 'success',
    });
    setTimeout(() => {
      setCopiedId(null);
    }, 3000);
  };

  const filteredPasswords = passwords.filter(
    (p) =>
      !searchFilter ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // If locked, render the Master Vault Shield Screen
  if (isVaultLocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800/90 rounded-3xl p-8 text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Password Vault is Locked</h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
            Zero-knowledge encrypted. Enter your 4-digit Master PIN to decrypt and manage your credentials. (Default: 1234)
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter Master PIN (1234)"
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-center text-lg font-mono text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 tracking-widest"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-400 mt-2 font-semibold">Incorrect PIN. Please try again (1234).</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/25 transition-all"
          >
            Unlock Password Vault
          </button>
        </form>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Client-Side AES-256 Decryption</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Encrypted Password Vault</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Unlocked
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero-knowledge credential storage with password generator & 2FA backup codes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={lockVault}
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Lock Vault</span>
          </button>

          <button
            onClick={onOpenAddPwd}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-600/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Store Password</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search logins, accounts, categories..."
          className="w-full bg-slate-900 border border-slate-800/90 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Password List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPasswords.map((pwd) => {
          const isRevealed = revealedIds.includes(pwd.id);
          const isCopied = copiedId === pwd.id;

          return (
            <div
              key={pwd.id}
              className="bg-slate-900 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80 capitalize">
                    {pwd.category}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete password for "${pwd.title}"?`)) deletePassword(pwd.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  {pwd.title}
                </h3>

                <div className="text-xs text-slate-400 mt-1 font-mono font-medium">{pwd.username}</div>

                {/* Password Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-200 tracking-wider">
                    {isRevealed ? pwd.passwordEncrypted : '••••••••••••••••'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleReveal(pwd.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title={isRevealed ? 'Hide' : 'Reveal'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopyPassword(pwd)}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Copy"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2FA Key if present */}
                {pwd.twoFactorKey && (
                  <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                    <span className="font-semibold text-slate-300">2FA / TOTP: </span>
                    <span className="font-mono text-cyan-300">{pwd.twoFactorKey}</span>
                  </div>
                )}
              </div>

              {/* Website link */}
              {pwd.websiteUrl && (
                <div className="mt-4 pt-2 border-t border-slate-800/80">
                  <a
                    href={pwd.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 truncate transition-colors"
                  >
                    <span className="truncate">{pwd.websiteUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
