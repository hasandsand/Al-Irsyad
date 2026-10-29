import React from 'react';
import { ShieldCheck, MapPin, Calendar, Clock, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'form' | 'admin') => void;
  onOpenCheckStatus: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCheckStatus }) => {
  return (
    <footer className="no-print bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Event Title */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
                alt="Logo Resmi Sekretariat Bersama Al-Irsyad"
                className="w-11 h-11 object-contain rounded-lg p-0.5 bg-white border border-amber-500/40"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">
                  Sekretariat Bersama
                </span>
                <span className="text-base font-extrabold text-white tracking-tight">
                  AL-IRSYAD
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat bagi Satuan Pendidikan di lingkungan Yayasan Al-Irsyad se-Indonesia.
            </p>
            <div className="text-xs text-amber-400/90 font-arabic pt-1 select-none">
              اللغة العربية لغة القرآن والعلم
            </div>
          </div>

          {/* Event Quick Info */}
          <div className="md:col-span-4 space-y-2.5 text-xs text-neutral-300">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              Informasi Pelaksanaan
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kamis, 12 November 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>10.00 – 16.00 WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pekalongan, Jawa Tengah</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              Tautan Cepat
            </span>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onNavigate('landing')}
                className="text-left text-neutral-400 hover:text-white transition-colors"
              >
                Beranda Kegiatan
              </button>
              <button
                onClick={() => onNavigate('form')}
                className="text-left text-neutral-400 hover:text-white transition-colors"
              >
                Formulir Pendaftaran
              </button>
              <button
                onClick={onOpenCheckStatus}
                className="text-left text-neutral-400 hover:text-white transition-colors"
              >
                Cek Bukti Pendaftaran
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="text-left text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Portal Admin Sekretariat
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <span>
            © 2026 Sekretariat Bersama Al-Irsyad. Hak Cipta Dilindungi Undang-Undang.
          </span>
          <span className="font-mono text-[11px] text-neutral-400">
            Pekalongan, Jawa Tengah · Indonesia
          </span>
        </div>
      </div>
    </footer>
  );
};
