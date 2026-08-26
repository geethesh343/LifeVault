import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  X,
  FileText,
  CreditCard,
  Receipt,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const SmartSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    searchResult,
    isSearching,
    executeSmartSearch,
    setActiveTab,
    setSelectedDocForView,
    documents,
  } = useWallet();

  const inputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = [
    'When does my passport expire?',
    'What is my health insurance policy number and coverage?',
    'How much do I spend on subscriptions every month?',
    'Show all unpaid utility bills and due dates',
    'Find warranty details for my Apple MacBook Pro',
    'What documents are shared with Priya?',
  ];

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchModalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSmartSearch(searchQuery);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setSearchQuery(prompt);
    executeSmartSearch(prompt);
  };

  const handleNavigateToItem = (type: string, id: string) => {
    setIsSearchModalOpen(false);
    if (type === 'document') {
      const doc = documents.find((d) => d.id === id);
      if (doc) {
        setSelectedDocForView(doc);
      }
      setActiveTab('documents');
    } else if (type === 'subscription') {
      setActiveTab('subscriptions');
    } else if (type === 'bill') {
      setActiveTab('bills');
    } else if (type === 'warranty') {
      setActiveTab('warranties');
    } else if (type === 'password') {
      setActiveTab('passwords');
    }
  };

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900"
        >
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI or search anything in your digital wallet..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 rounded-lg border border-slate-700"
          >
            ESC
          </button>
        </form>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* AI Search Result Card */}
          {searchResult && (
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-800/40 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gemini 3.7 Life Intelligence Answer</span>
              </div>
              <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line font-normal">
                {searchResult.directAnswer}
              </p>

              {searchResult.recommendations && searchResult.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-700/60">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Proactive AI Recommendations:
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-cyan-400">
                    {searchResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Matched Records */}
          {searchResult && searchResult.matchingItems && searchResult.matchingItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Matching Vault Records ({searchResult.matchingItems.length})
              </div>
              <div className="space-y-1.5">
                {searchResult.matchingItems.map((item) => {
                  let Icon = FileText;
                  let colorClass = 'text-blue-400';
                  if (item.type === 'subscription') {
                    Icon = CreditCard;
                    colorClass = 'text-purple-400';
                  } else if (item.type === 'bill') {
                    Icon = Receipt;
                    colorClass = 'text-emerald-400';
                  } else if (item.type === 'warranty') {
                    Icon = ShieldCheck;
                    colorClass = 'text-cyan-400';
                  } else if (item.type === 'password') {
                    Icon = KeyRound;
                    colorClass = 'text-amber-400';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNavigateToItem(item.type, item.id)}
                      className="p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                          <Icon className={`w-4 h-4 ${colorClass}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-xs text-slate-100 group-hover:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {item.reason}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggested Prompts if no active result */}
          {!searchResult && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Suggested AI Life Queries</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                    className="p-2.5 text-left text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 rounded-xl text-slate-300 hover:text-white transition-all flex items-start gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Supports natural queries across Indian & global identity, finance & cloud assets</span>
                <span className="font-mono text-cyan-400">Gemini 3.7 + S3 + RDS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
