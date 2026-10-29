import React, { useState } from 'react';
import { Menu, X, Search, Lock } from 'lucide-react';

interface HeaderProps {
  activeView: 'landing' | 'form' | 'success' | 'admin';
  onNavigate: (view: 'landing' | 'form' | 'admin') => void;
  onOpenCheckStatus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onOpenCheckStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'landing' | 'form' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text wordmark with emblem */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <img
              src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
              alt="Logo Resmi Sekretariat Bersama Al-Irsyad"
              className="w-11 h-11 object-contain rounded-lg p-0.5 bg-white border border-amber-500/30 shadow-xs group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
                Sekretariat Bersama
              </span>
              <span className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-none group-hover:text-emerald-900 transition-colors">
                AL-IRSYAD
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => handleNavClick('landing')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeView === 'landing' ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('form')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeView === 'form' ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              onClick={onOpenCheckStatus}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-neutral-500" />
              <span>Cek Bukti Pendaftaran</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {activeView === 'admin' ? (
              <button
                onClick={() => handleNavClick('landing')}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
              >
                Kembali ke Halaman Publik
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:text-emerald-900 bg-emerald-50/80 border border-emerald-200/70 rounded-lg hover:bg-emerald-100 transition-all whitespace-nowrap shrink-0 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-800" />
                <span>Portal Admin</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 rounded-lg focus:outline-hidden"
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drop menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-2.5 shadow-lg">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeView === 'landing' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            Beranda Kegiatan
          </button>
          <button
            onClick={() => handleNavClick('form')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeView === 'form' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            Formulir Pendaftaran
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCheckStatus();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
          >
            <span>Cek Bukti Pendaftaran</span>
            <Search className="w-4 h-4 text-neutral-500" />
          </button>
          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between"
            >
              <span>Portal Admin & Data</span>
              <Lock className="w-4 h-4 text-emerald-800" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
