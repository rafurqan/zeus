// src/components/StudentDetailShimmer.tsx

import React from 'react';

// Helper component untuk item detail yang berulang, agar kode utama lebih bersih.
const ShimmerDetailItem = () => (
  <div className="space-y-2">
    {/* Label (baris abu-abu kecil) */}
    <div className="h-3 w-1/3 rounded-md bg-gray-300"></div>
    {/* Value (baris abu-abu lebih besar) */}
    <div className="h-5 w-3/4 rounded-md bg-gray-300"></div>
  </div>
);


const StudentDetailShimmer: React.FC = () => {
  return (
    // Kontainer utama dengan padding, border, dan flex layout
    <div className="flex w-full max-w-7xl gap-8 rounded-lg border border-gray-200 bg-white p-6">
      
      {/* ======================================== */}
      {/* KOLOM KIRI (SIDEBAR)             */}
      {/* ======================================== */}
      <div className="flex w-64 flex-shrink-0 flex-col items-center animate-pulse">
        {/* Avatar */}
        <div className="h-24 w-24 rounded-full bg-gray-300"></div>
        
        {/* Nama Lengkap & Panggilan */}
        <div className="mt-4 h-6 w-3/4 rounded-md bg-gray-300"></div>
        <div className="mt-2 h-5 w-1/2 rounded-md bg-gray-300"></div>

        {/* Status Aktif */}
        <div className="mt-3 h-7 w-16 rounded-full bg-gray-300"></div>

        {/* Grup Info (NISN, Email, dll.) */}
        <div className="mt-8 w-full space-y-5">
          <div className="h-4 w-full rounded-md bg-gray-300"></div>
          <div className="h-4 w-full rounded-md bg-gray-300"></div>
          <div className="h-4 w-full rounded-md bg-gray-300"></div>
          <div className="h-4 w-full rounded-md bg-gray-300"></div>
        </div>

        {/* Status Khusus */}
        <div className="mt-8 h-7 w-40 self-start rounded-full bg-gray-300"></div>
      </div>


      {/* ======================================== */}
      {/* KOLOM KANAN (KONTEN UTAMA)        */}
      {/* ======================================== */}
      <div className="w-full flex-grow animate-pulse">
        {/* Header: Tabs & Tombol Edit */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-end gap-4">
            {/* Tab Aktif (sedikit lebih tinggi dan gelap) */}
            <div className="h-8 w-28 rounded-t-md bg-gray-400"></div>
            {/* Tab Lainnya */}
            <div className="h-7 w-24 rounded-t-md bg-gray-300"></div>
            <div className="h-7 w-24 rounded-t-md bg-gray-300"></div>
            <div className="h-7 w-24 rounded-t-md bg-gray-300"></div>
          </div>
          {/* Tombol Edit Data */}
          <div className="h-8 w-24 rounded-md bg-gray-300"></div>
        </div>

        {/* Judul Halaman & Tanggal */}
        <div className="my-6 flex items-start justify-between">
          <div>
            <div className="h-8 w-64 rounded-md bg-gray-300"></div>
            <div className="mt-2 h-5 w-80 rounded-md bg-gray-300"></div>
          </div>
          {/* Badge Tanggal */}
          <div className="h-8 w-32 flex-shrink-0 rounded-md bg-gray-300"></div>
        </div>

        {/* Grid Detail Informasi Siswa */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* Membuat 18 item shimmer untuk mengisi grid (9 baris x 2 kolom) */}
          {Array.from({ length: 18 }).map((_, index) => (
            <ShimmerDetailItem key={index} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default StudentDetailShimmer;