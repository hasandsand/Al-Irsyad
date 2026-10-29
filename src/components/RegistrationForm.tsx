import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  School, 
  MapPin, 
  User, 
  Phone, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Sparkles,
  HelpCircle,
  Save
} from 'lucide-react';
import { RegistrationFormData, RegistrationRecord } from '../types';
import { storageService, sanitizeWhatsappNumber } from '../services/storageService';
import { INDONESIA_PROVINCES, SUGGESTED_CITIES } from '../data/indonesiaRegions';

interface RegistrationFormProps {
  onSuccess: (record: RegistrationRecord) => void;
  onCancel: () => void;
}

const INITIAL_FORM_DATA: RegistrationFormData = {
  namaYayasan: '',
  namaSekolah: '',
  alamat: '',
  kabupatenKota: '',
  provinsi: 'Jawa Tengah',
  namaPic: '',
  whatsappPic: '',
  peserta1: {
    nama: '',
    jabatan: 'Pembina Yayasan',
    whatsapp: ''
  },
  peserta2: {
    nama: '',
    jabatan: 'Kepala Sekolah',
    whatsapp: ''
  },
  peserta3: {
    nama: '',
    jabatan: 'Guru Bahasa Arab',
    whatsapp: '',
    lamaMengajar: '',
    statusGuru: 'Guru Tetap'
  },
  programBahasaArab: 'Ya',
  kurikulumMetode: '',
  jumlahSiswa: '',
  statusKesiapan: 'Ya, bersedia mengikuti',
  pertanyaanKebutuhan: '',
  konfirmasiHadir: false,
  konfirmasiBenar: false
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const draft = storageService.getDraft();
    return draft ? { ...INITIAL_FORM_DATA, ...draft } : INITIAL_FORM_DATA;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  // Auto-save draft as user edits
  useEffect(() => {
    storageService.saveDraft(formData);
  }, [formData]);

  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleManualDraftSave = () => {
    storageService.saveDraft(formData);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2500);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.namaYayasan.trim()) newErrors.namaYayasan = 'Nama Yayasan wajib diisi';
      if (!formData.namaSekolah.trim()) newErrors.namaSekolah = 'Nama Sekolah wajib diisi';
      if (!formData.alamat.trim()) newErrors.alamat = 'Alamat Yayasan/Sekolah wajib diisi';
      if (!formData.kabupatenKota.trim()) newErrors.kabupatenKota = 'Kabupaten/Kota wajib diisi';
      if (!formData.provinsi.trim()) newErrors.provinsi = 'Provinsi wajib diisi';
      if (!formData.namaPic.trim()) newErrors.namaPic = 'Nama PIC/Contact Person wajib diisi';
      
      const cleanPicWa = sanitizeWhatsappNumber(formData.whatsappPic);
      if (!formData.whatsappPic.trim()) {
        newErrors.whatsappPic = 'Nomor WhatsApp PIC wajib diisi';
      } else if (cleanPicWa.length < 9) {
        newErrors.whatsappPic = 'Nomor WhatsApp minimal 9 digit angka yang valid';
      }
    }

    if (step === 2) {
      // Peserta 1: Pembina
      if (!formData.peserta1.nama.trim()) newErrors.peserta1_nama = 'Nama Pembina/Pengurus wajib diisi';
      if (!formData.peserta1.jabatan.trim()) newErrors.peserta1_jabatan = 'Jabatan Pembina/Pengurus wajib diisi';
      const cleanP1Wa = sanitizeWhatsappNumber(formData.peserta1.whatsapp);
      if (!formData.peserta1.whatsapp.trim()) {
        newErrors.peserta1_whatsapp = 'Nomor WhatsApp Pembina/Pengurus wajib diisi';
      } else if (cleanP1Wa.length < 9) {
        newErrors.peserta1_whatsapp = 'Nomor WhatsApp tidak valid';
      }

      // Peserta 2: Kepala Sekolah
      if (!formData.peserta2.nama.trim()) newErrors.peserta2_nama = 'Nama Kepala Sekolah wajib diisi';
      if (!formData.peserta2.jabatan.trim()) newErrors.peserta2_jabatan = 'Jabatan Kepala Sekolah wajib diisi';
      const cleanP2Wa = sanitizeWhatsappNumber(formData.peserta2.whatsapp);
      if (!formData.peserta2.whatsapp.trim()) {
        newErrors.peserta2_whatsapp = 'Nomor WhatsApp Kepala Sekolah wajib diisi';
      } else if (cleanP2Wa.length < 9) {
        newErrors.peserta2_whatsapp = 'Nomor WhatsApp tidak valid';
      }

      // Peserta 3: Guru Bahasa Arab
      if (!formData.peserta3.nama.trim()) newErrors.peserta3_nama = 'Nama Guru Bahasa Arab wajib diisi';
      if (!formData.peserta3.jabatan.trim()) newErrors.peserta3_jabatan = 'Jabatan Guru wajib diisi';
      const cleanP3Wa = sanitizeWhatsappNumber(formData.peserta3.whatsapp);
      if (!formData.peserta3.whatsapp.trim()) {
        newErrors.peserta3_whatsapp = 'Nomor WhatsApp Guru wajib diisi';
      } else if (cleanP3Wa.length < 9) {
        newErrors.peserta3_whatsapp = 'Nomor WhatsApp tidak valid';
      }
      if (!formData.peserta3.lamaMengajar.trim()) {
        newErrors.peserta3_lamaMengajar = 'Lama Mengajar Bahasa Arab wajib diisi';
      }
      if (!formData.peserta3.statusGuru) {
        newErrors.peserta3_statusGuru = 'Status Guru wajib dipilih';
      }
    }

    if (step === 3) {
      if (!formData.programBahasaArab) {
        newErrors.programBahasaArab = 'Pilih apakah sekolah telah memiliki program Bahasa Arab';
      }
      if (formData.programBahasaArab === 'Ya') {
        if (!formData.kurikulumMetode?.trim()) {
          newErrors.kurikulumMetode = 'Sebutkan kurikulum atau metode yang saat ini digunakan';
        }
        if (!formData.jumlahSiswa || Number(formData.jumlahSiswa) <= 0) {
          newErrors.jumlahSiswa = 'Masukkan jumlah siswa yang mengikuti pembelajaran';
        }
      }
      if (!formData.statusKesiapan) {
        newErrors.statusKesiapan = 'Pilih kesiapan Yayasan/Sekolah dalam mengikuti pilot project';
      }
    }

    if (step === 4) {
      if (!formData.konfirmasiHadir) {
        newErrors.konfirmasiHadir = 'Pernyataan kehadiran pada 12 November 2026 di Pekalongan wajib dicentang';
      }
      if (!formData.konfirmasiBenar) {
        newErrors.konfirmasiBenar = 'Pernyataan kebenaran data wajib dicentang';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToTop();
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      scrollToTop();
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all steps from 1 to 4
    let valid = true;
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        valid = false;
        break;
      }
    }

    if (!valid) return;

    try {
      setIsSubmitting(true);
      const record = await storageService.createRegistration(formData);
      onSuccess(record);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.' });
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Identitas Lembaga' },
    { num: 2, title: 'Data 3 Peserta' },
    { num: 3, title: 'Info & Kesiapan' },
    { num: 4, title: 'Konfirmasi' }
  ];

  return (
    <div ref={formTopRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Form Header */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-700" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
              alt="Logo Resmi Al-Irsyad"
              className="w-12 h-12 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                SEKRETARIAT BERSAMA AL-IRSYAD
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
                Formulir Pendaftaran Pilot Project Bahasa Arab
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleManualDraftSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              title="Simpan draf sementara"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Draf</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-neutral-500 hover:text-neutral-800 px-2 py-1.5"
            >
              Kembali
            </button>
          </div>
        </div>

        {/* Draft Notification Toast */}
        {draftSavedToast && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Draf formulir Anda berhasil disimpan di perangkat ini. Data tidak akan hilang bila halaman ditutup.</span>
          </div>
        )}

        {/* Step Progress Indicator */}
        <div className="pt-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {steps.map(step => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    // allow clicking past steps or current
                    if (isPast) setCurrentStep(step.num);
                  }}
                  className={`text-left focus:outline-hidden transition-all ${
                    isPast ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      }`}
                    >
                      {isPast ? '✓' : step.num}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline whitespace-nowrap ${
                        isActive ? 'text-emerald-900 font-bold' : isPast ? 'text-emerald-700' : 'text-neutral-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-amber-500' : isPast ? 'bg-emerald-700' : 'bg-neutral-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Error Notice */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Mohon periksa kembali isian formulir:</div>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-red-700">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: IDENTITAS YAYASAN/SEKOLAH */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Bagian 1: Identitas Yayasan & Satuan Pendidikan
                </h3>
                <p className="text-xs text-neutral-500">
                  Data kelembagaan Al-Irsyad dan penanggung jawab penghubung (PIC).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nama Yayasan * */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  1. Nama Yayasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Yayasan Perguruan Al-Irsyad Al-Islamiyyah Pekalongan"
                  value={formData.namaYayasan}
                  onChange={e => setFormData({ ...formData, namaYayasan: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                    errors.namaYayasan ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                  }`}
                />
                {errors.namaYayasan && (
                  <p className="text-xs text-red-600 mt-1">{errors.namaYayasan}</p>
                )}
              </div>

              {/* Nama Sekolah * */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  2. Nama Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMA Islam Al-Irsyad Pekalongan / SMP Al-Irsyad"
                  value={formData.namaSekolah}
                  onChange={e => setFormData({ ...formData, namaSekolah: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                    errors.namaSekolah ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                  }`}
                />
                {errors.namaSekolah && (
                  <p className="text-xs text-red-600 mt-1">{errors.namaSekolah}</p>
                )}
              </div>

              {/* Alamat Yayasan/Sekolah * */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  3. Alamat Yayasan/Sekolah <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Jalan, No., Kelurahan/Desa, Kecamatan..."
                  value={formData.alamat}
                  onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                    errors.alamat ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                  }`}
                />
                {errors.alamat && (
                  <p className="text-xs text-red-600 mt-1">{errors.alamat}</p>
                )}
              </div>

              {/* Kabupaten/Kota * */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  4. Kabupaten/Kota <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="city-suggestions"
                  placeholder="Pilih atau ketik kota (Contoh: Kota Pekalongan)"
                  value={formData.kabupatenKota}
                  onChange={e => setFormData({ ...formData, kabupatenKota: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                    errors.kabupatenKota ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                  }`}
                />
                <datalist id="city-suggestions">
                  {SUGGESTED_CITIES.map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.kabupatenKota && (
                  <p className="text-xs text-red-600 mt-1">{errors.kabupatenKota}</p>
                )}
              </div>

              {/* Provinsi * */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  5. Provinsi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.provinsi}
                  onChange={e => setFormData({ ...formData, provinsi: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                    errors.provinsi ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                  }`}
                >
                  {INDONESIA_PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.provinsi && (
                  <p className="text-xs text-red-600 mt-1">{errors.provinsi}</p>
                )}
              </div>

              {/* Nama PIC/Contact Person * */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  6. Nama PIC / Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Nama lengkap narahubung"
                    value={formData.namaPic}
                    onChange={e => setFormData({ ...formData, namaPic: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                      errors.namaPic ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                    }`}
                  />
                </div>
                {errors.namaPic && (
                  <p className="text-xs text-red-600 mt-1">{errors.namaPic}</p>
                )}
              </div>

              {/* Nomor WhatsApp PIC * */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                  7. Nomor WhatsApp PIC <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx atau 62812xxxxxxxx"
                    value={formData.whatsappPic}
                    onChange={e => setFormData({ ...formData, whatsappPic: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all ${
                      errors.whatsappPic ? 'border-red-400 bg-red-50/30' : 'border-neutral-300'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Digunakan untuk menerima bukti pendaftaran dan konfirmasi resmi.
                </p>
                {errors.whatsappPic && (
                  <p className="text-xs text-red-600 mt-1">{errors.whatsappPic}</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-md"
              >
                <span>Lanjut: Data 3 Peserta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATA 3 PESERTA */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Bagian 2: Data 3 Orang Peserta Delegasi
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Sesuai ketentuan, 1 Yayasan/Sekolah mendaftarkan 3 orang peserta resmi.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                  Maksimal 3 Peserta
                </span>
              </div>

              {/* PESERTA 1: PEMBINA/PENGURUS YAYASAN */}
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                    1
                  </div>
                  <span>Peserta 1 – Pembina/Pengurus Yayasan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap beserta gelar"
                      value={formData.peserta1.nama}
                      onChange={e => setFormData({
                        ...formData,
                        peserta1: { ...formData.peserta1, nama: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta1_nama ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta1_nama && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta1_nama}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Jabatan di Yayasan *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pembina / Ketua Yayasan"
                      value={formData.peserta1.jabatan}
                      onChange={e => setFormData({
                        ...formData,
                        peserta1: { ...formData.peserta1, jabatan: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta1_jabatan ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta1_jabatan && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta1_jabatan}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.peserta1.whatsapp}
                      onChange={e => setFormData({
                        ...formData,
                        peserta1: { ...formData.peserta1, whatsapp: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta1_whatsapp ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta1_whatsapp && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta1_whatsapp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* PESERTA 2: KEPALA SEKOLAH */}
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  <span>Peserta 2 – Kepala Sekolah</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap Kepala Sekolah"
                      value={formData.peserta2.nama}
                      onChange={e => setFormData({
                        ...formData,
                        peserta2: { ...formData.peserta2, nama: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta2_nama ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta2_nama && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta2_nama}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Jabatan *
                    </label>
                    <input
                      type="text"
                      placeholder="Kepala Sekolah"
                      value={formData.peserta2.jabatan}
                      onChange={e => setFormData({
                        ...formData,
                        peserta2: { ...formData.peserta2, jabatan: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta2_jabatan ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta2_jabatan && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta2_jabatan}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.peserta2.whatsapp}
                      onChange={e => setFormData({
                        ...formData,
                        peserta2: { ...formData.peserta2, whatsapp: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta2_whatsapp ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta2_whatsapp && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta2_whatsapp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* PESERTA 3: GURU BAHASA ARAB */}
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                    3
                  </div>
                  <span>Peserta 3 – Guru Bahasa Arab yang Aktif Mengajar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Guru Bahasa Arab"
                      value={formData.peserta3.nama}
                      onChange={e => setFormData({
                        ...formData,
                        peserta3: { ...formData.peserta3, nama: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta3_nama ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta3_nama && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta3_nama}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Jabatan *
                    </label>
                    <input
                      type="text"
                      placeholder="Guru Bahasa Arab"
                      value={formData.peserta3.jabatan}
                      onChange={e => setFormData({
                        ...formData,
                        peserta3: { ...formData.peserta3, jabatan: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta3_jabatan ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta3_jabatan && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta3_jabatan}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.peserta3.whatsapp}
                      onChange={e => setFormData({
                        ...formData,
                        peserta3: { ...formData.peserta3, whatsapp: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta3_whatsapp ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta3_whatsapp && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta3_whatsapp}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Lama Mengajar Bahasa Arab *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 3 Tahun / 5 Tahun"
                      value={formData.peserta3.lamaMengajar}
                      onChange={e => setFormData({
                        ...formData,
                        peserta3: { ...formData.peserta3, lamaMengajar: e.target.value }
                      })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.peserta3_lamaMengajar ? 'border-red-400' : 'border-neutral-300'
                      }`}
                    />
                    {errors.peserta3_lamaMengajar && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta3_lamaMengajar}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Status Kepegawaian Guru *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Guru Tetap', 'Guru Tidak Tetap', 'Lainnya'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            peserta3: { ...formData.peserta3, statusGuru: st }
                          })}
                          className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                            formData.peserta3.statusGuru === st
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    {errors.peserta3_statusGuru && (
                      <p className="text-xs text-red-600 mt-1">{errors.peserta3_statusGuru}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-md"
                >
                  <span>Lanjut: Info Sekolah & Kesiapan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INFORMASI SEKOLAH & KESIAPAN */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Bagian 3: Informasi Sekolah & Kesiapan Pilot Project
                </h3>
                <p className="text-xs text-neutral-500">
                  Pemetaan eksisting kurikulum Bahasa Arab dan kesediaan pilot project.
                </p>
              </div>
            </div>

            {/* Program Bahasa Arab */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Apakah sekolah saat ini telah memiliki program pembelajaran Bahasa Arab? <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {(['Ya', 'Belum'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, programBahasaArab: opt })}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold text-center transition-all ${
                      formData.programBahasaArab === opt
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.programBahasaArab && (
                <p className="text-xs text-red-600">{errors.programBahasaArab}</p>
              )}
            </div>

            {/* Conditional fields if 'Ya' */}
            {formData.programBahasaArab === 'Ya' && (
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4">
                <span className="text-xs font-bold text-emerald-900 block uppercase tracking-wide">
                  Detail Program Pembelajaran Bahasa Arab Saat Ini
                </span>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Kurikulum/metode Bahasa Arab yang digunakan saat ini: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Menggunakan metode Al-Muyassar / Nahwu Shorof terpadu / Kitab Duruusul Lughoh / Kurikulum Kemenag..."
                    value={formData.kurikulumMetode || ''}
                    onChange={e => setFormData({ ...formData, kurikulumMetode: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                      errors.kurikulumMetode ? 'border-red-400' : 'border-neutral-300'
                    }`}
                  />
                  {errors.kurikulumMetode && (
                    <p className="text-xs text-red-600 mt-1">{errors.kurikulumMetode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Jumlah siswa yang mengikuti pembelajaran Bahasa Arab: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Contoh: 150"
                    value={formData.jumlahSiswa || ''}
                    onChange={e => setFormData({ ...formData, jumlahSiswa: e.target.value })}
                    className={`w-full sm:max-w-xs px-4 py-2.5 rounded-xl border text-sm text-neutral-900 bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                      errors.jumlahSiswa ? 'border-red-400' : 'border-neutral-300'
                    }`}
                  />
                  {errors.jumlahSiswa && (
                    <p className="text-xs text-red-600 mt-1">{errors.jumlahSiswa}</p>
                  )}
                </div>
              </div>
            )}

            {/* Kesiapan Mengikuti Pilot Project */}
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Apakah Yayasan/Sekolah bersedia mengikuti Pilot Project Pengajaran Bahasa Arab Bersertifikat? <span className="text-red-500">*</span>
              </label>

              <div className="space-y-2">
                {[
                  'Ya, bersedia mengikuti',
                  'Masih dalam pembahasan internal',
                  'Membutuhkan informasi lebih lanjut'
                ].map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.statusKesiapan === opt
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold shadow-xs'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="statusKesiapan"
                      value={opt}
                      checked={formData.statusKesiapan === opt}
                      onChange={() => setFormData({ ...formData, statusKesiapan: opt as any })}
                      className="text-emerald-800 focus:ring-emerald-600 w-4 h-4"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.statusKesiapan && (
                <p className="text-xs text-red-600">{errors.statusKesiapan}</p>
              )}
            </div>

            {/* Pertanyaan / Hal yang ingin dibahas */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                Hal atau pertanyaan yang ingin dibahas dalam kegiatan:
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan aspirasi, kendala pengajaran saat ini, atau hal spesifik yang diharapkan dalam kegiatan..."
                value={formData.pertanyaanKebutuhan}
                onChange={e => setFormData({ ...formData, pertanyaanKebutuhan: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm text-neutral-900 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-md"
              >
                <span>Lanjut: Konfirmasi Kehadiran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: KONFIRMASI KEHADIRAN & REVIEW */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Bagian 4: Pernyataan & Konfirmasi Kehadiran
                </h3>
                <p className="text-xs text-neutral-500">
                  Periksa ringkasan dan centang pernyataan sebelum mengirimkan formulir resmi.
                </p>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs sm:text-sm">
              <div className="font-bold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span>Ringkasan Calon Peserta</span>
                <span className="text-emerald-800 font-semibold">{formData.kabupatenKota}, {formData.provinsi}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700">
                <div>
                  <span className="text-neutral-500 block text-xs">Yayasan:</span>
                  <span className="font-semibold text-neutral-900">{formData.namaYayasan || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-xs">Sekolah:</span>
                  <span className="font-semibold text-neutral-900">{formData.namaSekolah || '-'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-xs">PIC Pendaftaran:</span>
                  <span>{formData.namaPic} ({formData.whatsappPic})</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-xs">Kesiapan Pilot Project:</span>
                  <span className="font-semibold text-emerald-800">{formData.statusKesiapan}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 space-y-1">
                <span className="text-neutral-500 block text-xs font-semibold">Delegasi 3 Peserta:</span>
                <ol className="list-decimal list-inside space-y-1 text-neutral-800 text-xs">
                  <li><strong>Pembina:</strong> {formData.peserta1.nama} ({formData.peserta1.jabatan}) - {formData.peserta1.whatsapp}</li>
                  <li><strong>Kepala Sekolah:</strong> {formData.peserta2.nama} - {formData.peserta2.whatsapp}</li>
                  <li><strong>Guru Bahasa Arab:</strong> {formData.peserta3.nama} ({formData.peserta3.statusGuru}, pengalam: {formData.peserta3.lamaMengajar}) - {formData.peserta3.whatsapp}</li>
                </ol>
              </div>
            </div>

            {/* Mandatory Checkboxes */}
            <div className="space-y-4 pt-2">
              <label
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.konfirmasiHadir
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : errors.konfirmasiHadir
                    ? 'bg-red-50/50 border-red-400'
                    : 'bg-white border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.konfirmasiHadir}
                  onChange={e => setFormData({ ...formData, konfirmasiHadir: e.target.checked })}
                  className="w-5 h-5 mt-0.5 rounded-sm text-emerald-800 focus:ring-emerald-600 shrink-0"
                />
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  Kami menyatakan akan hadir dalam kegiatan <strong>Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat</strong> pada tanggal <strong>12 November 2026 di Pekalongan</strong>. <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.konfirmasiHadir && (
                <p className="text-xs text-red-600 -mt-2">{errors.konfirmasiHadir}</p>
              )}

              <label
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.konfirmasiBenar
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : errors.konfirmasiBenar
                    ? 'bg-red-50/50 border-red-400'
                    : 'bg-white border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.konfirmasiBenar}
                  onChange={e => setFormData({ ...formData, konfirmasiBenar: e.target.checked })}
                  className="w-5 h-5 mt-0.5 rounded-sm text-emerald-800 focus:ring-emerald-600 shrink-0"
                />
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  Kami menyatakan bahwa data yang kami isi adalah benar dan dapat digunakan untuk keperluan pendataan kegiatan. <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.konfirmasiBenar && (
                <p className="text-xs text-red-600 -mt-2">{errors.konfirmasiBenar}</p>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali Edit</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !formData.konfirmasiHadir || !formData.konfirmasiBenar}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-extrabold text-white rounded-xl transition-all shadow-lg ${
                  isSubmitting || !formData.konfirmasiHadir || !formData.konfirmasiBenar
                    ? 'bg-neutral-400 cursor-not-allowed'
                    : 'bg-emerald-800 hover:bg-emerald-900 active:scale-98 shadow-emerald-900/20 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>MEMPROSES PENDAFTARAN...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-amber-400" />
                    <span>KIRIM PENDAFTARAN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
