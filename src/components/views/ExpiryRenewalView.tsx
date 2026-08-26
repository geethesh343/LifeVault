import React, { useState } from 'react';
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  FileText,
  CreditCard,
  Receipt,
  ShieldCheck,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const ExpiryRenewalView: React.FC = () => {
  const {
    getExpiringSoonItems,
    documents,
    subscriptions,
    bills,
    warranties,
    setActiveTab,
    setSelectedDocForView,
    addToast,
  } = useWallet();

  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const allExpiring = getExpiringSoonItems();

  const filteredItems = allExpiring.filter((item) => {
    const matchesUrgency =
      urgencyFilter === 'all' ||
      (urgencyFilter === 'urgent' && (item.urgency === 'critical' || item.urgency === 'high')) ||
      item.urgency === urgencyFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesUrgency && matchesType;
  });

  const handleNavigate = (type: string, id: string) => {
    if (type === 'document') {
      const doc = documents.find((d) => d.id === id);
      if (doc) setSelectedDocForView(doc);
      setActiveTab('documents');
    } else if (type === 'subscription') {
      setActiveTab('subscriptions');
    } else if (type === 'bill') {
      setActiveTab('bills');
    } else if (type === 'warranty') {
      setActiveTab('warranties');
    }
  };

  const handleSetQuickReminder = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    addToast({
      title: 'Reminder Scheduled',
      description: `Push & email notification set for "${item.title}" before ${item.dueDate}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Life Expiry & Renewal Radar</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                Automated Alerts
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidated radar for Indian Passports, Vehicle RC, Insurance Policies, Warranties & Subscriptions.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800/90 p-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'urgent', 'critical', 'high', 'medium'].map((u) => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              className={`px-3.5 py-1.5 rounded-xl text-xs capitalize transition-all whitespace-nowrap shadow-xs font-semibold ${
                urgencyFilter === u
                  ? 'bg-rose-600 text-white shadow-rose-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {u === 'urgent' ? '🚨 Urgent (<15d)' : u}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'document', 'subscription', 'bill', 'warranty'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all font-semibold ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-transparent hover:border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Expiry Timeline / List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-12 text-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white tracking-tight">All Records Up to Date</h3>
            <p className="text-xs text-slate-400 mt-1">
              No matching upcoming expiries or renewal deadlines under this filter.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            let Icon = FileText;
            let typeColor = 'text-indigo-400';
            if (item.type === 'subscription') {
              Icon = CreditCard;
              typeColor = 'text-purple-400';
            } else if (item.type === 'bill') {
              Icon = Receipt;
              typeColor = 'text-emerald-400';
            } else if (item.type === 'warranty') {
              Icon = ShieldCheck;
              typeColor = 'text-cyan-400';
            }

            const isExpired = item.daysLeft < 0;
            const isDueToday = item.daysLeft === 0;

            return (
              <div
                key={item.id}
                onClick={() => handleNavigate(item.type, item.id)}
                className="bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`p-3 rounded-2xl border shrink-0 ${
                      item.urgency === 'critical' || item.urgency === 'high'
                        ? 'bg-rose-950/40 border-rose-800 text-rose-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                        {item.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-950 text-slate-300 border border-slate-800 capitalize shrink-0">
                        {item.type}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: <strong className="text-slate-200 font-mono">{item.dueDate}</strong></span>
                      </span>
                      <span>•</span>
                      <span>Category: <strong className="text-slate-200 capitalize">{item.category}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right side status badge and reminder button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono tracking-tight ${
                      isExpired
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : isDueToday
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse'
                        : item.daysLeft <= 7
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                        : item.daysLeft <= 30
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                        : 'bg-slate-950 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isExpired
                      ? 'EXPIRED'
                      : isDueToday
                      ? 'DUE TODAY'
                      : `${item.daysLeft} DAYS LEFT`}
                  </span>

                  <button
                    onClick={(e) => handleSetQuickReminder(e, item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs border border-slate-700/80"
                  >
                    <Bell className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Set Alert</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
