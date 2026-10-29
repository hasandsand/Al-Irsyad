# Formulir Pendaftaran Pilot Project Pengajaran Bahasa Arab Bersertifikat
### Penyelenggara: SEKRETARIAT BERSAMA AL-IRSYAD

Aplikasi web modern, responsif, dan siap produksi untuk kegiatan:
**Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat**
- 📅 **Hari/Tanggal:** Kamis, 12 November 2026
- ⏰ **Waktu:** 10.00 – 16.00 WIB
- 📍 **Tempat:** Pekalongan, Jawa Tengah

---

## 🚀 Panduan Memindahkan Project ke Akun Google Lain / AI Studio Baru

### Opsi A: Menggunakan Fitur "Import from GitHub" (Paling Praktis)
1. Di workspace AI Studio asal, klik menu **Export to GitHub** di pojok kanan atas.
2. Hubungkan ke repositori GitHub Anda.
3. Buka akun Google kedua Anda di browser, masuk ke [Google AI Studio](https://aistudio.google.com).
4. Klik **Create Applet** ➡️ pilih **Import from GitHub** dan masukkan repositori tersebut.
5. Aplikasi akan langsung berjalan di akun Google baru Anda!

### Opsi B: Menggunakan File ZIP Cadangan
1. Unduh berkas ZIP project melalui dashboard admin (tombol **"Unduh Project (ZIP)"**) atau endpoint `/api/download-project-zip`.
2. Ekstrak di komputer Anda.
3. Anda dapat mengunggahnya ke repositori GitHub pribadi, lalu mengimpornya ke Google AI Studio akun baru Anda.

---

## 🛠️ Menjalankan Secara Lokal (Local Development)

Jika ingin dijalankan di komputer atau server VPS sendiri:

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server pembangunan
npm run dev

# 3. Buka peramban di
http://localhost:3000
```

---

## 📋 Fitur Utama
1. **Formulir Pendaftaran Bertahap 4 Langkah**:
   - Identitas Lembaga (Yayasan & Sekolah Al-Irsyad se-Indonesia)
   - Data 3 Delegasi Peserta (Pembina Yayasan, Kepala Sekolah, Guru Bahasa Arab)
   - Informasi Eksisting Program & Kesiapan Pilot Project
   - Pernyataan & Konfirmasi Kehadiran
2. **Nomor Pendaftaran Otomatis** format `SBA-2026-XXXX`.
3. **Bukti Pendaftaran Siap Cetak**: Kop resmi Sekretariat Bersama Al-Irsyad dengan logo, kode verifikasi, tabel peserta, dan format cetak/PDF.
4. **Integrasi WhatsApp**:
   - Konfirmasi otomatis ke WhatsApp Penyelenggara.
   - Teruskan notifikasi tanda terima resmi langsung ke nomor WhatsApp PIC.
5. **Dashboard Admin**:
   - Terlindungi login (`admin` / `alirsyad2026`).
   - Metrik real-time & Visualisasi Statistik interaktif (`recharts`).
   - `BarChart`: Distribusi sekolah per provinsi.
   - `PieChart`: Komposisi peserta berdasarkan peran (Pembina, Kepala Sekolah, Guru).
   - Ekspor data lengkap ke CSV/Excel dengan UTF-8 BOM.
   - Konfigurasi WhatsApp panitia & webhook Google Sheets.
