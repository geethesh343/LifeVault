import React, { useState } from 'react';
import {
  Search,
  Plus,
  Shield,
  ShieldAlert,
  Bell,
  Cloud,
  Lock,
  Unlock,
  User,
  Upload,
  CreditCard,
  KeyRound,
  Calendar,
  Receipt,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenAddSub: () => void;
  onOpenAddBill: () => void;
  onOpenAddPwd: () => void;
  onOpenAddReminder: () => void;
  onOpenGoogleModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenAddSub,
  onOpenAddBill,
  onOpenAddPwd,
  onOpenAddReminder,
  onOpenGoogleModal,
}) => {
  const {
    user,
    setIsSearchModalOpen,
    isVaultLocked,
    lockVault,
    unlockVault,
    getExpiringSoonItems,
    setActiveTab,
    storageUsagePercent,
  } = useWallet();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  const expiringItems = getExpiringSoonItems();
  const criticalCount = expiringItems.filter((i) => i.urgency === 'critical' || i.urgency === 'high').length;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockVault(enteredPin)) {
      setPinPromptOpen(false);
      setEnteredPin('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Cloud Status */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400 group-hover:scale-105 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 font-sans">
                LifeVault <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-extrabold">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 shadow-xs">
                AWS Cloud v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Life Management & Digital Vault</p>
          </div>
        </div>

        {/* Global Search Bar (Cmd + K) */}
        <div className="flex-1 max-w-xl mx-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs sm:text-sm shadow-xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Search documents, expiries, bills, subscriptions with AI...</span>
            </div>
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-900/90 text-slate-400 rounded-md border border-slate-700">
                ⌘K
              </span>
            </div>
          </button>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AWS Cloud Architecture Quick Indicator */}
          <button
            onClick={() => setActiveTab('cloud-arch')}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-300 transition-all shadow-xs"
            title="View Live AWS EC2, S3, RDS & CloudWatch infrastructure"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-[11px] text-slate-300">AWS ap-south-1</span>
          </button>

          {/* Quick Add Menu */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Record</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {isQuickAddOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
                onMouseLeave={() => setIsQuickAddOpen(false)}
              >
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Store New Asset
                </div>
                <button
                  onClick={() => {
                    onOpenUpload();
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Upload Document</div>
                    <div className="text-[10px] text-slate-400">Aadhaar, PAN, Passport, Policy</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onOpenAddSub();
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Add Subscription</div>
                    <div className="text-[10px] text-slate-400">Netflix, AWS, Gym, Prime</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onOpenAddBill();
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                >
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Add Bill / Invoice</div>
                    <div className="text-[10px] text-slate-400">Electricity, Gas, Broadband</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onOpenAddPwd();
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Store Password</div>
                    <div className="text-[10px] text-slate-400">Zero-knowledge encrypted record</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onOpenAddReminder();
                    setIsQuickAddOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors border-t border-slate-800"
                >
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Schedule Reminder</div>
                    <div className="text-[10px] text-slate-400">Renewal or deadline alert</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Master Vault Lock / Unlock Toggle */}
          <div className="relative">
            {isVaultLocked ? (
              <button
                onClick={() => setPinPromptOpen(true)}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all text-xs flex items-center gap-1.5"
                title="Vault Locked - Click to enter Master PIN"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline font-mono text-xs">Locked</span>
              </button>
            ) : (
              <button
                onClick={lockVault}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs flex items-center gap-1.5"
                title="Vault Unlocked - Click to shield credentials"
              >
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline font-mono text-xs text-emerald-400">Secure</span>
              </button>
            )}

            {/* Quick PIN Modal inline */}
            {pinPromptOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" /> Unlock Master Vault
                </div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">Enter Master PIN to reveal passwords & confidential records (Default: 1234)</p>
                <form onSubmit={handleUnlockSubmit}>
                  <input
                    type="password"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="Enter PIN (1234)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono text-white mb-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPinPromptOpen(false)}
                      className="flex-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-2.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm transition-all"
                    >
                      Unlock
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Expiry Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 transition-colors shadow-xs"
              title="Renewal and Expiry Alerts"
            >
              <Bell className="w-4 h-4" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                  {criticalCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
                onMouseLeave={() => setIsNotifOpen(false)}
              >
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Upcoming Deadlines & Expiries</span>
                  <button
                    onClick={() => {
                      setActiveTab('expiries');
                      setIsNotifOpen(false);
                    }}
                    className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                  {expiringItems.length === 0 ? (
                    <div className="p-5 text-center text-xs text-slate-400">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 opacity-80" />
                      No urgent expiries. All documents and bills are up to date!
                    </div>
                  ) : (
                    expiringItems.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.type === 'document') setActiveTab('documents');
                          else if (item.type === 'subscription') setActiveTab('subscriptions');
                          else if (item.type === 'bill') setActiveTab('bills');
                          else if (item.type === 'warranty') setActiveTab('warranties');
                          setIsNotifOpen(false);
                        }}
                        className="p-3 hover:bg-slate-800/70 transition-colors cursor-pointer flex items-start gap-3 text-xs"
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.urgency === 'critical' || item.urgency === 'high' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Calendar className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-200 truncate">{item.title}</div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                            <span className="capitalize text-slate-400">{item.type}</span>
                            <span
                              className={`font-semibold ${
                                item.daysLeft < 0
                                  ? 'text-rose-400'
                                  : item.daysLeft <= 7
                                  ? 'text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              {item.daysLeft < 0
                                ? 'Expired'
                                : item.daysLeft === 0
                                ? 'Due Today'
                                : `in ${item.daysLeft} days`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Google Login Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/80"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/60"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-800">
                  <div className="font-bold text-xs text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
                    {user.email}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
                      <span>AWS S3 Cloud Vault Storage</span>
                      <span className="font-mono text-slate-300">{user.storageUsedMb} MB / 5 GB</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${storageUsagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="py-1.5">
                  <button
                    onClick={() => {
                      onOpenGoogleModal();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5 font-medium">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Switch Google Account</span>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-semibold">
                      OAuth 2.0
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('family');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Family Access Circle</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('cloud-arch');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    <span>AWS CloudWatch & EC2 Status</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
