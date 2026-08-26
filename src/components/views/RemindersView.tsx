import React, { useState } from 'react';
import {
  Bell,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  AlertTriangle,
  Check,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { ReminderItem } from '../../types';

interface RemindersViewProps {
  onOpenAddReminder: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ onOpenAddReminder }) => {
  const { reminders, toggleReminderComplete, deleteReminder, addToast } = useWallet();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');

  const filteredReminders = reminders.filter((r) => {
    const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !r.isCompleted) ||
      (filterStatus === 'completed' && r.isCompleted);
    return matchesPriority && matchesStatus;
  });

  const handleDelete = (r: ReminderItem) => {
    if (confirm(`Delete reminder "${r.title}"?`)) {
      deleteReminder(r.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Reminders, Deadlines & Life Alerts</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Push & Email
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Never miss a passport renewal appointment, utility deadline, or insurance payment.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddReminder}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800/90 p-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          {['active', 'completed', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs capitalize transition-all font-semibold shadow-xs ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1.5 rounded-xl text-xs capitalize transition-all font-semibold ${
                filterPriority === p
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-white bg-slate-950/60 border border-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-12 text-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white tracking-tight">No Reminders Found</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              You are all caught up on scheduled reminders and alerts.
            </p>
          </div>
        ) : (
          filteredReminders.map((r) => {
            return (
              <div
                key={r.id}
                className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition-all shadow-sm ${
                  r.isCompleted
                    ? 'border-slate-800/60 opacity-60'
                    : r.priority === 'critical'
                    ? 'border-rose-500/40 hover:border-rose-500/60'
                    : 'border-slate-800/90 hover:border-indigo-500/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleReminderComplete(r.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      r.isCompleted
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-700 hover:border-indigo-500 bg-slate-950'
                    }`}
                  >
                    {r.isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-sm text-white ${
                          r.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {r.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                          r.priority === 'critical'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                            : r.priority === 'high'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {r.priority}
                      </span>
                    </div>

                    {r.description && (
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">{r.description}</p>
                    )}

                    <div className="text-xs text-slate-400 mt-2.5 flex flex-wrap items-center gap-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date: <strong className="text-slate-200 font-mono">{r.dueDate}</strong></span>
                      </span>
                      {r.dueTime && (
                        <span className="flex items-center gap-1 font-mono text-cyan-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.dueTime}</span>
                        </span>
                      )}
                      <span>•</span>
                      <span className="capitalize">{r.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(r)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
