import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Trash2, 
  Eye, 
  LogOut, 
  Settings as SettingsIcon, 
  RefreshCw,
  Lock,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  Send,
  MessageCircle,
  FileSpreadsheet,
  BarChart3
} from 'lucide-react';
import { RegistrationRecord, AdminStats, AppSettings } from '../types';
import { storageService, sanitizeWhatsappNumber } from '../services/storageService';
import { VisualStatistics } from './VisualStatistics';

interface AdminDashboardProps {
  onBackToPublic: () => void;
  onViewRecordPass: (record: RegistrationRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToPublic,
  onViewRecordPass,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('alirsyad_admin_token'));
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data state
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'data' | 'settings'>('data');
  const [showCharts, setShowCharts] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Detail Modal & Delete Confirm Modal
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<RegistrationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    panitiaWhatsapp: '6281225577889',
    eventTitle: 'IMPLEMENTASI PILOT PROJECT PENGAJARAN BAHASA ARAB BERSERTIFIKAT',
    eventDate: 'Kamis, 12 November 2026',
    eventTime: '10.00–16.00 WIB',
    eventLocation: 'Pekalongan',
    googleSheetsWebhookUrl: ''
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getRegistrations();
      setRecords(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    const s = await storageService.getSettings();
    setSettings(s);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      // Authenticate against server API to keep credentials protected
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('alirsyad_admin_token', data.token || 'auth_ok');
        setIsAuthenticated(true);
      } else {
        // Fallback check if server offline: default password alirsyad2026
        if (username === 'admin' && password === 'alirsyad2026') {
          sessionStorage.setItem('alirsyad_admin_token', 'local_token');
          setIsAuthenticated(true);
        } else {
          setLoginError('Username atau password admin salah. Silakan coba kembali.');
        }
      }
    } catch {
      // Local fallback
      if (username === 'admin' && password === 'alirsyad2026') {
        sessionStorage.setItem('alirsyad_admin_token', 'local_token');
        setIsAuthenticated(true);
      } else {
        setLoginError('Kredensial tidak valid.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('alirsyad_admin_token');
    setIsAuthenticated(false);
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      await storageService.deleteRegistration(recordToDelete.id);
      setRecordToDelete(null);
      await fetchRecords();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await storageService.saveSettings(settings);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  const handleExportCsv = () => {
    const csvContent = storageService.exportToCsv(filteredRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pendaftaran_Pilot_Project_Bahasa_Arab_Al-Irsyad_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTable = () => {
    window.print();
  };

  // Compute stats
  const stats: AdminStats = storageService.computeStats(records);

  // Filter and sort records
  const uniqueCities = Array.from(new Set(records.map(r => r.kabupatenKota).filter(Boolean)));

  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchQuery = 
      r.nomorPendaftaran?.toLowerCase().includes(q) ||
      r.namaYayasan?.toLowerCase().includes(q) ||
      r.namaSekolah?.toLowerCase().includes(q) ||
      r.namaPic?.toLowerCase().includes(q) ||
      r.kabupatenKota?.toLowerCase().includes(q);

    const matchCity = selectedCity === 'ALL' || r.kabupatenKota === selectedCity;
    const matchStatus = selectedStatus === 'ALL' || r.statusKesiapan === selectedStatus;

    return matchQuery && matchCity && matchStatus;
  }).sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl max-w-md w-full p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-800 to-amber-500" />
          
          <div className="text-center mb-6">
            <img
              src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
              alt="Logo Resmi Al-Irsyad"
              className="w-16 h-16 object-contain mx-auto mb-3"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
              SEKRETARIAT BERSAMA AL-IRSYAD
            </span>
            <h2 className="text-xl font-black text-neutral-900 mt-1">
              Portal Admin Pendaftaran
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Masuk untuk mengelola data peserta, ekspor Excel, dan statistik.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Kredensial Default: admin / alirsyad2026</span>
            <button
              onClick={onBackToPublic}
              className="text-emerald-800 hover:underline font-semibold"
            >
              Halaman Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header / Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/assets/aistudio/file_00000000764482118e98531020648897_90eb88f6.png"
            alt="Logo Resmi Al-Irsyad"
            className="w-12 h-12 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                PANEL PENGELOLA PENDAFTARAN
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Aktif
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">
              Dashboard Sekretariat Bersama Al-Irsyad
            </h1>
            <p className="text-xs text-neutral-500">
              Monitoring Implementasi Pilot Project Pengajaran Bahasa Arab Bersertifikat (12 November 2026)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showCharts
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
            title="Tampilkan atau sembunyikan visualisasi grafik"
          >
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">{showCharts ? 'Sembunyikan Grafik' : 'Statistik Visual'}</span>
            <span className="sm:hidden">Grafik</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'data' ? 'settings' : 'data')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>{activeTab === 'settings' ? 'Data Pendaftar' : 'Pengaturan WhatsApp & Sistem'}</span>
          </button>

          <button
            onClick={fetchRecords}
            className="p-2 text-neutral-600 hover:text-neutral-900 rounded-xl border border-neutral-300 hover:bg-neutral-50 transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS (Requirement 14) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: TOTAL YAYASAN TERDAFTAR */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Total Yayasan Terdaftar
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {stats.totalYayasan}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Lembaga Yayasan Al-Irsyad</div>
          </div>
        </div>

        {/* Metric 2: TOTAL PESERTA */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Total Delegasi Peserta
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {stats.totalPeserta}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              3 Peserta per Yayasan/Sekolah
            </div>
          </div>
        </div>

        {/* Metric 3: TOTAL KEPALA SEKOLAH */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Total Kepala Sekolah
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {stats.totalKepalaSekolah}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Pimpinan Satuan Pendidikan</div>
          </div>
        </div>

        {/* Metric 4: TOTAL GURU BAHASA ARAB */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Total Guru Bahasa Arab
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {stats.totalGuruBahasaArab}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Guru Pengajar Aktif</div>
          </div>
        </div>
      </div>

      {/* VISUAL STATISTICS SECTION (RECHARTS) */}
      {activeTab === 'data' && showCharts && (
        <div className="no-print">
          <VisualStatistics records={records} stats={stats} />
        </div>
      )}

      {/* TAB: DATA PENDAFTAR */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 space-y-6">
          {/* Controls: Search, Filters, Export, Print */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari Yayasan, Sekolah, PIC, No. Pendaftaran..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Kota */}
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                <option value="ALL">Semua Kabupaten/Kota</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Filter Kesiapan */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                <option value="ALL">Semua Status Kesiapan</option>
                <option value="Ya, bersedia mengikuti">Bersedia Mengikuti</option>
                <option value="Masih dalam pembahasan internal">Pembahasan Internal</option>
                <option value="Membutuhkan informasi lebih lanjut">Butuh Info Lanjut</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Urutkan Waktu"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
              </button>

              {/* Export to CSV / Excel */}
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-xs cursor-pointer"
                title="Unduh seluruh baris ke berkas CSV / Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV/Excel</span>
              </button>

              {/* Print Data Table */}
              <button
                onClick={handlePrintTable}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                title="Cetak Ringkasan"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* TABLE (Requirement 14) */}
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-100/80 text-neutral-700 uppercase font-bold tracking-wider border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">No</th>
                  <th className="py-3 px-3">Nomor Pendaftaran</th>
                  <th className="py-3 px-3">Yayasan</th>
                  <th className="py-3 px-3">Sekolah</th>
                  <th className="py-3 px-3">PIC (Kontak)</th>
                  <th className="py-3 px-3 text-center">Jumlah Peserta</th>
                  <th className="py-3 px-3">Status Kesiapan</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-center no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-500">
                      {records.length === 0 ? (
                        <div>
                          <p className="font-semibold text-neutral-700">Belum ada data pendaftar.</p>
                          <p className="text-xs text-neutral-500 mt-1">Formulir pendaftaran siap menerima isian.</p>
                        </div>
                      ) : (
                        <p>Tidak ada data yang sesuai dengan pencarian atau filter.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-neutral-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-900 whitespace-nowrap">
                        {r.nomorPendaftaran}
                      </td>
                      <td className="py-3 px-3 font-medium text-neutral-900 max-w-[180px] truncate" title={r.namaYayasan}>
                        {r.namaYayasan}
                      </td>
                      <td className="py-3 px-3 text-neutral-800 max-w-[180px] truncate" title={r.namaSekolah}>
                        <div className="font-semibold">{r.namaSekolah}</div>
                        <div className="text-[11px] text-neutral-400">{r.kabupatenKota}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-neutral-900">{r.namaPic}</div>
                        <a
                          href={`https://wa.me/${sanitizeWhatsappNumber(r.whatsappPic)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{r.whatsappPic}</span>
                        </a>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          3 Peserta
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[11px] font-medium ${
                          r.statusKesiapan === 'Ya, bersedia mengikuti'
                            ? 'text-emerald-700 font-bold'
                            : r.statusKesiapan === 'Masih dalam pembahasan internal'
                            ? 'text-amber-700'
                            : 'text-neutral-600'
                        }`}>
                          {r.statusKesiapan || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-neutral-500 whitespace-nowrap font-mono">
                        {r.formattedTimestamp || new Date(r.timestamp).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="p-1.5 text-neutral-600 hover:text-emerald-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            title="Lihat Detail Pendaftaran"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewRecordPass(r)}
                            className="p-1.5 text-neutral-600 hover:text-amber-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            title="Cetak Bukti Pendaftaran Resmi"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRecordToDelete(r)}
                            className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
            <span>Menampilkan {filteredRecords.length} dari {records.length} data pendaftaran</span>
            <span className="font-mono">Penyelenggara: Sekretariat Bersama Al-Irsyad Pekalongan</span>
          </div>
        </div>
      )}

      {/* TAB: SETTINGS & KONFIGURASI WHATSAPP (Requirement 15, 19) */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 max-w-3xl space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-bold text-neutral-900">
              Konfigurasi WhatsApp Penyelenggara & Integrasi
            </h3>
            <p className="text-xs text-neutral-500">
              Ubah nomor tujuan WhatsApp panitia dan webhook tanpa perlu mengubah kode sumber.
            </p>
          </div>

          {settingsSavedToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh sistem!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                Nomor WhatsApp Penyelenggara (Sekretariat Bersama Al-Irsyad)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="6281225577889 atau 081225577889"
                  value={settings.panitiaWhatsapp}
                  onChange={e => setSettings({ ...settings, panitiaWhatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Nomor ini yang akan dibuka secara otomatis ketika peserta mengklik tombol <strong>KONFIRMASI VIA WHATSAPP</strong> di halaman bukti pendaftaran.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
                Nama Kegiatan
              </label>
              <input
                type="text"
                value={settings.eventTitle}
                onChange={e => setSettings({ ...settings, eventTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1 uppercase tracking-wide">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={settings.eventDate}
                  onChange={e => setSettings({ ...settings, eventDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1 uppercase tracking-wide">
                  Waktu
                </label>
                <input
                  type="text"
                  value={settings.eventTime}
                  onChange={e => setSettings({ ...settings, eventTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1 uppercase tracking-wide">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={settings.eventLocation}
                  onChange={e => setSettings({ ...settings, eventLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-neutral-800 mb-1 uppercase tracking-wide">
                Google Sheets Webhook URL (Opsional)
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={settings.googleSheetsWebhookUrl || ''}
                onChange={e => setSettings({ ...settings, googleSheetsWebhookUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Jika diisi, setiap pendaftaran baru akan otomatis dikirimkan ke Google Sheets Anda secara real-time via Apps Script / Webhook.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                Simpan Perubahan Pengaturan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Detail Pendaftaran
                </span>
                <div className="text-xl font-black font-mono text-neutral-900">
                  {selectedRecord.nomorPendaftaran}
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* School Info */}
            <div className="bg-neutral-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-neutral-900 text-sm border-b border-neutral-200 pb-1">
                {selectedRecord.namaSekolah} ({selectedRecord.namaYayasan})
              </div>
              <div className="grid grid-cols-2 gap-2 text-neutral-700">
                <div>Alamat: {selectedRecord.alamat}</div>
                <div>Kota: {selectedRecord.kabupatenKota}, {selectedRecord.provinsi}</div>
                <div>PIC: {selectedRecord.namaPic}</div>
                <div>WhatsApp PIC: {selectedRecord.whatsappPic}</div>
                <div>Waktu Daftar: {selectedRecord.formattedTimestamp}</div>
                <div>Status Kesiapan: <strong className="text-emerald-800">{selectedRecord.statusKesiapan}</strong></div>
              </div>
            </div>

            {/* 3 Participants */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-neutral-700 tracking-wide block">
                3 Delegasi Peserta Resmi:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">1. Pembina Yayasan</span>
                  <div className="font-bold text-neutral-900 mt-1">{selectedRecord.peserta1.nama}</div>
                  <div className="text-neutral-600">{selectedRecord.peserta1.jabatan}</div>
                  <div className="text-neutral-500 font-mono mt-1">{selectedRecord.peserta1.whatsapp}</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">2. Kepala Sekolah</span>
                  <div className="font-bold text-neutral-900 mt-1">{selectedRecord.peserta2.nama}</div>
                  <div className="text-neutral-600">{selectedRecord.peserta2.jabatan}</div>
                  <div className="text-neutral-500 font-mono mt-1">{selectedRecord.peserta2.whatsapp}</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">3. Guru Bahasa Arab</span>
                  <div className="font-bold text-neutral-900 mt-1">{selectedRecord.peserta3.nama}</div>
                  <div className="text-neutral-600">{selectedRecord.peserta3.statusGuru} · {selectedRecord.peserta3.lamaMengajar}</div>
                  <div className="text-neutral-500 font-mono mt-1">{selectedRecord.peserta3.whatsapp}</div>
                </div>
              </div>
            </div>

            {/* Program Info & Notes */}
            <div className="bg-neutral-50 p-4 rounded-xl text-xs space-y-2 text-neutral-800">
              <div className="font-bold text-neutral-900">Program Bahasa Arab Eksisting:</div>
              <div>Status: {selectedRecord.programBahasaArab}</div>
              {selectedRecord.programBahasaArab === 'Ya' && (
                <>
                  <div>Kurikulum/Metode: {selectedRecord.kurikulumMetode}</div>
                  <div>Jumlah Siswa: {selectedRecord.jumlahSiswa}</div>
                </>
              )}
              {selectedRecord.pertanyaanKebutuhan && (
                <div className="pt-2 border-t border-neutral-200">
                  <div className="font-bold text-neutral-900">Aspirasi / Pertanyaan:</div>
                  <p className="italic text-neutral-600 mt-0.5">{selectedRecord.pertanyaanKebutuhan}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onViewRecordPass(selectedRecord);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Pendaftaran</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Requirement 17) */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-900">Konfirmasi Hapus Data</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Apakah Anda yakin ingin menghapus data pendaftaran untuk <strong>{recordToDelete.namaSekolah}</strong> ({recordToDelete.nomorPendaftaran})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRecordToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
