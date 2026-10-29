export interface Participant1 {
  nama: string;
  jabatan: string;
  whatsapp: string;
}

export interface Participant2 {
  nama: string;
  jabatan: string;
  whatsapp: string;
}

export interface Participant3 {
  nama: string;
  jabatan: string;
  whatsapp: string;
  lamaMengajar: string;
  statusGuru: 'Guru Tetap' | 'Guru Tidak Tetap' | 'Lainnya' | '';
}

export interface RegistrationFormData {
  // Identitas Yayasan & Sekolah
  namaYayasan: string;
  namaSekolah: string;
  alamat: string;
  kabupatenKota: string;
  provinsi: string;
  namaPic: string;
  whatsappPic: string;

  // 3 Peserta
  peserta1: Participant1; // Pembina/Pengurus Yayasan
  peserta2: Participant2; // Kepala Sekolah
  peserta3: Participant3; // Guru Bahasa Arab

  // Informasi Sekolah
  programBahasaArab: 'Ya' | 'Belum' | '';
  kurikulumMetode?: string;
  jumlahSiswa?: string | number;

  // Kesiapan
  statusKesiapan: 'Ya, bersedia mengikuti' | 'Masih dalam pembahasan internal' | 'Membutuhkan informasi lebih lanjut' | '';
  pertanyaanKebutuhan: string;

  // Konfirmasi
  konfirmasiHadir: boolean;
  konfirmasiBenar: boolean;
}

export interface RegistrationRecord extends RegistrationFormData {
  id: string;
  nomorPendaftaran: string; // e.g. SBA-2026-0001
  timestamp: string; // ISO string
  formattedTimestamp: string;
  status: 'Terkonfirmasi' | 'Menunggu Konfirmasi' | 'Hadir';
}

export interface AppSettings {
  panitiaWhatsapp: string; // WhatsApp number for Panitia e.g. "6281234567890"
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  googleSheetsWebhookUrl?: string;
}

export interface AdminStats {
  totalYayasan: number;
  totalPeserta: number;
  totalKepalaSekolah: number;
  totalGuruBahasaArab: number;
  totalPembina: number;
}
