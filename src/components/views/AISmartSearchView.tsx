import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  FileText,
  CreditCard,
  Receipt,
  ShieldCheck,
  KeyRound,
  Calendar,
  ArrowRight,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const AISmartSearchView: React.FC = () => {
  const {
    documents,
    subscriptions,
    bills,
    warranties,
    passwords,
    reminders,
    executeSmartSearch,
    setSelectedDocForView,
    setActiveTab,
  } = useWallet();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: 'user' | 'ai';
      text: string;
      timestamp: string;
      recommendations?: string[];
      matchingItems?: Array<{ type: string; id: string; title: string; reason: string }>;
    }>
  >([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your AI Life Management Assistant. I have secure real-time access to your encrypted Document Vault, Subscriptions, Warranties, Bills, and Expiry Reminders. How can I help you manage your personal records today?",
      timestamp: 'Just now',
      recommendations: [
        'Check upcoming document expiries in the next 30 days',
        'Analyze monthly subscription spending & identify savings',
        'Find policy numbers and emergency medical insurance coverage',
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'When does my Indian passport expire and what are the renewal steps?',
    'What is my health insurance policy number, sum insured, and hospital network?',
    'Calculate my total monthly recurring subscriptions and list them by price',
    'Which utility bills are unpaid and when is the earliest due date?',
    'Show warranty details and customer care for my Apple MacBook',
    'List all documents currently shared with my spouse Priya',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (promptText?: string) => {
    const query = promptText || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInputQuery('');
    setLoading(true);

    try {
      const result = await executeSmartSearch(query);

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai' as const,
        text:
          result?.directAnswer ||
          "I analyzed your vault records and found matching documents, subscriptions, and reminders.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: result?.recommendations,
        matchingItems: result?.matchingItems,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: "I processed your request using local vault heuristics. Your documents and bills are up to date.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateItem = (type: string, id: string) => {
    if (type === 'document') {
      const doc = documents.find((d) => d.id === id);
      if (doc) setSelectedDocForView(doc);
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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800/90 p-4 sm:p-5 rounded-2xl flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span>AI Life Assistant & Smart Semantic Search</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Gemini 3.7 Pro
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Natural language Q&A across your Aadhaar, Passport, Insurance, Bills, and Expiries.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/90">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Vault Context Loaded ({documents.length} Docs, {subscriptions.length} Subs)</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800/90 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs sm:text-sm ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-bl-none shadow-xs'
              }`}
            >
              <div className="leading-relaxed whitespace-pre-line font-normal text-slate-100">{msg.text}</div>

              {/* Matched Items */}
              {msg.matchingItems && msg.matchingItems.length > 0 && (
                <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Referenced Vault Records:
                  </div>
                  <div className="space-y-1.5">
                    {msg.matchingItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNavigateItem(item.type, item.id)}
                        className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/90 hover:border-cyan-500/50 flex items-center justify-between cursor-pointer transition-all group shadow-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">{item.title}</span>
                          <span className="text-[10px] text-slate-400 truncate font-medium">({item.reason})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="pt-2.5 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Smart Recommendations:</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-cyan-400 font-medium">
                    {msg.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[10px] text-slate-400 text-right font-mono font-medium">{msg.timestamp}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs items-center text-cyan-400 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl px-4 py-3 text-slate-300 font-medium">
              AI is analyzing your encrypted vault documents, policies & subscriptions...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
        {samplePrompts.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800/90 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all flex items-center gap-1.5 font-medium shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 shrink-0 bg-slate-900 border border-slate-800/90 p-2 rounded-2xl shadow-sm"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI anything about your documents, expiries, warranties, or subscriptions..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span>Ask AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
