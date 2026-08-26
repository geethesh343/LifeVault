import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  Download,
  Share2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Tag,
  Building,
  HardDrive,
  Users,
  Trash2,
  Edit,
  ExternalLink,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { DocumentItem } from '../../types';

export const DocumentDetailModal: React.FC = () => {
  const {
    selectedDocForView,
    setSelectedDocForView,
    deleteDocument,
    familyMembers,
    shareDocumentWithFamily,
    addToast,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'family' | 'ai'>('preview');
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<string[]>(
    selectedDocForView?.familySharedWith || []
  );

  if (!selectedDocForView) return null;
  const doc = selectedDocForView;

  const handleSaveFamilySharing = () => {
    shareDocumentWithFamily(doc.id, selectedFamilyMembers);
    setSelectedDocForView({ ...doc, familySharedWith: selectedFamilyMembers });
  };

  const handleSimulateDownload = () => {
    addToast({
      title: 'Document Decrypted & Downloaded',
      description: `Retrieved "${doc.title}" securely from Amazon S3 (ap-south-1).`,
      type: 'success',
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${doc.title}" from your AWS S3 vault?`)) {
      deleteDocument(doc.id);
      setSelectedDocForView(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0 shadow-xs">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">{doc.title}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  AES-256 KMS
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-medium">
                <span className="capitalize">{doc.category}</span>
                <span>•</span>
                <span>{doc.issuer}</span>
                <span>•</span>
                <span className="font-mono text-cyan-400">{doc.fileSize}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateDownload}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDocForView(null)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-800/90 bg-slate-950/50 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Smart Card
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Intelligence & OCR
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'metadata'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AWS S3 Cloud Metadata
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'family'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Family Access ({doc.familySharedWith.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: VISUAL CARD PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Document Identity Rendering Box */}
              <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 border border-slate-800/90 shadow-xl overflow-hidden">
                {/* Background holographic watermark */}
                <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold tracking-widest text-cyan-400 uppercase">
                        {doc.issuer}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        OFFICIAL VERIFIED
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">{doc.title}</h3>
                    {doc.documentNumber && (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 font-bold shadow-inner">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{doc.documentNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <div className="text-[11px] text-slate-400 font-medium">Status</div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active & Encrypted</span>
                    </div>
                    {doc.expiryDate && (
                      <div className="mt-2.5 text-xs">
                        <div className="text-[10px] text-slate-400 font-medium">Valid Until</div>
                        <div className="font-bold text-slate-200 font-mono">{doc.expiryDate}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Fields Grid */}
                {doc.aiExtractedFields && Object.keys(doc.aiExtractedFields).length > 0 ? (
                  <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(doc.aiExtractedFields).map(([key, val]) => (
                      <div key={key} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/90 shadow-xs">
                        <span className="text-[10px] font-medium text-slate-400 block">{key}</span>
                        <span className="font-semibold text-slate-200 font-mono">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 block">Category</span>
                      <span className="font-bold text-slate-200 capitalize">{doc.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 block">Issue Date</span>
                      <span className="font-bold text-slate-200 font-mono">{doc.issueDate || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 block">Encryption</span>
                      <span className="font-bold text-emerald-400">AES-256 KMS</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 block">Cloud Bucket</span>
                      <span className="font-mono text-[11px] text-slate-300 font-medium">Amazon S3</span>
                    </div>
                  </div>
                )}

                {/* Tags & Security Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SHA256: 8f49e0...92b4</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {doc.notes && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs space-y-1 shadow-xs">
                  <div className="font-bold text-slate-300">User & System Notes:</div>
                  <p className="text-slate-400 leading-relaxed font-medium">{doc.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI INTELLIGENCE & OCR */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-b from-cyan-950/30 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Gemini 3.7 Document Analysis & Executive Summary</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {doc.aiSummary ||
                    'AI OCR scanned and cataloged this document. Verified authenticity against state identification registry.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Extracted Identity / Policy Key-Value Map
                </h4>
                <div className="bg-slate-950/90 rounded-xl border border-slate-800/90 divide-y divide-slate-850 shadow-xs">
                  {doc.aiExtractedFields && Object.keys(doc.aiExtractedFields).length > 0 ? (
                    Object.entries(doc.aiExtractedFields).map(([k, v]) => (
                      <div key={k} className="p-3.5 flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">{k}</span>
                        <span className="font-mono font-semibold text-slate-100">{v}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      Standard metadata extracted. Custom key-value pairs auto-populate during OCR upload.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AWS S3 CLOUD METADATA */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Amazon S3 Object Key</span>
                  <span className="font-mono text-cyan-300 break-all font-semibold">{doc.s3Key}</span>
                </div>
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">AWS S3 Bucket</span>
                  <span className="font-mono text-slate-200 font-semibold">{doc.s3Bucket}</span>
                </div>
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Server-Side Encryption</span>
                  <span className="font-mono text-emerald-400 font-semibold">aws:kms (SSE-KMS AES-256)</span>
                </div>
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Storage Class & Region</span>
                  <span className="font-mono text-slate-200 font-semibold">S3 Standard • ap-south-1 (Mumbai)</span>
                </div>
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">File Size & MIME</span>
                  <span className="font-mono text-slate-200 font-semibold">{doc.fileSize} • {doc.mimeType}</span>
                </div>
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 space-y-1 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Created & Stored At</span>
                  <span className="font-mono text-slate-200 font-semibold">{doc.createdAt}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAMILY ACCESS CONTROL */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs space-y-1 shadow-xs">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Granular Document Sharing</span>
                </div>
                <p className="text-slate-300 font-medium">
                  Grant selected family members direct viewing or emergency access to this document without sharing your entire life wallet.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Family Members:</div>
                <div className="space-y-2">
                  {familyMembers.map((member) => {
                    const isShared = selectedFamilyMembers.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => {
                          if (isShared) {
                            setSelectedFamilyMembers(selectedFamilyMembers.filter((id) => id !== member.id));
                          } else {
                            setSelectedFamilyMembers([...selectedFamilyMembers, member.id]);
                          }
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isShared
                            ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-xs ring-1 ring-indigo-500/30'
                            : 'bg-slate-950 border-slate-800/90 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
                          />
                          <div>
                            <div className="font-semibold text-xs text-white">{member.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {member.relationship} • {member.accessLevel}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isShared ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Shared
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-700 text-[11px] font-medium">
                              Not Shared
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSaveFamilySharing}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-95"
                  >
                    Save Sharing Permissions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
