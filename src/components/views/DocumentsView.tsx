import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Filter,
  Upload,
  FileText,
  Lock,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Grid,
  List,
  Eye,
  Shield,
  Tag,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { DocumentCategory, DocumentItem } from '../../types';

interface DocumentsViewProps {
  onOpenUpload: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onOpenUpload }) => {
  const {
    documents,
    setSelectedDocForView,
    deleteDocument,
    familyMembers,
    addToast,
  } = useWallet();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories: Array<{ id: string; label: string; count: number }> = [
    { id: 'all', label: 'All Documents', count: documents.length },
    {
      id: 'identity',
      label: 'Identity & KYC',
      count: documents.filter((d) => d.category === 'identity').length,
    },
    {
      id: 'insurance',
      label: 'Insurance Policies',
      count: documents.filter((d) => d.category === 'insurance').length,
    },
    {
      id: 'education',
      label: 'Education & Degrees',
      count: documents.filter((d) => d.category === 'education').length,
    },
    {
      id: 'warranty',
      label: 'Warranties & Invoices',
      count: documents.filter((d) => d.category === 'warranty').length,
    },
    {
      id: 'vehicle',
      label: 'Vehicle & Transport',
      count: documents.filter((d) => d.category === 'vehicle').length,
    },
    {
      id: 'property',
      label: 'Property & Housing',
      count: documents.filter((d) => d.category === 'property').length,
    },
    {
      id: 'medical',
      label: 'Medical Records',
      count: documents.filter((d) => d.category === 'medical').length,
    },
    {
      id: 'financial',
      label: 'Financial & Tax',
      count: documents.filter((d) => d.category === 'financial').length,
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      !searchFilter ||
      doc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (doc.documentNumber &&
        doc.documentNumber.toLowerCase().includes(searchFilter.toLowerCase())) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSimulateDownload = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    addToast({
      title: 'Decrypted & Downloaded',
      description: `Retrieved ${doc.title} from Amazon S3 vault securely.`,
      type: 'success',
    });
  };

  const handleDelete = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    if (confirm(`Remove "${doc.title}" from your Amazon S3 vault?`)) {
      deleteDocument(doc.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <FolderLock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>Personal Digital Document Vault</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                AES-256 S3
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely store Aadhaar, PAN, Passport, Certificates, Policies & Invoices with AI OCR.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Category Pills & Search Toolbar */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/90'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-semibold ${
                    isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & View Mode Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by title, ID number, issuer, tag..."
              className="w-full bg-slate-900 border border-slate-800/90 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredDocuments.length}</span> documents
            </span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid / Table */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white tracking-tight">No documents found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No matching digital records in this category. Upload a document or clear search filters.
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            Upload Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const sharedMembers = familyMembers.filter((m) =>
              doc.familySharedWith.includes(m.id)
            );

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForView(doc)}
                className="bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md relative overflow-hidden"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 capitalize">
                        {doc.category}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-semibold bg-slate-950 text-emerald-400 border border-slate-800">
                        AES-256
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleSimulateDownload(e, doc)}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, doc)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>

                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.issuer}</span>
                  </div>

                  {/* ID / Masked Number Box */}
                  {doc.documentNumber && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between font-mono text-xs text-slate-200">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Doc #</span>
                      <span className="font-semibold text-cyan-300">{doc.documentNumber}</span>
                    </div>
                  )}

                  {/* AI Summary snippet */}
                  {doc.aiSummary && (
                    <div className="mt-3 text-[11px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-indigo-400 font-semibold">AI: </span>
                      {doc.aiSummary}
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    {doc.expiryDate ? (
                      <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Expires: {doc.expiryDate}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono font-medium">{doc.fileSize}</span>
                    )}
                  </div>

                  {/* Shared with avatars */}
                  {sharedMembers.length > 0 && (
                    <div className="flex items-center -space-x-1.5" title="Shared with family members">
                      {sharedMembers.map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="w-5 h-5 rounded-full object-cover ring-2 ring-slate-900"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Doc / ID Number</th>
                <th className="p-4">Issuer</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">S3 Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDocForView(doc)}
                  className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                >
                  <td className="p-4 font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{doc.title}</span>
                  </td>
                  <td className="p-4 capitalize text-slate-300 font-medium">{doc.category}</td>
                  <td className="p-4 font-mono text-cyan-300 font-semibold">{doc.documentNumber || '—'}</td>
                  <td className="p-4 text-slate-300">{doc.issuer}</td>
                  <td className="p-4 text-slate-300 font-mono">{doc.expiryDate || 'No Expiry'}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      AES-256
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => handleSimulateDownload(e, doc)}
                      className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg mr-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, doc)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
