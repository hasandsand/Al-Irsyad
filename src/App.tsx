import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessConfirmation } from './components/SuccessConfirmation';
import { PrintableBadge } from './components/PrintableBadge';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckStatusModal } from './components/CheckStatusModal';
import { Footer } from './components/Footer';
import { RegistrationRecord } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'form' | 'success' | 'admin' | 'print'>('landing');
  const [currentRecord, setCurrentRecord] = useState<RegistrationRecord | null>(null);
  const [isCheckStatusOpen, setIsCheckStatusOpen] = useState<boolean>(false);

  const handleStartRegistration = () => {
    setActiveView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (record: RegistrationRecord) => {
    setCurrentRecord(record);
    setActiveView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPrintTicket = () => {
    setActiveView('print');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePrint = () => {
    if (activeView === 'print') {
      setActiveView(currentRecord ? 'success' : 'landing');
    }
  };

  const handleSelectRecordFromSearch = (record: RegistrationRecord) => {
    setCurrentRecord(record);
    setActiveView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewRecordPassFromAdmin = (record: RegistrationRecord) => {
    setCurrentRecord(record);
    setActiveView('print');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800">
      {/* Top Header Navigation (hidden only during print media) */}
      <div className="no-print">
        <Header
          activeView={activeView === 'print' ? 'form' : activeView}
          onNavigate={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <HeroLanding
            onStartRegistration={handleStartRegistration}
            onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
          />
        )}

        {activeView === 'form' && (
          <RegistrationForm
            onSuccess={handleRegistrationSuccess}
            onCancel={handleBackToHome}
          />
        )}

        {activeView === 'success' && currentRecord && (
          <SuccessConfirmation
            record={currentRecord}
            onBackToHome={handleBackToHome}
            onPrintTicket={handleOpenPrintTicket}
          />
        )}

        {activeView === 'print' && currentRecord && (
          <PrintableBadge
            record={currentRecord}
            onClose={handleClosePrint}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            onBackToPublic={handleBackToHome}
            onViewRecordPass={handleViewRecordPassFromAdmin}
          />
        )}
      </main>

      {/* Check Status Modal */}
      <CheckStatusModal
        isOpen={isCheckStatusOpen}
        onClose={() => setIsCheckStatusOpen(false)}
        onSelectRecord={handleSelectRecordFromSearch}
      />

      {/* Footer (hidden when printing or in admin/print view) */}
      {activeView !== 'print' && activeView !== 'admin' && (
        <Footer
          onNavigate={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
        />
      )}
    </div>
  );
}
