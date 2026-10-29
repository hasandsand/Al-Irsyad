import React, { useState } from 'react';
import { X, Search, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { RegistrationRecord } from '../types';
import { storageService, sanitizeWhatsappNumber } from '../services/storageService';

interface CheckStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (record: RegistrationRecord) => void;
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegistrationRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const records = await storageService.getRegistrations();
      const q = query.trim().toLowerCase();
      const cleanPhone = sanitizeWhatsappNumber(query);

      const filtered = records.filter(r => {
        const matchRegNo = r.nomorPendaftaran?.toLowerCase().includes(q);
        const matchSekolah = r.namaSekolah?.toLowerCase().includes(q);
        const matchYayasan = r.namaYayasan?.toLowerCase().includes(q);
        const matchPic = r.namaPic?.toLowerCase().includes(q);
        const matchWaPic = cleanPhone && sanitizeWhatsappNumber(r.whatsappPic).includes(cleanPhone);
        return matchRegNo || matchSekolah || matchYayasan || matchPic || matchWaPic;
      });

      setResults(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <img
            src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
            alt="Logo Resmi Al-Irsyad"
            className="w-12 h-12 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Cek Bukti Pendaftaran
            </h3>
            <p className="text-xs text-neutral-500">
              Masukkan Nomor Registrasi (SBA-2026-XXXX) atau Nomor WhatsApp PIC
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Contoh: SBA-2026-0001 atau 0812345..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-neutral-50/50"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? 'Mencari Data...' : 'Cari Bukti Pendaftaran'}
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div className="mt-6 border-t border-neutral-100 pt-4">
            {results.length === 0 ? (
              <div className="text-center py-6 text-neutral-500 text-xs sm:text-sm">
                <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="font-semibold text-neutral-700">Data Pendaftaran Tidak Ditemukan</p>
                <p className="mt-1 text-neutral-500">
                  Pastikan nomor registrasi atau WhatsApp yang Anda masukkan sudah terdaftar.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Ditemukan {results.length} Data:
                </span>
                {results.map(rec => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-500 bg-neutral-50/50 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-emerald-900">
                        {rec.nomorPendaftaran}
                      </div>
                      <div className="font-semibold text-sm text-neutral-900 mt-0.5">
                        {rec.namaSekolah}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {rec.namaYayasan} · PIC: {rec.namaPic}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectRecord(rec);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>Buka Bukti</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
