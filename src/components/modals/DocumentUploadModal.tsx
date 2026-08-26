import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Shield,
  FileText,
  Calendar,
  Tag,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { DocumentCategory } from '../../types';

export const DocumentUploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    addDocument,
    familyMembers,
    analyzeDocumentWithAI,
  } = useWallet();

  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.8 MB');
  const [mimeType, setMimeType] = useState('application/pdf');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('identity');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  if (!isUploadModalOpen) return null;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    setMimeType(file.type || 'application/pdf');
    setIsAnalyzing(true);

    const result = await analyzeDocumentWithAI({
      fileName: file.name,
      fileType: file.type,
      categoryHint: category,
    });

    setIsAnalyzing(false);
    if (result) {
      setAiAnalysisResult(result);
      if (result.title) setTitle(result.title);
      if (result.category) setCategory(result.category);
      if (result.documentNumber) setDocumentNumber(result.documentNumber);
      if (result.issuer) setIssuer(result.issuer);
      if (result.issueDate) setIssueDate(result.issueDate);
      if (result.expiryDate) setExpiryDate(result.expiryDate);
      if (result.tags) setTagsInput(result.tags.join(', '));
      if (result.summary) setNotes(result.summary);
    }
  };

  const handlePresetSample = (type: string) => {
    let mockFileName = 'passport_front_scan.pdf';
    if (type === 'aadhaar') mockFileName = 'uidai_eaadhaar_masked.pdf';
    else if (type === 'pan') mockFileName = 'pan_card_permanent_id.jpg';
    else if (type === 'health') mockFileName = 'star_health_insurance_policy.pdf';
    else if (type === 'degree') mockFileName = 'university_degree_convocation.pdf';
    else if (type === 'car') mockFileName = 'vehicle_rc_smart_card.pdf';

    setFileName(mockFileName);
    processFile(new File(['mock content'], mockFileName, { type: 'application/pdf' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    addDocument({
      title,
      category,
      documentNumber: documentNumber || undefined,
      issuer: issuer || 'Verified Authority',
      issueDate: issueDate || undefined,
      expiryDate: expiryDate || undefined,
      tags: tags.length > 0 ? tags : ['personal', 'vault'],
      s3Key: `vault/${category}/${fileName ? fileName.replace(/\s+/g, '_') : 'document_' + Date.now()}.enc`,
      s3Bucket: 'ai-life-management-vault-ap-south-1',
      fileSize: fileSize || '1.5 MB',
      mimeType: mimeType || 'application/pdf',
      isEncrypted: true,
      notes: notes || undefined,
      familySharedWith: selectedFamily,
      aiSummary: aiAnalysisResult?.summary,
      aiExtractedFields: aiAnalysisResult?.keyFields,
      status: 'verified',
    });

    setIsUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Upload Digital Document</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                AES-256 cloud encryption with Amazon S3 & AI field extraction
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 text-center bg-slate-950/60 hover:bg-slate-950 transition-all cursor-pointer group relative shadow-inner"
          >
            <input
              type="file"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 group-hover:bg-indigo-600/20 border border-slate-800 group-hover:border-indigo-500/40 flex items-center justify-center mb-2 transition-colors shadow-xs">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                {fileName ? (
                  <span className="text-cyan-400 font-semibold">{fileName} ({fileSize})</span>
                ) : (
                  'Drag and drop files here or browse from device'
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Supports PDF, Aadhaar/PAN Scans, JPG, PNG, Invoices up to 50MB
              </p>
            </div>
          </div>

          {/* Quick Preset Samples */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between uppercase tracking-wider">
              <span>Quick Sample Presets (for instant testing):</span>
              {isAnalyzing && (
                <span className="text-cyan-400 text-[11px] flex items-center gap-1 font-mono font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Analyzing...
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetSample('passport')}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800/90 rounded-xl text-slate-300 font-medium transition-colors shadow-xs"
              >
                🇮🇳 Indian Passport
              </button>
              <button
                type="button"
                onClick={() => handlePresetSample('aadhaar')}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800/90 rounded-xl text-slate-300 font-medium transition-colors shadow-xs"
              >
                🪪 Aadhaar Card
              </button>
              <button
                type="button"
                onClick={() => handlePresetSample('pan')}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800/90 rounded-xl text-slate-300 font-medium transition-colors shadow-xs"
              >
                💳 PAN Card
              </button>
              <button
                type="button"
                onClick={() => handlePresetSample('health')}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800/90 rounded-xl text-slate-300 font-medium transition-colors shadow-xs"
              >
                🏥 Health Policy
              </button>
              <button
                type="button"
                onClick={() => handlePresetSample('car')}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800/90 rounded-xl text-slate-300 font-medium transition-colors shadow-xs"
              >
                🚗 Vehicle RC
              </button>
            </div>
          </div>

          {/* AI Extraction Banner if active */}
          {aiAnalysisResult && (
            <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Auto-Extracted Metadata</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                {aiAnalysisResult.summary}
              </p>
            </div>
          )}

          {/* Document Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Indian Passport / HDFC Health Policy"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              >
                <option value="identity">Identity (Aadhaar / PAN / Passport)</option>
                <option value="insurance">Insurance Policy</option>
                <option value="education">Education & Degrees</option>
                <option value="warranty">Warranty & Invoices</option>
                <option value="vehicle">Vehicle & Driving License</option>
                <option value="property">Property & Real Estate</option>
                <option value="medical">Medical & Health Records</option>
                <option value="financial">Financial & Tax Records</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document / Policy / Id Number</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. T7482910 or XXXX-XXXX-9428"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Authority / Company</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. MEA India / UIDAI / Star Health"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry / Renewal Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Search Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="passport, travel, kyc, identification"
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              />
            </div>

            {/* Family Access Control */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Grant Family Access
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Select family circle members</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {familyMembers.map((member) => {
                  const isChecked = selectedFamily.includes(member.id);
                  return (
                    <label
                      key={member.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-xs ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800/90 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFamily([...selectedFamily, member.id]);
                          } else {
                            setSelectedFamily(selectedFamily.filter((id) => id !== member.id));
                          }
                        }}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/30"
                      />
                      <div className="truncate">
                        <div className="font-semibold truncate">{member.name}</div>
                        <div className="text-[10px] text-slate-400">{member.relationship}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 Encrypted on Amazon S3</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
