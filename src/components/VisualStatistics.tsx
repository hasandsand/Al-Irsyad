import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { MapPin, Users, PieChart as PieIcon, BarChart3, Award } from 'lucide-react';
import { RegistrationRecord, AdminStats } from '../types';

interface VisualStatisticsProps {
  records: RegistrationRecord[];
  stats: AdminStats;
}

const PROVINCE_PALETTE = [
  '#065f46', // emerald-800
  '#047857', // emerald-700
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#b45309', // amber-700
  '#0d9488', // teal-600
  '#0284c7', // sky-600
  '#475569', // slate-600
  '#6366f1', // indigo-500
];

const ROLE_COLORS: Record<string, string> = {
  'Pembina / Pengurus': '#064e3b',
  'Kepala Sekolah': '#d97706',
  'Guru Bahasa Arab': '#047857',
};

export const VisualStatistics: React.FC<VisualStatisticsProps> = ({ records, stats }) => {
  // 1. Distribution of schools by province (for BarChart)
  const provinceData = useMemo(() => {
    const map: Record<string, { count: number; peserta: number }> = {};
    records.forEach(r => {
      const prov = r.provinsi || 'Lainnya';
      if (!map[prov]) {
        map[prov] = { count: 0, peserta: 0 };
      }
      map[prov].count += 1;
      map[prov].peserta += 3; // 3 peserta per pendaftaran sekolah
    });

    return Object.entries(map)
      .map(([provinsi, data]) => ({
        provinsi,
        sekolah: data.count,
        peserta: data.peserta
      }))
      .sort((a, b) => b.sekolah - a.sekolah);
  }, [records]);

  // 2. Total registered participants categorized by role (for PieChart)
  const rolePieData = useMemo(() => {
    return [
      {
        name: 'Pembina / Pengurus',
        roleKey: 'Pembina',
        value: stats.totalPembina,
        fill: '#064e3b', // Deep Islamic Forest Green
        description: 'Unsur Kebijakan Yayasan'
      },
      {
        name: 'Kepala Sekolah',
        roleKey: 'Kepala Sekolah',
        value: stats.totalKepalaSekolah,
        fill: '#d97706', // Warm Gold / Amber
        description: 'Unsur Manajerial Sekolah'
      },
      {
        name: 'Guru Bahasa Arab',
        roleKey: 'Guru',
        value: stats.totalGuruBahasaArab,
        fill: '#047857', // Emerald Green
        description: 'Pendidik Aktif'
      },
    ].filter(item => item.value > 0);
  }, [stats]);

  // Custom Tooltip for BarChart (Distribution by Province)
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 text-white text-xs p-3 rounded-xl shadow-lg border border-neutral-700 space-y-1">
          <div className="font-bold text-amber-300">{label}</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-300">Sekolah Terdaftar:</span>
            <span className="font-mono font-bold text-white">{payload[0]?.value} Lembaga</span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-300">Total Delegasi Peserta:</span>
              <span className="font-mono font-bold text-emerald-400">{payload[1]?.value} Orang</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for PieChart (Participants by Role)
  const CustomRolePieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      const total = stats.totalPeserta || 1;
      const percent = Math.round((data.value / total) * 100);

      return (
        <div className="bg-neutral-900 text-white text-xs p-3 rounded-xl shadow-xl border border-neutral-700 space-y-1 min-w-[170px]">
          <div className="font-bold text-amber-300">{data.name}</div>
          <div className="text-[11px] text-neutral-400">{data.description}</div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-700">
            <span className="text-neutral-300">Jumlah Peserta:</span>
            <span className="font-mono font-bold text-white text-sm">{data.value} Orang</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-300">Proporsi:</span>
            <span className="font-mono font-bold text-emerald-400">{percent}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-8 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-800">
          Statistik Visual Belum Tersedia
        </h3>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Diagram sebaran sekolah berdasarkan provinsi (BarChart) dan kategori peserta berdasarkan peran (PieChart) akan ditampilkan secara otomatis setelah ada data pendaftaran yang masuk.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Statistik Visual Pendaftaran Peserta
            </h3>
            <p className="text-xs text-neutral-500">
              Visualisasi distribusi sekolah per provinsi dan komposisi peserta berdasarkan peran
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs self-start sm:self-auto">
          <span className="text-neutral-600">Total Akumulasi:</span>
          <span className="font-bold text-emerald-900 font-mono">
            {stats.totalYayasan} Sekolah · {stats.totalPeserta} Peserta
          </span>
        </div>
      </div>

      {/* Grid: BarChart & PieChart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Distribusi Sekolah Berdasarkan Provinsi (BarChart) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs sm:text-sm font-bold text-neutral-800 uppercase tracking-wide">
                  Distribusi Sekolah Berdasarkan Provinsi
                </h4>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                {provinceData.length} Wilayah
              </span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provinceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="provinsi"
                    tick={{ fontSize: 11, fill: '#475569' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#475569' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="sekolah"
                    name="Sekolah"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  >
                    {provinceData.map((_, index) => (
                      <Cell
                        key={`bar-cell-${index}`}
                        fill={PROVINCE_PALETTE[index % PROVINCE_PALETTE.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
            <span>
              Provinsi Terbanyak: <strong className="text-neutral-800">{provinceData[0]?.provinsi || '-'} ({provinceData[0]?.sekolah || 0} Lembaga)</strong>
            </span>
            <span className="text-emerald-800 font-semibold">
              Rata-rata 3 Peserta / Lembaga
            </span>
          </div>
        </div>

        {/* CHART 2: Total Peserta Berdasarkan Peran (PieChart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs sm:text-sm font-bold text-neutral-800 uppercase tracking-wide">
                  Peserta Berdasarkan Peran
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {stats.totalPeserta} Peserta
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mb-2">
              Kategori 3 peran delegasi: Pembina, Kepala Sekolah, dan Guru Bahasa Arab.
            </p>

            {/* PieChart container */}
            <div className="w-full h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomRolePieTooltip />} />
                  <Pie
                    data={rolePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {rolePieData.map((entry, index) => (
                      <Cell key={`role-pie-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={9}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center donut label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                <span className="text-xl font-mono font-extrabold text-neutral-900 leading-none">
                  {stats.totalPeserta}
                </span>
                <span className="text-[10px] uppercase font-semibold text-neutral-500 mt-0.5">
                  Peserta
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Role Breakdown Cards */}
          <div className="mt-2 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-900 block truncate">Pembina</span>
              <div className="font-mono font-bold text-sm text-neutral-900 mt-0.5">
                {stats.totalPembina}
              </div>
              <span className="text-[10px] text-neutral-500">Orang</span>
            </div>

            <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="text-[10px] font-bold text-amber-900 block truncate">Kepala Sekolah</span>
              <div className="font-mono font-bold text-sm text-neutral-900 mt-0.5">
                {stats.totalKepalaSekolah}
              </div>
              <span className="text-[10px] text-neutral-500">Orang</span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-900 block truncate">Guru Bhs Arab</span>
              <div className="font-mono font-bold text-sm text-neutral-900 mt-0.5">
                {stats.totalGuruBahasaArab}
              </div>
              <span className="text-[10px] text-neutral-500">Orang</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
