import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { SmartSearchModal } from './components/SmartSearchModal';

// Modals
import { DocumentUploadModal } from './components/modals/DocumentUploadModal';
import { DocumentDetailModal } from './components/modals/DocumentDetailModal';
import { SubscriptionModal } from './components/modals/SubscriptionModal';
import { PasswordModal } from './components/modals/PasswordModal';
import { BillModal } from './components/modals/BillModal';
import { WarrantyModal } from './components/modals/WarrantyModal';
import { ReminderModal } from './components/modals/ReminderModal';
import { FamilyMemberModal } from './components/modals/FamilyMemberModal';
import { GoogleAccountModal } from './components/modals/GoogleAccountModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { DocumentsView } from './components/views/DocumentsView';
import { AISmartSearchView } from './components/views/AISmartSearchView';
import { SubscriptionsView } from './components/views/SubscriptionsView';
import { PasswordsView } from './components/views/PasswordsView';
import { ExpiryRenewalView } from './components/views/ExpiryRenewalView';
import { BillsView } from './components/views/BillsView';
import { WarrantiesView } from './components/views/WarrantiesView';
import { RemindersView } from './components/views/RemindersView';
import { FamilyAccessView } from './components/views/FamilyAccessView';
import { CloudArchitectureView } from './components/views/CloudArchitectureView';

const MainLayout: React.FC = () => {
  const { activeTab, setIsUploadModalOpen } = useWallet();

  // Modal Visibility States
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenAddSub={() => setIsSubModalOpen(true)}
        onOpenAddBill={() => setIsBillModalOpen(true)}
        onOpenAddPwd={() => setIsPwdModalOpen(true)}
        onOpenAddReminder={() => setIsReminderModalOpen(true)}
        onOpenGoogleModal={() => setIsGoogleModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenUpload={() => setIsUploadModalOpen(true)}
              onOpenAddSub={() => setIsSubModalOpen(true)}
              onOpenAddBill={() => setIsBillModalOpen(true)}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView onOpenUpload={() => setIsUploadModalOpen(true)} />
          )}

          {activeTab === 'ai-search' && <AISmartSearchView />}

          {activeTab === 'subscriptions' && (
            <SubscriptionsView onOpenAddSub={() => setIsSubModalOpen(true)} />
          )}

          {activeTab === 'passwords' && (
            <PasswordsView onOpenAddPwd={() => setIsPwdModalOpen(true)} />
          )}

          {activeTab === 'expiries' && <ExpiryRenewalView />}

          {activeTab === 'bills' && (
            <BillsView onOpenAddBill={() => setIsBillModalOpen(true)} />
          )}

          {activeTab === 'warranties' && (
            <WarrantiesView onOpenAddWarranty={() => setIsWarrantyModalOpen(true)} />
          )}

          {activeTab === 'reminders' && (
            <RemindersView onOpenAddReminder={() => setIsReminderModalOpen(true)} />
          )}

          {activeTab === 'family' && (
            <FamilyAccessView onOpenAddFamily={() => setIsFamilyModalOpen(true)} />
          )}

          {activeTab === 'cloud-arch' && <CloudArchitectureView />}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <SmartSearchModal />
      <DocumentUploadModal />
      <DocumentDetailModal />
      <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
      <PasswordModal isOpen={isPwdModalOpen} onClose={() => setIsPwdModalOpen(false)} />
      <BillModal isOpen={isBillModalOpen} onClose={() => setIsBillModalOpen(false)} />
      <WarrantyModal isOpen={isWarrantyModalOpen} onClose={() => setIsWarrantyModalOpen(false)} />
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} />
      <FamilyMemberModal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)} />
      <GoogleAccountModal isOpen={isGoogleModalOpen} onClose={() => setIsGoogleModalOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <WalletProvider>
      <MainLayout />
    </WalletProvider>
  );
}

export default App;
