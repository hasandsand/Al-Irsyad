import { RegistrationFormData, RegistrationRecord, AppSettings, AdminStats } from '../types';

const STORAGE_KEY_REGISTRATIONS = 'alirsyad_registrations_v1';
const STORAGE_KEY_SETTINGS = 'alirsyad_settings_v1';
const STORAGE_KEY_DRAFT = 'alirsyad_form_draft_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  panitiaWhatsapp: '6281225577889', // Default contact center Sekretariat Bersama Al-Irsyad (dapat diubah di Admin)
  eventTitle: 'IMPLEMENTASI PILOT PROJECT PENGAJARAN BAHASA ARAB BERSERTIFIKAT',
  eventDate: 'Kamis, 12 November 2026',
  eventTime: '10.00–16.00 WIB',
  eventLocation: 'Pekalongan',
  googleSheetsWebhookUrl: ''
};

// Format phone number to clean WhatsApp international standard (e.g., 0812... -> 62812...)
export function sanitizeWhatsappNumber(input: string): string {
  if (!input) return '';
  let clean = input.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '628' + clean.slice(1);
  }
  return clean;
}

// Generate sequential registration number: SBA-2026-0001
export function generateRegistrationNumber(existingRecords: RegistrationRecord[]): string {
  const year = '2026';
  let maxSeq = 0;

  existingRecords.forEach(rec => {
    if (rec.nomorPendaftaran) {
      const match = rec.nomorPendaftaran.match(/SBA-2026-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) {
          maxSeq = num;
        }
      }
    }
  });

  const nextSeq = maxSeq + 1;
  const padded = nextSeq.toString().padStart(4, '0');
  return `SBA-${year}-${padded}`;
}

export function formatWIBDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(date) + ' WIB';
}

class StorageService {
  // Load settings
  async getSettings(): Promise<AppSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        return { ...DEFAULT_SETTINGS, ...data };
      }
    } catch {
      // offline / client fallback
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    return DEFAULT_SETTINGS;
  }

  // Save settings
  async saveSettings(settings: AppSettings): Promise<boolean> {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      return true;
    } catch {
      return true;
    }
  }

  // Get all registrations
  async getRegistrations(): Promise<RegistrationRecord[]> {
    let records: RegistrationRecord[] = [];

    // Try server first
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          records = data;
          // Sync to localStorage
          localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(records));
          return records;
        }
      }
    } catch {
      // Server not reachable, proceed to local storage
    }

    // Fallback to local storage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
      if (stored) {
        records = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse local registrations:', e);
    }

    return records;
  }

  // Save new registration
  async createRegistration(formData: RegistrationFormData): Promise<RegistrationRecord> {
    const existing = await this.getRegistrations();
    const nomorPendaftaran = generateRegistrationNumber(existing);
    const now = new Date();

    const record: RegistrationRecord = {
      ...formData,
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nomorPendaftaran,
      timestamp: now.toISOString(),
      formattedTimestamp: formatWIBDate(now),
      status: 'Terkonfirmasi'
    };

    // Update local storage immediately
    const updated = [record, ...existing];
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(updated));
      // Clear draft on successful submit
      this.clearDraft();
    } catch (e) {
      console.warn('Local storage write error:', e);
    }

    // Try sending to server
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (res.ok) {
        const serverRecord = await res.json();
        return serverRecord;
      }
    } catch {
      // offline is fine, already in local storage
    }

    // Optional webhook integration (Google Sheets or Zapier/Make)
    try {
      const settings = await this.getSettings();
      if (settings.googleSheetsWebhookUrl && settings.googleSheetsWebhookUrl.trim()) {
        fetch(settings.googleSheetsWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        }).catch(() => {});
      }
    } catch {
      // non-blocking
    }

    return record;
  }

  // Delete registration (admin only)
  async deleteRegistration(id: string): Promise<boolean> {
    let existing = await this.getRegistrations();
    existing = existing.filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(existing));
    } catch (e) {
      console.warn(e);
    }

    try {
      await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }

    return true;
  }

  // Get statistics for admin dashboard
  computeStats(records: RegistrationRecord[]): AdminStats {
    const uniqueYayasans = new Set(
      records.map(r => (r.namaYayasan || '').trim().toLowerCase()).filter(Boolean)
    );

    // Each registration has up to 3 participants: Pembina, Kepsek, Guru
    const totalPeserta = records.length * 3;
    const totalKepalaSekolah = records.filter(r => r.peserta2 && r.peserta2.nama).length;
    const totalGuruBahasaArab = records.filter(r => r.peserta3 && r.peserta3.nama).length;
    const totalPembina = records.filter(r => r.peserta1 && r.peserta1.nama).length;

    return {
      totalYayasan: uniqueYayasans.size || records.length,
      totalPeserta,
      totalKepalaSekolah,
      totalGuruBahasaArab,
      totalPembina
    };
  }

  // Draft handling
  saveDraft(data: Partial<RegistrationFormData>) {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(data));
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  }

  getDraft(): Partial<RegistrationFormData> | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (stored) return JSON.parse(stored);
    } catch {
      return null;
    }
    return null;
  }

  clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY_DRAFT);
    } catch {
      // ignore
    }
  }

  // WhatsApp links generator
  createPanitiaWhatsappUrl(record: RegistrationRecord, panitiaNumber: string): string {
    const targetPhone = sanitizeWhatsappNumber(panitiaNumber);
    const yayasanSekolah = `${record.namaYayasan} - ${record.namaSekolah}`;
    const text = `Assalamu'alaikum. Kami dari ${yayasanSekolah} telah melakukan pendaftaran kegiatan Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat yang diselenggarakan oleh Sekretariat Bersama Al-Irsyad pada 12 November 2026 di Pekalongan.\n\nNomor Pendaftaran: ${record.nomorPendaftaran}\n\nTerima kasih.`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
  }

  createNotificationToPicWhatsappUrl(record: RegistrationRecord): string {
    const picPhone = sanitizeWhatsappNumber(record.whatsappPic);
    const text = `*KONFIRMASI BUKTI PENDAFTARAN RESMI*\n` +
      `*SEKRETARIAT BERSAMA AL-IRSYAD*\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Yth. Bapak/Ibu ${record.namaPic} (PIC)\n` +
      `${record.namaSekolah} (${record.namaYayasan})\n\n` +
      `Alhamdulillah, pendaftaran delegasi sekolah Anda untuk kegiatan *Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat* telah kami terima dengan sukses.\n\n` +
      `📋 *DETAIL REGISTRASI:*\n` +
      `• No. Pendaftaran: *${record.nomorPendaftaran}*\n` +
      `• Tanggal: Kamis, 12 November 2026\n` +
      `• Waktu: 10.00–16.00 WIB\n` +
      `• Lokasi: Pekalongan\n\n` +
      `👥 *DELEGASI PESERTA (3 ORANG):*\n` +
      `1. Pembina: ${record.peserta1.nama} (${record.peserta1.jabatan})\n` +
      `2. Kepala Sekolah: ${record.peserta2.nama}\n` +
      `3. Guru Bhs Arab: ${record.peserta3.nama} (${record.peserta3.statusGuru || 'Guru'})\n\n` +
      `Mohon simpan pesan ini sebagai bukti pendaftaran resmi dan konfirmasi saat hadir di lokasi.\n` +
      `Wassalamu'alaikum Wr. Wb.`;

    return `https://wa.me/${picPhone}?text=${encodeURIComponent(text)}`;
  }

  // Export records to CSV format with Excel-friendly UTF-8 BOM
  exportToCsv(records: RegistrationRecord[]): string {
    const headers = [
      'Nomor Pendaftaran',
      'Waktu Pendaftaran',
      'Nama Yayasan',
      'Nama Sekolah',
      'Alamat',
      'Kabupaten/Kota',
      'Provinsi',
      'Nama PIC',
      'WhatsApp PIC',
      'Nama Pembina/Pengurus',
      'Jabatan Pembina/Pengurus',
      'WhatsApp Pembina/Pengurus',
      'Nama Kepala Sekolah',
      'Jabatan Kepala Sekolah',
      'WhatsApp Kepala Sekolah',
      'Nama Guru Bahasa Arab',
      'Jabatan Guru',
      'WhatsApp Guru',
      'Lama Mengajar',
      'Status Guru',
      'Program Bahasa Arab',
      'Kurikulum/Metode',
      'Jumlah Siswa',
      'Status Kesiapan Pilot Project',
      'Pertanyaan/Kebutuhan',
      'Konfirmasi Hadir',
      'Status Pendaftaran'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map(r => [
      r.nomorPendaftaran,
      r.formattedTimestamp || r.timestamp,
      r.namaYayasan,
      r.namaSekolah,
      r.alamat,
      r.kabupatenKota,
      r.provinsi,
      r.namaPic,
      r.whatsappPic,
      r.peserta1?.nama || '',
      r.peserta1?.jabatan || '',
      r.peserta1?.whatsapp || '',
      r.peserta2?.nama || '',
      r.peserta2?.jabatan || '',
      r.peserta2?.whatsapp || '',
      r.peserta3?.nama || '',
      r.peserta3?.jabatan || '',
      r.peserta3?.whatsapp || '',
      r.peserta3?.lamaMengajar || '',
      r.peserta3?.statusGuru || '',
      r.programBahasaArab || '',
      r.kurikulumMetode || '',
      r.jumlahSiswa ?? '',
      r.statusKesiapan || '',
      r.pertanyaanKebutuhan || '',
      r.konfirmasiHadir ? 'Hadir' : 'Tidak',
      r.status || 'Terkonfirmasi'
    ].map(escapeCsv).join(','));

    // Include UTF-8 BOM (\uFEFF) for Microsoft Excel Indonesian character compatibility
    return '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
  }
}

export const storageService = new StorageService();
