import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Calendar,
  Phone,
  ExternalLink,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Search,
  Building,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { WarrantyItem } from '../../types';

interface WarrantiesViewProps {
  onOpenAddWarranty: () => void;
}

export const WarrantiesView: React.FC<WarrantiesViewProps> = ({ onOpenAddWarranty }) => {
  const { warranties, deleteWarranty, addToast } = useWallet();

  const [searchFilter, setSearchFilter] = useState('');

  const filteredWarranties = warranties.filter(
    (w) =>
      !searchFilter ||
      w.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (w.serialNumber && w.serialNumber.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleDelete = (w: WarrantyItem) => {
    if (confirm(`Remove warranty record for "${w.productName}"?`)) {
      deleteWarranty(w.id);
    }
  };

  const handleClaimGuide = (w: WarrantyItem) => {
    addToast({
      title: 'Warranty Claim Information',
      description: `Support Helpline: ${w.supportPhone || '1800-425-5555'}. Keep invoice and serial ${w.serialNumber || 'N/A'} ready.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Appliance & Device Warranties</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Claim Protection
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track serial numbers, purchase dates, coverage expiry & customer support helplines.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddWarranty}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-600/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Warranty</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search products, brands, serial numbers..."
          className="w-full bg-slate-900 border border-slate-800/90 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Warranties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWarranties.map((w) => {
          const daysLeft = Math.ceil(
            (new Date(w.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const isExpired = daysLeft < 0;

          return (
            <div
              key={w.id}
              className="bg-slate-900 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                      {w.brand}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{w.category}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(w)}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {w.productName}
                </h3>

                {w.serialNumber && (
                  <div className="mt-2.5 p-2 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between font-mono text-xs text-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold">SERIAL #</span>
                    <span className="font-semibold text-cyan-300">{w.serialNumber}</span>
                  </div>
                )}

                <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs space-y-1.5 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Warranty Until:</span>
                    </span>
                    <span
                      className={`font-semibold font-mono ${
                        isExpired
                          ? 'text-rose-400'
                          : daysLeft <= 30
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {w.expiryDate} {isExpired ? '(Expired)' : `(${daysLeft}d)`}
                    </span>
                  </div>

                  {w.purchasePrice !== undefined && w.purchasePrice !== null && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-900">
                      <span>Purchase Value:</span>
                      <span className="font-mono text-slate-200 font-semibold">₹{(Number(w.purchasePrice) || 0).toLocaleString()}</span>
                    </div>
                  )}

                  {w.supportPhone && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-900">
                      <span>Support Line:</span>
                      <span className="font-mono text-cyan-300 font-semibold">{w.supportPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleClaimGuide(w)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Claim / Support</span>
                </button>

                {w.retailer && (
                  <span className="text-[11px] text-slate-400 font-medium">{w.retailer}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
