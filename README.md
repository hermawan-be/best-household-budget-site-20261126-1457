# DompetKeluarga — Anggaran Rumah Tangga

[![Best Household Budget Site](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/hermawan-be/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/hermawan-be/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

DompetKeluarga adalah situs anggaran rumah tangga berbahasa Indonesia yang
berjalan sepenuhnya di browser — tanpa server, tanpa jaringan. Catat pemasukan
dan pengeluaran per kategori, atur batas belanja bulanan, bandingkan dua bulan
terakhir, dapatkan tips hemat dari angka bulan berjalan, dan hitung tabungan
bulanan untuk mencapai targetmu.

## Fitur

- **Dasbor**: total pemasukan, pengeluaran, sisa uang, dan tingkat tabungan
  bulan yang dipilih, plus grafik batang dan grafik lingkaran pengeluaran
  per kategori.
- **Transaksi**: tambah, ubah, dan hapus pemasukan/pengeluaran, dengan filter
  kategori, filter jenis, dan pencarian keterangan.
- **Anggaran**: batas belanja bulanan per kategori dengan bilah pemakaian dan
  status Aman, Hampir habis, dan LEWAT anggaran.
- **Laporan**: perbandingan pemasukan–pengeluaran dua bulan terakhir dan
  rincian terpakai versus anggaran per kategori.
- **Tips & Kalkulator**: tips hemat yang dihitung dari angka bulan berjalan
  dan kalkulator target tabungan (target + jangka waktu = tabungan per bulan).
- **Ganti bulan**: tombol bulan sebelum/sesudah dan pemilih bulan; data contoh
  Oktober dan November 2026 sudah dimuat.
- **Privasi**: semua perubahan tersimpan di localStorage browser sendiri;
  tidak ada data yang dikirim ke mana pun. Tombol "Kembalikan Data Contoh"
  mengembalikan data contoh kapan saja.

## Cara menjalankan

Buka `app/index.html` langsung di browser, atau jalankan server statis lokal:

```sh
cd app
python3 -m http.server 8080
```

Lalu buka http://localhost:8080 di browser desktop maupun HP.

## Struktur

- `app/index.html` — semua halaman (dasbor, transaksi, anggaran, laporan, tips)
- `app/style.css` — seluruh gaya situs
- `app/data.js` — kategori, data contoh, penyimpanan lokal
- `app/charts.js` — grafik batang dan lingkaran di canvas
- `app/transactions.js` — logika tambah/ubah/hapus dan filter transaksi
- `app/budget.js` — logika batas anggaran dan status pemakaian
- `app/app.js` — router, dasbor, laporan, tips, dan kalkulator
- `main.ts` — program penyerahan (Node 22, pustaka standar saja)

## Lisensi

MIT — lihat file `LICENSE`.
