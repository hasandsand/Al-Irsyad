import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Home, 
  MessageCircle, 
  Send, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  Users, 
  Building,
  School
} from 'lucide-react';
import { RegistrationRecord, AppSettings } from '../types';
import { storageService } from '../services/storageService';

interface SuccessConfirmationProps {
  record: RegistrationRecord;
  onBackToHome: () => void;
  onPrintTicket: () => void;
}

export const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({
  record,
  onBackToHome,
  onPrintTicket,
}) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedMsg, setCopiedMsg] = useState<boolean>(false);

  useEffect(() => {
    storageService.getSettings().then(setSettings);
  }, []);

  const handleCopyRegNumber = () => {
    navigator.clipboard.writeText(record.nomorPendaftaran);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const panitiaPhone = settings?.panitiaWhatsapp || '6281225577889';
  const panitiaWaUrl = storageService.createPanitiaWhatsappUrl(record, panitiaPhone);
  const picWaUrl = storageService.createNotificationToPicWhatsappUrl(record);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Success Hero Banner */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-6 sm:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700" />
        
        {/* Official Logo and Success Badge */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <img
            src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
            alt="Logo Resmi Sekretariat Bersama Al-Irsyad"
            className="w-16 h-16 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Success Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 ring-6 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8 text-emerald-700" />
        </div>

        <span className="text-xs font-extrabold tracking-widest text-emerald-800 uppercase block mb-1">
          ✓ PENDAFTARAN BERHASIL
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Alhamdulillah, data pendaftaran telah berhasil kami terima.
        </h1>
        <p className="text-sm text-neutral-600 mt-2 max-w-xl mx-auto">
          Terima kasih atas partisipasi Yayasan dan Satuan Pendidikan Al-Irsyad dalam persiapan Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat.
        </p>

        {/* Automatic Registration Number Pill */}
        <div className="mt-6 inline-flex flex-col items-center p-4 rounded-2xl bg-radial from-emerald-50 to-neutral-50 border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Nomor Pendaftaran Resmi:
          </span>
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-950 tracking-wider">
              {record.nomorPendaftaran}
            </span>
            <button
              onClick={handleCopyRegNumber}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Salin Nomor Registrasi"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <span className="text-[11px] text-neutral-500 mt-1">
            Dicatat pada: {record.formattedTimestamp}
          </span>
        </div>

        {/* Key Information Summary Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-t border-neutral-100 pt-6">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase">
              <Building className="w-3.5 h-3.5 text-emerald-800" />
              <span>Nama Yayasan</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 mt-1">
              {record.namaYayasan}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase">
              <School className="w-3.5 h-3.5 text-emerald-800" />
              <span>Nama Sekolah</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 mt-1">
              {record.namaSekolah}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Tanggal & Waktu</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 mt-1">
              Kamis, 12 November 2026 (10.00–16.00 WIB)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              <span>Lokasi Kegiatan</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 mt-1">
              Pekalongan, Jawa Tengah
            </div>
          </div>

          <div className="sm:col-span-2 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 uppercase">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-800" />
                <span>Jumlah Delegasi Peserta: 3 Orang</span>
              </div>
              <span className="text-[11px] text-emerald-700">Terdaftar Lengkap</span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-800">
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <div className="font-bold text-neutral-900">1. Pembina Yayasan</div>
                <div className="text-neutral-700">{record.peserta1.nama}</div>
                <div className="text-neutral-500 text-[11px]">{record.peserta1.whatsapp}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <div className="font-bold text-neutral-900">2. Kepala Sekolah</div>
                <div className="text-neutral-700">{record.peserta2.nama}</div>
                <div className="text-neutral-500 text-[11px]">{record.peserta2.whatsapp}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                <div className="font-bold text-neutral-900">3. Guru Bhs Arab</div>
                <div className="text-neutral-700">{record.peserta3.nama}</div>
                <div className="text-neutral-500 text-[11px]">{record.peserta3.whatsapp}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Primary WhatsApp and Printing */}
        <div className="mt-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. KONFIRMASI VIA WHATSAPP (Ke Panitia) */}
            <a
              href={panitiaWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>KONFIRMASI VIA WHATSAPP</span>
            </a>

            {/* 2. CETAK / SIMPAN BUKTI PENDAFTARAN */}
            <button
              onClick={onPrintTicket}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl transition-all cursor-pointer"
            >
              <Printer className="w-5 h-5 text-neutral-700" />
              <span>CETAK / SIMPAN BUKTI</span>
            </button>
          </div>

          {/* 3. Automatic WhatsApp Notification to PIC */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-800">
            <div className="flex items-center gap-2 text-left">
              <Send className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Kirim Notifikasi Otomatis:</strong> Teruskan rangkuman tanda terima resmi langsung ke nomor WhatsApp PIC ({record.whatsappPic}).
              </span>
            </div>
            <a
              href={picWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Kirim ke WA PIC
            </a>
          </div>

          {/* 4. KEMBALI KE HALAMAN UTAMA */}
          <div className="pt-2">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 py-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>KEMBALI KE HALAMAN UTAMA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
