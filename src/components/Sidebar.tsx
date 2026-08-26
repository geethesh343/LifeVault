import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  Sparkles,
  CreditCard,
  KeyRound,
  CalendarClock,
  Receipt,
  ShieldCheck,
  BellRing,
  Users,
  CloudCog,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useWallet, NavigationTab } from '../context/WalletContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    documents,
    subscriptions,
    passwords,
    bills,
    warranties,
    reminders,
    familyMembers,
    getExpiringSoonItems,
    isVaultLocked,
  } = useWallet();

  const expiringCount = getExpiringSoonItems().filter(
    (i) => i.daysLeft <= 30
  ).length;

  const unpaidBillsCount = bills.filter((b) => !b.isPaid).length;
  const activeRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
    highlight?: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'documents',
      label: 'Document Vault',
      icon: FolderLock,
      badge: documents.length,
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
    },
    {
      id: 'ai-search',
      label: 'AI Smart Search',
      icon: Sparkles,
      badge: 'Gemini',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
      highlight: true,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: CreditCard,
      badge: subscriptions.length,
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
    },
    {
      id: 'passwords',
      label: 'Password Vault',
      icon: KeyRound,
      badge: isVaultLocked ? 'Locked' : passwords.length,
      badgeColor: isVaultLocked
        ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
        : 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'expiries',
      label: 'Expiry & Renewals',
      icon: CalendarClock,
      badge: expiringCount > 0 ? `${expiringCount} due` : undefined,
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800/80 font-bold',
    },
    {
      id: 'bills',
      label: 'Bills & Invoices',
      icon: Receipt,
      badge: unpaidBillsCount > 0 ? `${unpaidBillsCount} unpaid` : undefined,
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/80 font-semibold',
    },
    {
      id: 'warranties',
      label: 'Warranties',
      icon: ShieldCheck,
      badge: warranties.length,
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
    },
    {
      id: 'reminders',
      label: 'Reminders & Alerts',
      icon: BellRing,
      badge: activeRemindersCount > 0 ? activeRemindersCount : undefined,
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
    },
    {
      id: 'family',
      label: 'Family Access Circle',
      icon: Users,
      badge: `${familyMembers.length} members`,
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
    },
    {
      id: 'cloud-arch',
      label: 'AWS Cloud Architecture',
      icon: CloudCog,
      badge: 'EC2 • S3 • RDS',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Life Management Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-400'
                      : item.highlight
                      ? 'text-cyan-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-mono border whitespace-nowrap ${
                    item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloud Security Banner at bottom of sidebar */}
      <div className="p-3.5 m-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero-Knowledge Vault</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          AES-256 encrypted storage on Amazon S3 with AWS KMS customer-managed keys.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PostgreSQL Multi-AZ
          </span>
          <span className="font-mono text-cyan-400 font-semibold">RDS Active</span>
        </div>
      </div>
    </aside>
  );
};
