import React from 'react';
import {
  ShieldCheck,
  FolderLock,
  CreditCard,
  CalendarClock,
  Sparkles,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  KeyRound,
  ExternalLink,
  Users,
  ChevronRight,
  Lock,
  Cloud,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface DashboardViewProps {
  onOpenUpload: () => void;
  onOpenAddSub: () => void;
  onOpenAddBill: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenUpload,
  onOpenAddSub,
  onOpenAddBill,
}) => {
  const {
    user,
    documents,
    subscriptions,
    bills,
    warranties,
    reminders,
    familyMembers,
    getExpiringSoonItems,
    monthlySubscriptionTotal,
    annualSubscriptionTotal,
    setActiveTab,
    setSelectedDocForView,
    setIsSearchModalOpen,
    setSearchQuery,
    executeSmartSearch,
    markBillAsPaid,
  } = useWallet();

  const expiringItems = getExpiringSoonItems();
  const criticalCount = expiringItems.filter((i) => i.daysLeft <= 15).length;
  const unpaidBills = bills.filter((b) => !b.isPaid);
  const totalUnpaidAmount = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const quickPrompts = [
    'When does my passport expire?',
    'What is my health policy sum insured?',
    'Show all bills due this week',
    'Calculate monthly subscriptions',
  ];

  const handleAskAI = (prompt: string) => {
    setSearchQuery(prompt);
    setIsSearchModalOpen(true);
    executeSmartSearch(prompt);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Welcome & AI Quick Prompt Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Life Management Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Your digital identity, insurance policies, active subscriptions, and zero-knowledge credentials are safe in your AES-256 cloud vault.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-search')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 font-semibold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Life Assistant</span>
            </button>
          </div>
        </div>

        {/* AI Quick Prompts Pills */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Instant Life Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAskAI(q)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 group shadow-xs"
              >
                <span>{q}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Verified Documents */}
        <div
          onClick={() => setActiveTab('documents')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Digital Documents</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{documents.length}</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% Encrypted
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Aadhaar, PAN, Passport & Policies</p>
        </div>

        {/* Metric 2: Monthly Outflow */}
        <div
          onClick={() => setActiveTab('subscriptions')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-purple-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monthly Subscriptions</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{(monthlySubscriptionTotal ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">/ mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {subscriptions.length} active recurring services
          </p>
        </div>

        {/* Metric 3: Urgent Expiries */}
        <div
          onClick={() => setActiveTab('expiries')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-rose-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Upcoming Expiries</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{expiringItems.length}</span>
            {criticalCount > 0 && (
              <span className="text-[11px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 animate-pulse">
                {criticalCount} Urgent
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Due within next 30 days</p>
        </div>

        {/* Metric 4: Bills Due */}
        <div
          onClick={() => setActiveTab('bills')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Unpaid Bills</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{(totalUnpaidAmount ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">({unpaidBills.length} pending)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Electricity, Broadband & Dues</p>
        </div>
      </div>

      {/* Main Grid: Expiry Radar & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Expiry & Renewal Radar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expiry Radar Card */}
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Expiry & Renewal Radar
                  </h2>
                  <p className="text-[11px] text-slate-400">Proactive tracking for licenses, policies, and subscriptions</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('expiries')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>View Timeline</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/70">
              {expiringItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  All documents, warranties, and subscriptions are fully up to date!
                </div>
              ) : (
                expiringItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-800/40 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                    onClick={() => {
                      if (item.type === 'document') setActiveTab('documents');
                      else if (item.type === 'subscription') setActiveTab('subscriptions');
                      else if (item.type === 'bill') setActiveTab('bills');
                      else if (item.type === 'warranty') setActiveTab('warranties');
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl border shrink-0 ${
                          item.urgency === 'critical' || item.urgency === 'high'
                            ? 'bg-rose-950/40 border-rose-800/80 text-rose-400'
                            : 'bg-amber-950/40 border-amber-800/80 text-amber-400'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 truncate">{item.title}</div>
                        <div className="text-[11px] text-slate-400 capitalize mt-0.5 flex items-center gap-2">
                          <span className="font-medium text-slate-400">{item.type}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">Due: {item.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold tracking-tight ${
                          item.daysLeft < 0
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : item.daysLeft <= 7
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {item.daysLeft < 0
                          ? 'EXPIRED'
                          : item.daysLeft === 0
                          ? 'TODAY'
                          : `${item.daysLeft} DAYS LEFT`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Verified Documents */}
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FolderLock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Recent Verified Documents
                  </h2>
                  <p className="text-[11px] text-slate-400">Encrypted on AWS S3 with AES-256 KMS key</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>All Documents ({documents.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocForView(doc);
                  }}
                  className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-xs text-white group-hover:text-cyan-300 truncate">
                      {doc.title}
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-semibold bg-indigo-950 text-indigo-300 rounded border border-indigo-800 shrink-0">
                      AES-256
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between font-medium">
                    <span className="capitalize text-slate-300">{doc.category}</span>
                    <span className="font-mono text-slate-400">{doc.fileSize}</span>
                  </div>
                  {doc.documentNumber && (
                    <div className="mt-2.5 text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 truncate">
                      {doc.documentNumber}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Unpaid Bills Quick Pay & Family Circle Snapshot */}
        <div className="space-y-6">
          {/* Unpaid Bills Quick Pay */}
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight">Pending Bills</h2>
              </div>
              <button
                onClick={onOpenAddBill}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                + Add Bill
              </button>
            </div>

            <div className="space-y-2.5">
              {unpaidBills.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1 opacity-80" />
                  No pending bills. Great job!
                </div>
              ) : (
                unpaidBills.slice(0, 3).map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100 truncate">{bill.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Due: {bill.dueDate}</div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div className="font-bold text-slate-100 font-mono">₹{bill.amount}</div>
                      <button
                        onClick={() => markBillAsPaid(bill.id)}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-lg text-[10px] font-bold transition-all shadow-xs"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Family Circle Snapshot Card */}
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight">Family Circle</h2>
              </div>
              <button
                onClick={() => setActiveTab('family')}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Manage
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Family members with selective access to health policies, emergency contacts, and warranties.
            </p>

            <div className="space-y-2">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 truncate">{member.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{member.relationship}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 capitalize shrink-0">
                    {member.accessLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AWS Cloud Architecture Quick Telemetry */}
          <div
            onClick={() => setActiveTab('cloud-arch')}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Cloud className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>AWS Cloud Infrastructure</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Healthy
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Powered by Amazon EC2, S3 Vault (SSE-KMS), Amazon RDS PostgreSQL & AWS CloudWatch telemetry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
