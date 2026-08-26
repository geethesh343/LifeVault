import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  Heart,
  Mail,
  Phone,
  Link as LinkIcon,
  Copy,
  Check,
  CheckCircle2,
  Trash2,
  Lock,
  Share2,
  Clock,
  Eye,
  FileText,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { FamilyMember } from '../../types';

interface FamilyAccessViewProps {
  onOpenAddFamily: () => void;
}

export const FamilyAccessView: React.FC<FamilyAccessViewProps> = ({ onOpenAddFamily }) => {
  const {
    familyMembers,
    documents,
    deleteFamilyMember,
    setSelectedDocForView,
    addToast,
  } = useWallet();

  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    familyMembers[0] || null
  );

  const handleGenerateShareLink = () => {
    const link = `https://lifevault.ai/secure-share/link_${Math.random().toString(36).substring(2, 9)}?pin=9421`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    addToast({
      title: 'Temporary Secure Link Generated',
      description: 'Copied link with PIN protection (Expires in 24 hours).',
      type: 'success',
    });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDeleteMember = (member: FamilyMember) => {
    if (confirm(`Remove "${member.name}" from your Family Access Circle?`)) {
      deleteFamilyMember(member.id);
      if (selectedMember?.id === member.id) {
        setSelectedMember(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Family Access Circle & Granular Sharing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Zero-Leak Protection
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Share health policies, property deeds, or car RC with spouse & parents without exposing passwords.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateShareLink}
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4 text-cyan-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Create Temp Link'}</span>
          </button>

          <button
            onClick={onOpenAddFamily}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Family Members & Selected Member Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Family Members List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Circle Members ({familyMembers.length})
          </div>

          <div className="space-y-2">
            {familyMembers.map((m) => {
              const isSelected = selectedMember?.id === m.id;
              const sharedDocsCount = documents.filter((d) =>
                d.familySharedWith.includes(m.id)
              ).length;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {m.isEmergencyContact && (
                          <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 fill-rose-500/20" title="Emergency Contact" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate font-medium">
                        {m.relationship} • <span className="capitalize">{m.accessLevel}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-slate-800 shrink-0">
                    {sharedDocsCount} Docs
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Member Profile & Assigned Documents */}
        <div className="lg:col-span-2 space-y-5">
          {selectedMember ? (
            <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 space-y-6 shadow-sm">
              {/* Member Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-xs"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{selectedMember.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 capitalize">
                        {selectedMember.relationship}
                      </span>
                    </h2>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedMember.email}</span>
                      </span>
                      {selectedMember.phoneNumber && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{selectedMember.phoneNumber}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMember(selectedMember)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors self-start sm:self-auto"
                  title="Remove from Circle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Emergency Status Banner */}
              {selectedMember.isEmergencyContact && (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center gap-3 text-xs text-slate-300">
                  <Heart className="w-5 h-5 text-rose-400 shrink-0 fill-rose-500/30" />
                  <div>
                    <strong className="text-rose-300 font-bold">Emergency Medical Contact:</strong> In case of an emergency, this contact receives an authenticated bypass link to view your Health Insurance and Blood Group records.
                  </div>
                </div>
              )}

              {/* Shared Documents with this Member */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Accessible Vault Documents ({documents.filter((d) => d.familySharedWith.includes(selectedMember.id)).length})
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Granular zero-leak access enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents
                    .filter((d) => d.familySharedWith.includes(selectedMember.id))
                    .map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocForView(doc)}
                        className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                            {doc.title}
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Shared
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between font-medium">
                          <span className="capitalize">{doc.category}</span>
                          <span className="font-mono">{doc.expiryDate ? `Exp: ${doc.expiryDate}` : doc.fileSize}</span>
                        </div>
                      </div>
                    ))}

                  {documents.filter((d) => d.familySharedWith.includes(selectedMember.id)).length === 0 && (
                    <div className="sm:col-span-2 p-6 rounded-xl bg-slate-950/80 text-center text-xs text-slate-400 border border-slate-800/90">
                      No documents currently shared with {selectedMember.name}. You can grant access from any document's detail view.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-12 text-center text-xs text-slate-400 shadow-sm">
              Select a family member to manage their permissions and shared documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
