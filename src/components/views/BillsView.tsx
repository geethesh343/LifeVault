import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CheckCircle2,
  Calendar,
  DollarSign,
  Trash2,
  Check,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { BillItem } from '../../types';

interface BillsViewProps {
  onOpenAddBill: () => void;
}

export const BillsView: React.FC<BillsViewProps> = ({ onOpenAddBill }) => {
  const { bills, markBillAsPaid, deleteBill, addToast } = useWallet();

  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const unpaidBills = bills.filter((b) => !b.isPaid);
  const paidBills = bills.filter((b) => b.isPaid);

  const totalUnpaid = unpaidBills.reduce((acc, b) => acc + b.amount, 0);
  const totalPaid = paidBills.reduce((acc, b) => acc + b.amount, 0);

  const filteredBills = bills.filter((bill) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unpaid' && !bill.isPaid) ||
      (statusFilter === 'paid' && bill.isPaid);

    const matchesSearch =
      !searchFilter ||
      bill.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      bill.biller.toLowerCase().includes(searchFilter.toLowerCase()) ||
      bill.billType.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleDelete = (bill: BillItem) => {
    if (confirm(`Remove bill "${bill.title}"?`)) {
      deleteBill(bill.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Bills, Invoices & Utility Management</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                AutoPay Tracked
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track BESCOM electricity, broadband, piped gas, society maintenance & credit card dues.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddBill}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bill / Invoice</span>
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Pending Unpaid Dues</div>
          <div className="mt-2 text-2xl font-extrabold text-rose-400 font-mono">
            ₹{(totalUnpaid ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{unpaidBills.length} bills pending payment</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Settled This Month</div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
            ₹{(totalPaid ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{paidBills.length} bills marked paid</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">AutoPay Status</div>
          <div className="mt-2 text-xl font-extrabold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Bank Mandates Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Automatic debit for utility portals</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search bills, biller name, type..."
            className="w-full bg-slate-900 border border-slate-800/90 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Bills' },
            { id: 'unpaid', label: `Pending (${unpaidBills.length})` },
            { id: 'paid', label: `Paid (${paidBills.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                statusFilter === t.id
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800/90'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBills.map((bill) => {
          return (
            <div
              key={bill.id}
              className="bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 capitalize">
                      {bill.billType}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1.5 group-hover:text-emerald-300 transition-colors">
                      {bill.title}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium">{bill.biller}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-white font-mono">
                      ₹{(Number(bill.amount) || 0).toLocaleString()}
                    </div>
                    {bill.billingPeriod && (
                      <div className="text-[10px] text-slate-400 font-medium">{bill.billingPeriod}</div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due Date:</span>
                    </span>
                    <span
                      className={`font-semibold font-mono ${
                        !bill.isPaid ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {bill.dueDate}
                    </span>
                  </div>

                  {bill.invoiceNumber && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-900">
                      <span className="font-medium">Invoice #:</span>
                      <span className="font-mono text-cyan-300 font-semibold">{bill.invoiceNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Controls */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {bill.isPaid ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Paid
                  </span>
                ) : (
                  <button
                    onClick={() => markBillAsPaid(bill.id)}
                    className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Paid</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(bill)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
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
