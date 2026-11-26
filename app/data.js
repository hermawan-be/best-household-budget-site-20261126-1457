// data.js — Kategori, data contoh Oktober–November 2026, dan penyimpanan lokal.
// Semua angka dalam rupiah. Tidak ada data yang dikirim ke mana pun: semuanya
// hanya tersimpan di localStorage browser pengguna sendiri.

export const KATEGORI = [
  { id: 'perumahan', nama: 'Perumahan', warna: '#2563eb' },
  { id: 'makanan', nama: 'Makanan', warna: '#ea580c' },
  { id: 'transportasi', nama: 'Transportasi', warna: '#0891b2' },
  { id: 'utilitas', nama: 'Utilitas', warna: '#7c3aed' },
  { id: 'hiburan', nama: 'Hiburan', warna: '#db2777' },
  { id: 'kesehatan', nama: 'Kesehatan', warna: '#059669' },
  { id: 'pendidikan', nama: 'Pendidikan', warna: '#ca8a04' },
  { id: 'tabungan', nama: 'Tabungan', warna: '#0d9488' },
  { id: 'lainnya', nama: 'Lainnya', warna: '#64748b' },
];

export const KUNCI_SIMPAAN = 'dompetkeluarga.v1';

export function namaKategori(id) {
  const k = KATEGORI.find((x) => x.id === id);
  return k ? k.nama : 'Lainnya';
}

export function warnaKategori(id) {
  const k = KATEGORI.find((x) => x.id === id);
  return k ? k.warna : '#64748b';
}

export function formatRupiah(nilai) {
  return 'Rp' + Math.round(nilai).toLocaleString('id-ID');
}

export function namaBulan(kode) {
  const [tahun, bulan] = kode.split('-').map(Number);
  const nama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return nama[bulan - 1] + ' ' + tahun;
}

export function bulanBerikutnya(kode, langkah) {
  const [tahun, bulan] = kode.split('-').map(Number);
  const d = new Date(tahun, bulan - 1 + langkah, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

// Data contoh: satu keluarga, gaji masuk awal bulan, belanja harian tercatat.
export function dataContoh() {
  return {
    transaksi: [
      // ---- Oktober 2026 ----
      { id: 'okt-01', tanggal: '2026-10-01', jenis: 'masuk', kategori: 'lainnya', keterangan: 'Gaji Oktober', jumlah: 8500000 },
      { id: 'okt-02', tanggal: '2026-10-02', jenis: 'keluar', kategori: 'perumahan', keterangan: 'Sewa rumah', jumlah: 1800000 },
      { id: 'okt-03', tanggal: '2026-10-03', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 420000 },
      { id: 'okt-04', tanggal: '2026-10-05', jenis: 'keluar', kategori: 'utilitas', keterangan: 'Listrik PLN', jumlah: 385000 },
      { id: 'okt-05', tanggal: '2026-10-05', jenis: 'keluar', kategori: 'utilitas', keterangan: 'Air PDAM', jumlah: 145000 },
      { id: 'okt-06', tanggal: '2026-10-07', jenis: 'keluar', kategori: 'transportasi', keterangan: 'Bensin motor', jumlah: 120000 },
      { id: 'okt-07', tanggal: '2026-10-08', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 385000 },
      { id: 'okt-08', tanggal: '2026-10-10', jenis: 'keluar', kategori: 'pendidikan', keterangan: 'SPP anak', jumlah: 650000 },
      { id: 'okt-09', tanggal: '2026-10-11', jenis: 'keluar', kategori: 'hiburan', keterangan: 'Nonton bioskop keluarga', jumlah: 180000 },
      { id: 'okt-10', tanggal: '2026-10-13', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 410000 },
      { id: 'okt-11', tanggal: '2026-10-14', jenis: 'keluar', kategori: 'kesehatan', keterangan: 'Obat dan vitamin', jumlah: 95000 },
      { id: 'okt-12', tanggal: '2026-10-15', jenis: 'masuk', kategori: 'lainnya', keterangan: 'Jualan kue tetangga', jumlah: 350000 },
      { id: 'okt-13', tanggal: '2026-10-16', jenis: 'keluar', kategori: 'transportasi', keterangan: 'Servis motor', jumlah: 275000 },
      { id: 'okt-14', tanggal: '2026-10-18', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 395000 },
      { id: 'okt-15', tanggal: '2026-10-20', jenis: 'keluar', kategori: 'utilitas', keterangan: 'Internet rumah', jumlah: 299000 },
      { id: 'okt-16', tanggal: '2026-10-22', jenis: 'keluar', kategori: 'hiburan', keterangan: 'Langganan streaming', jumlah: 54000 },
      { id: 'okt-17', tanggal: '2026-10-24', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar + sembako', jumlah: 520000 },
      { id: 'okt-18', tanggal: '2026-10-25', jenis: 'keluar', kategori: 'tabungan', keterangan: 'Tabungan dana darurat', jumlah: 500000 },
      { id: 'okt-19', tanggal: '2026-10-27', jenis: 'keluar', kategori: 'transportasi', keterangan: 'Bensin motor', jumlah: 110000 },
      { id: 'okt-20', tanggal: '2026-10-29', jenis: 'keluar', kategori: 'lainnya', keterangan: 'Iuran RT dan keamanan', jumlah: 75000 },
      // ---- November 2026 ----
      { id: 'nov-01', tanggal: '2026-11-01', jenis: 'masuk', kategori: 'lainnya', keterangan: 'Gaji November', jumlah: 8500000 },
      { id: 'nov-02', tanggal: '2026-11-02', jenis: 'keluar', kategori: 'perumahan', keterangan: 'Sewa rumah', jumlah: 1800000 },
      { id: 'nov-03', tanggal: '2026-11-03', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 430000 },
      { id: 'nov-04', tanggal: '2026-11-04', jenis: 'keluar', kategori: 'utilitas', keterangan: 'Listrik PLN', jumlah: 402000 },
      { id: 'nov-05', tanggal: '2026-11-05', jenis: 'keluar', kategori: 'utilitas', keterangan: 'Air PDAM', jumlah: 152000 },
      { id: 'nov-06', tanggal: '2026-11-06', jenis: 'keluar', kategori: 'transportasi', keterangan: 'Bensin motor', jumlah: 125000 },
      { id: 'nov-07', tanggal: '2026-11-08', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 398000 },
      { id: 'nov-08', tanggal: '2026-11-10', jenis: 'keluar', kategori: 'pendidikan', keterangan: 'SPP anak', jumlah: 650000 },
      { id: 'nov-09', tanggal: '2026-11-11', jenis: 'keluar', kategori: 'kesehatan', keterangan: 'Periksa gigi anak', jumlah: 210000 },
      { id: 'nov-10', tanggal: '2026-11-12', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 415000 },
      { id: 'nov-11', tanggal: '2026-11-13', jenis: 'keluar', kategori: 'transportasi', keterangan: 'Ojek online', jumlah: 86000 },
      { id: 'nov-12', tanggal: '2026-11-15', jenis: 'masuk', kategori: 'lainnya', keterangan: 'Jualan kue tetangga', jumlah: 420000 },
      { id: 'nov-13', tanggal: '2026-11-16', jenis: 'keluar', kategori: 'hiburan', keterangan: 'Bermain anak di taman', jumlah: 95000 },
      { id: 'nov-14', tanggal: '2026-11-18', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar mingguan', jumlah: 405000 },
      { id: 'nov-15', tanggal: '2026-11-20', jenis: 'keluar', kategori: 'utilitas', keterangan: 'Internet rumah', jumlah: 299000 },
      { id: 'nov-16', tanggal: '2026-11-21', jenis: 'keluar', kategori: 'tabungan', keterangan: 'Tabungan dana darurat', jumlah: 500000 },
      { id: 'nov-17', tanggal: '2026-11-22', jenis: 'keluar', kategori: 'hiburan', keterangan: 'Langganan streaming', jumlah: 54000 },
      { id: 'nov-18', tanggal: '2026-11-24', jenis: 'keluar', kategori: 'transportasi', keterangan: 'Bensin motor', jumlah: 118000 },
      { id: 'nov-19', tanggal: '2026-11-25', jenis: 'keluar', kategori: 'makanan', keterangan: 'Belanja pasar + sembako', jumlah: 545000 },
    ],
    anggaran: {
      perumahan: 1800000,
      makanan: 2000000,
      transportasi: 500000,
      utilitas: 1100000,
      hiburan: 300000,
      kesehatan: 300000,
      pendidikan: 700000,
      tabungan: 500000,
      lainnya: 200000,
    },
  };
}

export function muatData() {
  try {
    const mentah = localStorage.getItem(KUNCI_SIMPAAN);
    if (mentah) {
      const data = JSON.parse(mentah);
      if (data && Array.isArray(data.transaksi) && data.anggaran) return data;
    }
  } catch {
    // Penyimpanan rusak atau tidak tersedia: kembali ke data contoh.
  }
  const contoh = dataContoh();
  simpanData(contoh);
  return contoh;
}

export function simpanData(data) {
  try {
    localStorage.setItem(KUNCI_SIMPAAN, JSON.stringify(data));
  } catch {
    // localStorage penuh atau diblokir: perubahan hanya berlaku di sesi ini.
  }
}

export function kembalikanContoh() {
  const contoh = dataContoh();
  simpanData(contoh);
  return contoh;
}

export function transaksiBulan(data, kodeBulan) {
  return data.transaksi
    .filter((t) => t.tanggal.startsWith(kodeBulan))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export function ringkasanBulan(data, kodeBulan) {
  const daftar = transaksiBulan(data, kodeBulan);
  let masuk = 0;
  let keluar = 0;
  const perKategori = {};
  for (const k of KATEGORI) perKategori[k.id] = 0;
  for (const t of daftar) {
    if (t.jenis === 'masuk') masuk += t.jumlah;
    else {
      keluar += t.jumlah;
      perKategori[t.kategori] = (perKategori[t.kategori] || 0) + t.jumlah;
    }
  }
  const sisa = masuk - keluar;
  const tingkatTabungan = masuk > 0 ? Math.max(0, sisa) / masuk : 0;
  return { masuk, keluar, sisa, tingkatTabungan, perKategori, jumlah: daftar.length };
}
