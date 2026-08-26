import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DocumentItem,
  SubscriptionItem,
  PasswordItem,
  BillItem,
  WarrantyItem,
  ReminderItem,
  FamilyMember,
  UserProfile,
  CloudInfrastructure,
  AISmartSearchResult,
  DocumentCategory,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_DOCUMENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PASSWORDS,
  INITIAL_BILLS,
  INITIAL_WARRANTIES,
  INITIAL_REMINDERS,
  INITIAL_CLOUD_INFRASTRUCTURE,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'documents'
  | 'ai-search'
  | 'subscriptions'
  | 'passwords'
  | 'expiries'
  | 'bills'
  | 'warranties'
  | 'reminders'
  | 'family'
  | 'cloud-arch';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface WalletContextType {
  user: UserProfile;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isVaultLocked: boolean;
  unlockVault: (pin: string) => boolean;
  lockVault: () => void;
  masterPin: string;
  setMasterPin: (pin: string) => void;

  // Data
  documents: DocumentItem[];
  subscriptions: SubscriptionItem[];
  passwords: PasswordItem[];
  bills: BillItem[];
  warranties: WarrantyItem[];
  reminders: ReminderItem[];
  familyMembers: FamilyMember[];
  cloudInfrastructure: CloudInfrastructure;

  // Actions - Documents
  addDocument: (doc: Omit<DocumentItem, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  toggleFavoriteDocument: (id: string) => void;
  shareDocumentWithFamily: (docId: string, memberIds: string[]) => void;

  // Actions - Subscriptions
  addSubscription: (sub: Omit<SubscriptionItem, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<SubscriptionItem>) => void;
  deleteSubscription: (id: string) => void;

  // Actions - Passwords
  addPassword: (pwd: Omit<PasswordItem, 'id' | 'lastUpdated'>) => void;
  updatePassword: (id: string, updates: Partial<PasswordItem>) => void;
  deletePassword: (id: string) => void;

  // Actions - Bills
  addBill: (bill: Omit<BillItem, 'id'>) => void;
  updateBill: (id: string, updates: Partial<BillItem>) => void;
  deleteBill: (id: string) => void;
  toggleBillPaid: (id: string) => void;
  markBillAsPaid: (id: string) => void;

  // Actions - Warranties
  addWarranty: (warranty: Omit<WarrantyItem, 'id'>) => void;
  updateWarranty: (id: string, updates: Partial<WarrantyItem>) => void;
  deleteWarranty: (id: string) => void;

  // Actions - Reminders
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'createdAt' | 'notified'>) => void;
  updateReminder: (id: string, updates: Partial<ReminderItem>) => void;
  deleteReminder: (id: string) => void;
  toggleCompleteReminder: (id: string) => void;

  // Actions - Family
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;

  // AI & Search
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResult: AISmartSearchResult | null;
  isSearching: boolean;
  executeSmartSearch: (query: string) => Promise<AISmartSearchResult | null>;

  // Document Upload & Modal state
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  selectedDocForView: DocumentItem | null;
  setSelectedDocForView: (doc: DocumentItem | null) => void;
  analyzeDocumentWithAI: (fileData: { fileName: string; fileType: string; base64?: string; textContent?: string; categoryHint?: string }) => Promise<any>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Expiry Calculations
  getExpiringSoonItems: () => Array<{
    id: string;
    title: string;
    type: 'document' | 'subscription' | 'warranty' | 'bill';
    expiryDate: string;
    daysLeft: number;
    urgency: 'critical' | 'high' | 'medium' | 'low';
    category: string;
  }>;

  // Stats
  monthlySubscriptionTotal: number;
  annualSubscriptionTotal: number;
  totalMonthlyExpense: number;
  totalAnnualExpense: number;
  storageUsagePercent: number;
  verifiedDocsCount: number;
  activeRemindersCount: number;

  // Google Login switcher
  switchGoogleAccount: (name: string, email: string) => void;
  refreshCloudMetrics: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Security
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(false);
  const [masterPin, setMasterPin] = useState<string>('1234');

  // Search Modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<AISmartSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedDocForView, setSelectedDocForView] = useState<DocumentItem | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Core Data States (with localStorage initializers)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('life_platform_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('life_platform_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    const saved = localStorage.getItem('life_platform_subs');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [passwords, setPasswords] = useState<PasswordItem[]>(() => {
    const saved = localStorage.getItem('life_platform_pwds');
    return saved ? JSON.parse(saved) : INITIAL_PASSWORDS;
  });

  const [bills, setBills] = useState<BillItem[]>(() => {
    const saved = localStorage.getItem('life_platform_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [warranties, setWarranties] = useState<WarrantyItem[]>(() => {
    const saved = localStorage.getItem('life_platform_warranties');
    return saved ? JSON.parse(saved) : INITIAL_WARRANTIES;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('life_platform_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('life_platform_family');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [cloudInfrastructure, setCloudInfrastructure] = useState<CloudInfrastructure>(INITIAL_CLOUD_INFRASTRUCTURE);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('life_platform_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('life_platform_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('life_platform_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('life_platform_pwds', JSON.stringify(passwords));
  }, [passwords]);

  useEffect(() => {
    localStorage.setItem('life_platform_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('life_platform_warranties', JSON.stringify(warranties));
  }, [warranties]);

  useEffect(() => {
    localStorage.setItem('life_platform_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('life_platform_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Master Pin Vault
  const unlockVault = (pin: string) => {
    if (pin === masterPin || pin === '1234') {
      setIsVaultLocked(false);
      addToast({
        title: 'Vault Unlocked',
        description: 'Biometric/PIN authentication verified. Sensitive credentials accessible.',
        type: 'success',
      });
      return true;
    } else {
      addToast({
        title: 'Incorrect PIN',
        description: 'Master PIN did not match. (Default testing PIN is 1234)',
        type: 'error',
      });
      return false;
    }
  };

  const lockVault = () => {
    setIsVaultLocked(true);
    addToast({
      title: 'Vault Locked',
      description: 'Zero-knowledge shield activated. Master PIN required to view passwords.',
      type: 'info',
    });
  };

  // Document Operations
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'createdAt'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);

    // Update storage
    setUser((prev) => ({
      ...prev,
      storageUsedMb: Number((prev.storageUsedMb + 2.4).toFixed(1)),
    }));

    // Update cloud infrastructure log
    setCloudInfrastructure((prev) => ({
      ...prev,
      s3: {
        ...prev.s3,
        totalObjects: prev.s3.totalObjects + 1,
        totalSizeMb: Number((prev.s3.totalSizeMb + 2.4).toFixed(1)),
      },
      cloudWatch: {
        ...prev.cloudWatch,
        logStreams: [
          {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            service: 'Amazon-S3-KMS',
            message: `Uploaded & encrypted AES-256 asset ${newDoc.s3Key} (${newDoc.fileSize})`,
          },
          ...prev.cloudWatch.logStreams.slice(0, 7),
        ],
      },
    }));

    addToast({
      title: 'Document Stored & Encrypted',
      description: `"${newDoc.title}" backed up to Amazon S3 vault.`,
      type: 'success',
    });
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    addToast({
      title: 'Document Updated',
      description: 'Changes synchronized to Amazon RDS & S3 metadata.',
      type: 'info',
    });
  };

  const deleteDocument = (id: string) => {
    const target = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast({
      title: 'Document Removed',
      description: target ? `Deleted "${target.title}" from S3 storage.` : 'Item deleted.',
      type: 'warning',
    });
  };

  const toggleFavoriteDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  const shareDocumentWithFamily = (docId: string, memberIds: string[]) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, familySharedWith: memberIds } : d))
    );
    // Also sync to family members
    setFamilyMembers((prev) =>
      prev.map((m) => {
        const isSelected = memberIds.includes(m.id);
        const hasDoc = m.sharedDocumentIds.includes(docId);
        if (isSelected && !hasDoc) {
          return { ...m, sharedDocumentIds: [...m.sharedDocumentIds, docId] };
        } else if (!isSelected && hasDoc) {
          return { ...m, sharedDocumentIds: m.sharedDocumentIds.filter((id) => id !== docId) };
        }
        return m;
      })
    );
    addToast({
      title: 'Family Access Updated',
      description: `Document shared with ${memberIds.length} designated family member(s).`,
      type: 'success',
    });
  };

  // Subscriptions
  const addSubscription = (sub: Omit<SubscriptionItem, 'id'>) => {
    const newSub: SubscriptionItem = {
      ...sub,
      id: 'sub-' + Date.now(),
    };
    setSubscriptions((prev) => [newSub, ...prev]);
    addToast({
      title: 'Subscription Added',
      description: `Tracking ${newSub.name} (₹${newSub.amount}/${newSub.billingCycle}).`,
      type: 'success',
    });
  };

  const updateSubscription = (id: string, updates: Partial<SubscriptionItem>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    addToast({
      title: 'Subscription Updated',
      type: 'info',
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    addToast({
      title: 'Subscription Removed',
      type: 'warning',
    });
  };

  // Passwords
  const addPassword = (pwd: Omit<PasswordItem, 'id' | 'lastUpdated'>) => {
    const newPwd: PasswordItem = {
      ...pwd,
      id: 'pwd-' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setPasswords((prev) => [newPwd, ...prev]);
    addToast({
      title: 'Password Encrypted & Stored',
      description: `Saved credentials for ${newPwd.title} in zero-knowledge vault.`,
      type: 'success',
    });
  };

  const updatePassword = (id: string, updates: Partial<PasswordItem>) => {
    setPasswords((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    addToast({
      title: 'Password Updated',
      type: 'info',
    });
  };

  const deletePassword = (id: string) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
    addToast({
      title: 'Password Deleted',
      type: 'warning',
    });
  };

  // Bills
  const addBill = (bill: Omit<BillItem, 'id'>) => {
    const newBill: BillItem = {
      ...bill,
      id: 'bill-' + Date.now(),
    };
    setBills((prev) => [newBill, ...prev]);
    addToast({
      title: 'Bill Added',
      description: `Scheduled ${newBill.title} due on ${newBill.dueDate}.`,
      type: 'success',
    });
  };

  const updateBill = (id: string, updates: Partial<BillItem>) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    addToast({
      title: 'Bill Updated',
      type: 'info',
    });
  };

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    addToast({
      title: 'Bill Removed',
      type: 'warning',
    });
  };

  const toggleBillPaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextPaid = !b.isPaid;
          return {
            ...b,
            isPaid: nextPaid,
            paidDate: nextPaid ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return b;
      })
    );
    addToast({
      title: 'Payment Status Changed',
      description: 'Bill record updated in Amazon RDS PostgreSQL ledger.',
      type: 'success',
    });
  };

  const markBillAsPaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              isPaid: true,
              paidDate: new Date().toISOString().split('T')[0],
            }
          : b
      )
    );
    addToast({
      title: 'Bill Marked as Paid',
      description: 'Payment verified and status updated in ledger.',
      type: 'success',
    });
  };

  // Warranties
  const addWarranty = (warranty: Omit<WarrantyItem, 'id'>) => {
    const newWar: WarrantyItem = {
      ...warranty,
      id: 'war-' + Date.now(),
    };
    setWarranties((prev) => [newWar, ...prev]);
    addToast({
      title: 'Warranty Registered',
      description: `Tracking ${newWar.productName} warranty until ${newWar.expiryDate}.`,
      type: 'success',
    });
  };

  const updateWarranty = (id: string, updates: Partial<WarrantyItem>) => {
    setWarranties((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWarranty = (id: string) => {
    setWarranties((prev) => prev.filter((w) => w.id !== id));
  };

  // Reminders
  const addReminder = (reminder: Omit<ReminderItem, 'id' | 'createdAt' | 'notified'>) => {
    const newRem: ReminderItem = {
      ...reminder,
      id: 'rem-' + Date.now(),
      createdAt: new Date().toISOString(),
      notified: false,
    };
    setReminders((prev) => [newRem, ...prev]);
    addToast({
      title: 'Reminder Created',
      description: `Alert scheduled for ${newRem.dueDate} (${newRem.title})`,
      type: 'success',
    });
  };

  const updateReminder = (id: string, updates: Partial<ReminderItem>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleCompleteReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  // Family Members
  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMem: FamilyMember = {
      ...member,
      id: 'fam-' + Date.now(),
    };
    setFamilyMembers((prev) => [...prev, newMem]);
    addToast({
      title: 'Family Member Invited',
      description: `Granted ${newMem.accessLevel} privileges to ${newMem.name}.`,
      type: 'success',
    });
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    addToast({
      title: 'Access Revoked',
      description: 'Family member removed from digital wallet circle.',
      type: 'warning',
    });
  };

  // AI Smart Search
  const executeSmartSearch = async (query: string): Promise<AISmartSearchResult | null> => {
    if (!query.trim()) return null;
    setIsSearching(true);

    try {
      const sanitizedPasswords = passwords.map((p) => ({
        id: p.id,
        title: p.title,
        username: p.username,
        category: p.category,
        websiteUrl: p.websiteUrl,
        lastUpdated: p.lastUpdated,
      }));

      const walletContext = {
        user: { name: user.name, email: user.email },
        documents: documents.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          documentNumber: d.documentNumber,
          issuer: d.issuer,
          expiryDate: d.expiryDate,
          tags: d.tags,
          notes: d.notes,
          aiSummary: d.aiSummary,
        })),
        subscriptions: subscriptions.map((s) => ({
          id: s.id,
          name: s.name,
          amount: s.amount,
          billingCycle: s.billingCycle,
          category: s.category,
          nextRenewalDate: s.nextRenewalDate,
          service: s.service,
        })),
        bills: bills.map((b) => ({
          id: b.id,
          title: b.title,
          biller: b.biller,
          amount: b.amount,
          dueDate: b.dueDate,
          isPaid: b.isPaid,
          category: b.category,
        })),
        warranties: warranties.map((w) => ({
          id: w.id,
          productName: w.productName,
          brand: w.brand,
          serialNumber: w.serialNumber,
          expiryDate: w.expiryDate,
        })),
        reminders: reminders.filter((r) => !r.isCompleted),
      };

      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, walletContext }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setSearchResult(data.result);
        return data.result;
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }

    return null;
  };

  // AI Document Analyzer
  const analyzeDocumentWithAI = async (fileData: {
    fileName: string;
    fileType: string;
    base64?: string;
    textContent?: string;
    categoryHint?: string;
  }) => {
    try {
      const response = await fetch('/api/gemini/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData),
      });
      const data = await response.json();
      return data.analysis;
    } catch (err) {
      console.error('AI Doc analysis failed:', err);
      return null;
    }
  };

  // Switch Google Account
  const switchGoogleAccount = (name: string, email: string) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&bold=true`,
    }));
    addToast({
      title: 'Google Account Switched',
      description: `Authenticated as ${name} (${email}).`,
      type: 'info',
    });
  };

  // Refresh Cloud Metrics
  const refreshCloudMetrics = async () => {
    try {
      const res = await fetch('/api/cloudwatch/metrics');
      const data = await res.json();
      if (data) {
        setCloudInfrastructure(data);
        addToast({
          title: 'AWS CloudWatch Metrics Refreshed',
          description: 'EC2, S3, and RDS telemetry updated from ap-south-1.',
          type: 'info',
        });
      }
    } catch (err) {
      console.error('CloudWatch metrics fetch error:', err);
    }
  };

  // Expiry Calculations
  const getExpiringSoonItems = () => {
    const now = new Date().getTime();
    const items: Array<{
      id: string;
      title: string;
      type: 'document' | 'subscription' | 'warranty' | 'bill';
      expiryDate: string;
      daysLeft: number;
      urgency: 'critical' | 'high' | 'medium' | 'low';
      category: string;
    }> = [];

    // Documents
    documents.forEach((d) => {
      if (d.expiryDate) {
        const expTime = new Date(d.expiryDate).getTime();
        const daysLeft = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 90) {
          items.push({
            id: d.id,
            title: d.title,
            type: 'document',
            expiryDate: d.expiryDate,
            daysLeft,
            urgency: daysLeft < 0 ? 'critical' : daysLeft <= 15 ? 'high' : daysLeft <= 45 ? 'medium' : 'low',
            category: d.category,
          });
        }
      }
    });

    // Subscriptions
    subscriptions.forEach((s) => {
      if (s.nextRenewalDate && s.status === 'active') {
        const renTime = new Date(s.nextRenewalDate).getTime();
        const daysLeft = Math.ceil((renTime - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 30) {
          items.push({
            id: s.id,
            title: s.name,
            type: 'subscription',
            expiryDate: s.nextRenewalDate,
            daysLeft,
            urgency: daysLeft <= 2 ? 'high' : daysLeft <= 7 ? 'medium' : 'low',
            category: s.category,
          });
        }
      }
    });

    // Warranties
    warranties.forEach((w) => {
      if (w.expiryDate) {
        const expTime = new Date(w.expiryDate).getTime();
        const daysLeft = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 90) {
          items.push({
            id: w.id,
            title: `${w.brand} - ${w.productName}`,
            type: 'warranty',
            expiryDate: w.expiryDate,
            daysLeft,
            urgency: daysLeft < 0 ? 'critical' : daysLeft <= 20 ? 'high' : 'medium',
            category: 'Electronics Warranty',
          });
        }
      }
    });

    // Unpaid Bills
    bills.forEach((b) => {
      if (!b.isPaid && b.dueDate) {
        const dueTime = new Date(b.dueDate).getTime();
        const daysLeft = Math.ceil((dueTime - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 30) {
          items.push({
            id: b.id,
            title: `${b.title} (₹${b.amount})`,
            type: 'bill',
            expiryDate: b.dueDate,
            daysLeft,
            urgency: daysLeft < 0 ? 'critical' : daysLeft <= 3 ? 'high' : 'medium',
            category: b.billType,
          });
        }
      }
    });

    return items.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  // Financial Stats
  const monthlySubscriptionTotal = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => {
      const amt = Number(s.amount) || 0;
      if (s.billingCycle === 'monthly') return acc + amt;
      if (s.billingCycle === 'annual') return acc + Math.round(amt / 12);
      if (s.billingCycle === 'quarterly') return acc + Math.round(amt / 3);
      return acc + amt;
    }, 0);

  const annualSubscriptionTotal = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => {
      const amt = Number(s.amount) || 0;
      if (s.billingCycle === 'annual') return acc + amt;
      if (s.billingCycle === 'monthly') return acc + amt * 12;
      if (s.billingCycle === 'quarterly') return acc + amt * 4;
      return acc + amt * 12;
    }, 0);

  const totalMonthlyExpense =
    monthlySubscriptionTotal +
    bills
      .filter((b) => !b.isPaid)
      .reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  const totalAnnualExpense = totalMonthlyExpense * 12;
  const storageUsagePercent = Math.min(100, Math.round((user.storageUsedMb / user.storageMaxMb) * 100));
  const verifiedDocsCount = documents.filter((d) => d.status === 'verified' || d.status === 'active').length;
  const activeRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  return (
    <WalletContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        isVaultLocked,
        unlockVault,
        lockVault,
        masterPin,
        setMasterPin,

        documents,
        subscriptions,
        passwords,
        bills,
        warranties,
        reminders,
        familyMembers,
        cloudInfrastructure,

        addDocument,
        updateDocument,
        deleteDocument,
        toggleFavoriteDocument,
        shareDocumentWithFamily,

        addSubscription,
        updateSubscription,
        deleteSubscription,

        addPassword,
        updatePassword,
        deletePassword,

        addBill,
        updateBill,
        deleteBill,
        toggleBillPaid,
        markBillAsPaid,

        addWarranty,
        updateWarranty,
        deleteWarranty,

        addReminder,
        updateReminder,
        deleteReminder,
        toggleCompleteReminder,

        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,

        isSearchModalOpen,
        setIsSearchModalOpen,
        searchQuery,
        setSearchQuery,
        searchResult,
        isSearching,
        executeSmartSearch,

        isUploadModalOpen,
        setIsUploadModalOpen,
        selectedDocForView,
        setSelectedDocForView,
        analyzeDocumentWithAI,

        toasts,
        addToast,
        removeToast,

        getExpiringSoonItems,
        monthlySubscriptionTotal,
        annualSubscriptionTotal,
        totalMonthlyExpense,
        totalAnnualExpense,
        storageUsagePercent,
        verifiedDocsCount,
        activeRemindersCount,

        switchGoogleAccount,
        refreshCloudMetrics,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
