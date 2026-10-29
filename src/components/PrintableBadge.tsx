import React from 'react';
import { Printer, ArrowLeft, ShieldCheck, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface PrintableBadgeProps {
  record: RegistrationRecord;
  onClose: () => void;
}

export const PrintableBadge: React.FC<PrintableBadgeProps> = ({
  record,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Konfirmasi</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Sheet Container */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-emerald-900/30 shadow-md print:shadow-none print:border-none print:p-0 text-neutral-900 relative">
        {/* Subtle decorative watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
          <ShieldCheck className="w-96 h-96 text-emerald-950" />
        </div>

        {/* Letterhead / Kop Surat */}
        <div className="border-b-2 border-emerald-900 pb-5 mb-6 text-center relative">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img
              src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
              alt="Logo Resmi Sekretariat Bersama Al-Irsyad"
              className="w-20 h-20 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <span className="text-xs font-extrabold tracking-widest text-emerald-900 uppercase block">
                SEKRETARIAT BERSAMA AL-IRSYAD
              </span>
              <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                BUKTI PENDAFTARAN RESMI PESERTA DELEGASI
              </div>
              <div className="text-xs text-neutral-600 mt-0.5 font-medium">
                Pilot Project Pengajaran Bahasa Arab Bersertifikat Tingkat Nasional
              </div>
            </div>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-1">
            Sekretariat Bersama Al-Irsyad · Gedung Dakwah & Pendidikan · Pekalongan, Jawa Tengah
          </div>
        </div>

        {/* Big Registration Number Box */}
        <div className="bg-emerald-50/70 border-2 border-dashed border-emerald-800 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
              Nomor Registrasi Resmi
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-950 tracking-wider mt-0.5">
              {record.nomorPendaftaran}
            </div>
            <div className="text-xs text-emerald-800/80 mt-1">
              Waktu Pendaftaran: {record.formattedTimestamp}
            </div>
          </div>

          <div className="text-center sm:text-right bg-white p-3 rounded-xl border border-emerald-200">
            <div className="text-xs font-bold text-neutral-800 uppercase">Status Verifikasi</div>
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-sm mt-0.5">
              <CheckCircle className="w-4 h-4" />
              <span>TERKONFIRMASI HADIR</span>
            </div>
            <div className="text-[11px] text-neutral-500">Kuota 3 Peserta Terpenuhi</div>
          </div>
        </div>

        {/* Institution & Event Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs sm:text-sm">
          <div className="space-y-3 bg-neutral-50/70 p-4 rounded-xl border border-neutral-200">
            <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-1.5 uppercase tracking-wide text-xs">
              Identitas Satuan Pendidikan
            </h4>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-neutral-500">Nama Yayasan</span>
              <span className="col-span-2 font-semibold text-neutral-900">: {record.namaYayasan}</span>

              <span className="text-neutral-500">Nama Sekolah</span>
              <span className="col-span-2 font-semibold text-neutral-900">: {record.namaSekolah}</span>

              <span className="text-neutral-500">Alamat</span>
              <span className="col-span-2 text-neutral-800">: {record.alamat}</span>

              <span className="text-neutral-500">Kab./Kota</span>
              <span className="col-span-2 text-neutral-800">: {record.kabupatenKota}, {record.provinsi}</span>

              <span className="text-neutral-500">PIC Lembaga</span>
              <span className="col-span-2 text-neutral-800">: {record.namaPic} ({record.whatsappPic})</span>
            </div>
          </div>

          <div className="space-y-3 bg-neutral-50/70 p-4 rounded-xl border border-neutral-200">
            <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-1.5 uppercase tracking-wide text-xs">
              Jadwal & Tempat Pelaksanaan
            </h4>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-neutral-500">Kegiatan</span>
              <span className="col-span-2 font-semibold text-emerald-950">: Pilot Project Pengajaran Bahasa Arab</span>

              <span className="text-neutral-500">Hari & Tanggal</span>
              <span className="col-span-2 font-semibold text-neutral-900">: Kamis, 12 November 2026</span>

              <span className="text-neutral-500">Waktu</span>
              <span className="col-span-2 font-semibold text-neutral-900">: 10.00 – 16.00 WIB</span>

              <span className="text-neutral-500">Tempat</span>
              <span className="col-span-2 font-semibold text-neutral-900">: Pekalongan, Jawa Tengah</span>

              <span className="text-neutral-500">Penyelenggara</span>
              <span className="col-span-2 text-neutral-800">: Sekretariat Bersama Al-Irsyad</span>
            </div>
          </div>
        </div>

        {/* 3 Delegates Table */}
        <div className="mb-8">
          <h4 className="font-bold text-neutral-900 uppercase tracking-wide text-xs mb-2">
            Daftar 3 Orang Delegasi Resmi Peserta
          </h4>
          <table className="w-full text-left text-xs border border-neutral-300 rounded-lg overflow-hidden">
            <thead className="bg-emerald-900 text-white font-semibold">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3">Unsur / Posisi</th>
                <th className="py-2.5 px-3">Nama Lengkap</th>
                <th className="py-2.5 px-3">Jabatan</th>
                <th className="py-2.5 px-3">No. WhatsApp</th>
                <th className="py-2.5 px-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr className="bg-white">
                <td className="py-2.5 px-3 text-center font-bold">1</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-900">Pembina / Pengurus Yayasan</td>
                <td className="py-2.5 px-3 font-bold text-neutral-900">{record.peserta1.nama}</td>
                <td className="py-2.5 px-3">{record.peserta1.jabatan}</td>
                <td className="py-2.5 px-3 font-mono">{record.peserta1.whatsapp}</td>
                <td className="py-2.5 px-3 text-neutral-500">Unsur Kebijakan</td>
              </tr>
              <tr className="bg-neutral-50/50">
                <td className="py-2.5 px-3 text-center font-bold">2</td>
                <td className="py-2.5 px-3 font-semibold text-amber-900">Kepala Sekolah</td>
                <td className="py-2.5 px-3 font-bold text-neutral-900">{record.peserta2.nama}</td>
                <td className="py-2.5 px-3">{record.peserta2.jabatan}</td>
                <td className="py-2.5 px-3 font-mono">{record.peserta2.whatsapp}</td>
                <td className="py-2.5 px-3 text-neutral-500">Unsur Manajerial</td>
              </tr>
              <tr className="bg-white">
                <td className="py-2.5 px-3 text-center font-bold">3</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-900">Guru Bahasa Arab</td>
                <td className="py-2.5 px-3 font-bold text-neutral-900">{record.peserta3.nama}</td>
                <td className="py-2.5 px-3">{record.peserta3.jabatan}</td>
                <td className="py-2.5 px-3 font-mono">{record.peserta3.whatsapp}</td>
                <td className="py-2.5 px-3 text-neutral-600">
                  {record.peserta3.statusGuru} · Pengalaman: {record.peserta3.lamaMengajar}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Instructions & Official Stamp Area */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t border-neutral-200 text-xs">
          <div className="sm:col-span-8 space-y-2 text-neutral-600">
            <div className="font-bold text-neutral-900">Catatan Penting untuk Peserta:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Harap membawa atau menunjukkan bukti pendaftaran ini saat registrasi ulang di lokasi (Pekalongan).</li>
              <li>Registrasi ulang dan pembagian seminar kit dimulai pukul 10.00 WIB.</li>
              <li>Pakaian: Rapi dan sopan bernuansa formal Al-Irsyad.</li>
              <li>Konfirmasi kehadiran dapat disampaikan ke WhatsApp Panitia: <strong>0812-2557-7889</strong>.</li>
            </ul>
          </div>

          <div className="sm:col-span-4 text-center flex flex-col justify-between pt-2">
            <div>
              <div className="text-neutral-600">Pekalongan, 12 November 2026</div>
              <div className="font-bold text-neutral-900 mt-1">Panitia Pelaksana</div>
            </div>

            <div className="my-3 py-2">
              {/* Seal Representation */}
              <div className="inline-block px-3 py-1.5 border-2 border-emerald-800 text-emerald-800 rounded-md font-bold uppercase tracking-widest text-[10px] transform -rotate-3">
                SEKRETARIAT BERSAMA AL-IRSYAD
              </div>
            </div>

            <div className="border-t border-neutral-300 pt-1 font-bold text-neutral-800">
              ( Tim Verifikasi Pendaftaran )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
