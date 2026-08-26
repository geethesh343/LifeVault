import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  TrendingUp,
  Calendar,
  ExternalLink,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  PieChart as PieIcon,
  Search,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { SubscriptionItem } from '../../types';

interface SubscriptionsViewProps {
  onOpenAddSub: () => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ onOpenAddSub }) => {
  const {
    subscriptions,
    deleteSubscription,
    monthlySubscriptionTotal,
    annualSubscriptionTotal,
    addToast,
  } = useWallet();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredSubs = subscriptions.filter((sub) => {
    const matchesCat = filterCategory === 'all' || sub.category === filterCategory;
    const matchesSearch =
      !searchFilter ||
      sub.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sub.service.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDelete = (sub: SubscriptionItem) => {
    if (confirm(`Remove subscription "${sub.name}"?`)) {
      deleteSubscription(sub.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Subscription & Recurring Outflows</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Auto-Renewal Alerts
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track renewal dates, plan costs, cancellation links, and optimize your monthly burn.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddSub}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Monthly Burn</div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono">
            ₹{(monthlySubscriptionTotal ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Across {subscriptions.length} active recurring plans
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Estimated Annual Cost</div>
          <div className="mt-2 text-2xl font-extrabold text-cyan-400 font-mono">
            ₹{(annualSubscriptionTotal ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Projected 12-month outflow</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Subscription Optimizer</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
            Consolidating Amazon Prime and Netflix into annual billing could save you ~₹1,800/yr.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search subscriptions, plans..."
            className="w-full bg-slate-900 border border-slate-800/90 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'entertainment', 'cloud', 'productivity', 'fitness'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs capitalize transition-all whitespace-nowrap shadow-xs ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800/90'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubs.map((sub) => {
          const daysLeft = Math.ceil(
            (new Date(sub.nextRenewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={sub.id}
              className="bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 capitalize">
                      {sub.category}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                      {sub.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium">{sub.plan}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-white font-mono">
                      ₹{(Number(sub.amount) || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">/ {sub.billingCycle}</div>
                  </div>
                </div>

                {/* Renewal Date & Payment Method */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Next Renewal:</span>
                    </span>
                    <span
                      className={`font-semibold font-mono ${
                        daysLeft <= 7 ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {sub.nextRenewalDate} ({daysLeft}d)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-900">
                    <span className="font-medium">Payment:</span>
                    <span className="text-slate-300 truncate max-w-[150px] font-medium">{sub.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {sub.websiteUrl ? (
                  <a
                    href={sub.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Manage / Cancel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Auto-renews</span>
                )}

                <button
                  onClick={() => handleDelete(sub)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                  title="Delete Subscription"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
