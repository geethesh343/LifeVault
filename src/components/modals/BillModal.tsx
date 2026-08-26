import React, { useState } from 'react';
import { X, Receipt, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { BillType } from '../../types';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillModal: React.FC<BillModalProps> = ({ isOpen, onClose }) => {
  const { addBill } = useWallet();

  const [title, setTitle] = useState('');
  const [biller, setBiller] = useState('');
  const [billType, setBillType] = useState<BillType>('electricity');
  const [amount, setAmount] = useState<number>(2450);
  const [dueDate, setDueDate] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('Aug 2026');
  const [autoPay, setAutoPay] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addBill({
      title,
      biller: biller || title,
      billType,
      amount: Number(amount),
      currency: 'INR',
      dueDate: dueDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingPeriod: billingPeriod || 'Current Month',
      isPaid: false,
      autoPay,
      remindersSet: true,
      invoiceNumber: invoiceNumber || undefined,
      category: 'Utilities',
      notes: notes || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Add Bill / Invoice</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Track payment deadlines, utilities & statements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bill Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. BESCOM Electricity Bill / ACT Fiber"
              className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Biller / Authority</label>
              <input
                type="text"
                value={biller}
                onChange={(e) => setBiller(e.target.value)}
                placeholder="e.g. BESCOM / Airtel / HDFC Bank"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bill Type</label>
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value as BillType)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-inner font-medium"
              >
                <option value="electricity">Electricity</option>
                <option value="internet">Internet / Broadband</option>
                <option value="water">Water Supply</option>
                <option value="gas">Piped Gas / LPG</option>
                <option value="mobile">Mobile Postpaid</option>
                <option value="credit_card">Credit Card Statement</option>
                <option value="maintenance">Society Maintenance</option>
                <option value="insurance_premium">Insurance Premium</option>
                <option value="rent">House Rent</option>
                <option value="other">Other Bill</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Due (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold transition-colors shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-medium transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Period / Consumer ID</label>
              <input
                type="text"
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value)}
                placeholder="e.g. Aug 2026 or ID: 94819"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice / Reference No.</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2026-088"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono transition-colors shadow-inner font-medium"
              />
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPay}
                onChange={(e) => setAutoPay(e.target.checked)}
                className="rounded-lg border-slate-700 text-emerald-600 focus:ring-0"
              />
              <span>AutoPay Registered on Bank Portal</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all active:scale-95"
              >
                Save Bill
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
