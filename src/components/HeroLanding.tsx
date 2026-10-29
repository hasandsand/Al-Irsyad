import React from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, Award, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroLandingProps {
  onStartRegistration: () => void;
  onOpenCheckStatus: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartRegistration,
  onOpenCheckStatus,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Visual Section */}
      <section className="relative overflow-hidden bg-radial from-emerald-900 via-emerald-950 to-neutral-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl border border-emerald-700/30">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Event details & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Institution Badge with Official Logo */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
              <img
                src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
                alt="Logo Al-Irsyad"
                className="w-6 h-6 object-contain rounded-md bg-white p-0.5 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span>SEKRETARIAT BERSAMA AL-IRSYAD</span>
            </div>

            {/* Arabic Calligraphy / Accent Text */}
            <div className="text-amber-200/90 font-arabic text-xl sm:text-2xl tracking-wide select-none">
              بسم الله الرحمن الرحيم · برنامج تعليم اللغة العربية المعتمد
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <span className="block text-xs sm:text-sm font-bold tracking-widest text-emerald-300 uppercase">
                FORMULIR PENDAFTARAN RESMI
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
                IMPLEMENTASI PILOT PROJECT PENGAJARAN BAHASA ARAB BERSERTIFIKAT
              </h1>
            </div>

            {/* Event Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0 text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-neutral-400 text-xs">Hari & Tanggal</div>
                  <div className="font-semibold text-white">Kamis, 12 Nov 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-neutral-400 text-xs">Waktu Kegiatan</div>
                  <div className="font-semibold text-white">10.00–16.00 WIB</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0 text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-neutral-400 text-xs">Tempat</div>
                  <div className="font-semibold text-white">Pekalongan, Jawa Tengah</div>
                </div>
              </div>
            </div>

            {/* Official Description */}
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed border-l-2 border-amber-500/80 pl-4 py-1">
              "Formulir ini digunakan untuk melakukan konfirmasi dan pendataan peserta kegiatan Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat. Mohon mengisi data dengan lengkap dan benar."
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartRegistration}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-emerald-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-400/20 hover:shadow-xl hover:shadow-amber-400/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>DAFTAR SEKARANG</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenCheckStatus}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-medium text-emerald-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Sudah Mendaftar? Cek Bukti</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
              <img
                src="/src/assets/images/alirsyad_arabic_hero_1793146448974.jpg"
                alt="Konferensi Pengajaran Bahasa Arab Al-Irsyad"
                className="w-full h-72 sm:h-84 object-cover object-center transform group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-white/90 bg-emerald-950/80 backdrop-blur-md p-3 rounded-lg border border-emerald-700/50">
                <span className="font-semibold text-amber-300 block mb-0.5">Sekretariat Bersama Al-Irsyad</span>
                Pilot Project Pengajaran Bahasa Arab Bersertifikat dengan standarisasi kompetensi pendidik dan kurikulum terpadu.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Peserta Delegation Guidelines Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Ketentuan Delegasi Lembaga
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Kuota Maksimal 3 Peserta Per Sekolah
          </h2>
          <p className="text-sm text-neutral-600">
            Untuk memastikan implementasi berjalan menyeluruh di tingkat yayasan dan operasional sekolah, setiap lembaga mendaftarkan 3 unsur kunci:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Pembina */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
                1
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  Unsur Kebijakan Yayasan
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">
                  Pembina / Pengurus Yayasan
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Mewakili badan penyelenggara untuk memahami arah kebijakan strategis, komitmen fasilitasi sekolah, dan sinergi implementasi program Bahasa Arab bersertifikat.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Wajib Diisi dalam Formulir</span>
            </div>
          </div>

          {/* Card 2: Kepala Sekolah */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-800 font-bold text-lg">
                2
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  Unsur Manajerial Satuan Pendidikan
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">
                  Kepala Sekolah
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Memimpin alokasi kurikulum, manajemen jam pelajaran, supervisi akademis, dan integrasi pembelajaran Bahasa Arab di tingkat satuan pendidikan.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Wajib Diisi dalam Formulir</span>
            </div>
          </div>

          {/* Card 3: Guru Bahasa Arab */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
                3
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  Unsur Pendidik Aktif
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">
                  Guru Bahasa Arab
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Guru aktif mengajar yang akan menjadi penerima pelatihan kompetensi, metodologi mutakhir pengajaran bersertifikat, dan instruktur pilot project di kelas.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Wajib Diisi dalam Formulir</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rundown & Informasi Pelaksanaan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 border border-emerald-700 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Informasi Pelaksanaan
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Agenda Kegiatan 12 November 2026
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Pertemuan ini menghadirkan perumusan implementasi pilot project, kurikulum standarisasi sertifikasi kompetensi bahasa Arab, serta alur monitoring pendampingan ke seluruh sekolah Al-Irsyad.
              </p>
              <div className="pt-2">
                <button
                  onClick={onStartRegistration}
                  className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-emerald-950/70 p-5 rounded-xl border border-emerald-700/60 divide-y divide-emerald-800/80 text-xs sm:text-sm">
              <div className="py-2.5 flex items-start gap-4">
                <span className="font-mono text-amber-300 font-semibold shrink-0">10.00 – 10.30</span>
                <div>
                  <div className="font-semibold text-white">Registrasi & Pembagian Materi</div>
                  <div className="text-neutral-300 text-xs">Verifikasi nomor pendaftaran peserta & presensi delegasi</div>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-4">
                <span className="font-mono text-amber-300 font-semibold shrink-0">10.30 – 12.00</span>
                <div>
                  <div className="font-semibold text-white">Pembukaan & Sosialisasi Pilot Project</div>
                  <div className="text-neutral-300 text-xs">Sekretariat Bersama Al-Irsyad & Tim Ahli Kurikulum Bahasa Arab</div>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-4">
                <span className="font-mono text-amber-300 font-semibold shrink-0">12.00 – 13.00</span>
                <div>
                  <div className="font-semibold text-white">Ishoma (Istirahat, Sholat Dzuhur & Ramah Tamah)</div>
                  <div className="text-neutral-300 text-xs">Makan siang bersama seluruh pengurus yayasan dan pimpinan sekolah</div>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-4">
                <span className="font-mono text-amber-300 font-semibold shrink-0">13.00 – 15.00</span>
                <div>
                  <div className="font-semibold text-white">Focus Group Discussion (FGD) Kesiapan Teknis</div>
                  <div className="text-neutral-300 text-xs">Metodologi pengajaran bersertifikat, kurikulum, dan pemetaan kelas percontohan</div>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-4">
                <span className="font-mono text-amber-300 font-semibold shrink-0">15.00 – 16.00</span>
                <div>
                  <div className="font-semibold text-white">Penandatanganan Komitmen Bersama & Penutupan</div>
                  <div className="text-neutral-300 text-xs">Pemberian sertifikat keikutsertaan perwakilan lembaga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
