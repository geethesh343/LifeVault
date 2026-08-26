import React, { useState } from 'react';
import { X, ShieldCheck, Calendar, Tag, HardDrive } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose }) => {
  const { addWarranty } = useWallet();

  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyMonths, setWarrantyMonths] = useState(24);
  const [purchasePrice, setPurchasePrice] = useState<number>(45000);
  const [retailer, setRetailer] = useState('Amazon.in');
  const [supportWebsite, setSupportWebsite] = useState('');
  const [supportPhone, setSupportPhone] = useState('1800-108-8888');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const pDate = new Date(purchaseDate);
    const expDate = new Date(pDate);
    expDate.setMonth(expDate.getMonth() + Number(warrantyMonths));
    const expiryDateStr = expDate.toISOString().split('T')[0];

    addWarranty({
      productName,
      brand: brand || 'Brand',
      modelNumber: modelNumber || undefined,
      serialNumber: serialNumber || undefined,
      category,
      purchaseDate,
      warrantyPeriodMonths: Number(warrantyMonths),
      expiryDate: expiryDateStr,
      purchasePrice: Number(purchasePrice) || undefined,
      currency: 'INR',
      retailer: retailer || undefined,
      supportWebsite: supportWebsite || undefined,
      supportPhone: supportPhone || undefined,
      coverageDetails: 'Standard Manufacturer Warranty',
      status: 'active',
      notes: notes || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Add Product Warranty</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Track appliance guarantees, claims & support contacts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Apple MacBook Pro 16-inch M3 Max"
              className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Sony, LG, Samsung"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-medium"
              >
                <option value="Electronics">Electronics & Laptops</option>
                <option value="Home Appliances">Home Appliances (AC, Fridge, TV)</option>
                <option value="Automobile">Automobile Parts</option>
                <option value="Mobile">Smartphones & Tablets</option>
                <option value="Wearables">Watches & Wearables</option>
                <option value="Furniture">Furniture & Fittings</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02G7898MD6T"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model Number</label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. A2485 / MYD82HN/A"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Purchase Date *</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Months) *</label>
              <input
                type="number"
                required
                min={1}
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price Paid (₹)</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono font-semibold transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Retailer / Store</label>
              <input
                type="text"
                value={retailer}
                onChange={(e) => setRetailer(e.target.value)}
                placeholder="e.g. Croma, Reliance Digital, Apple"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Support Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="e.g. 1800-425-5555"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors shadow-inner font-medium"
              />
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-800/80 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-600/25 transition-all active:scale-95"
            >
              Save Warranty Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
