import React, { useState } from 'react';
import { X, Users, Shield, Mail, Phone, Heart } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({ isOpen, onClose }) => {
  const { addFamilyMember } = useWallet();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [accessLevel, setAccessLevel] = useState<'manager' | 'viewer' | 'emergency_only'>('viewer');
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    ];

    addFamilyMember({
      name,
      relationship,
      email,
      phoneNumber,
      accessLevel,
      accessibleDocumentIds: [],
      isEmergencyContact,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Add Family Circle Member</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Grant secure, granular document access to loved ones</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              >
                <option value="Spouse">Spouse / Partner</option>
                <option value="Child">Child (Son / Daughter)</option>
                <option value="Parent">Parent (Father / Mother)</option>
                <option value="Sibling">Sibling (Brother / Sister)</option>
                <option value="Guardian">Legal Guardian / Trustee</option>
                <option value="Other">Other Family Member</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Access Level</label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              >
                <option value="viewer">Viewer (Can view shared docs only)</option>
                <option value="manager">Manager (Can upload & view docs)</option>
                <option value="emergency_only">Emergency Contact (Unlocked on SOS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya.sharma@gmail.com"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergencyContact}
                onChange={(e) => setIsEmergencyContact(e.target.checked)}
                className="rounded-lg border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="flex items-center gap-1.5 text-slate-300">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Designate as Emergency Medical & Life Contact
              </span>
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
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-95"
              >
                Invite to Circle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
