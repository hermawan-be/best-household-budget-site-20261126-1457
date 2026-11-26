// app.js — Router hash, dasbor, laporan, tips hemat, dan kalkulator target tabungan.
// Semua halaman adalah bagian dari satu index.html; pindah halaman lewat #/rute.

import {
  bulanBerikutnya, formatRupiah, KATEGORI, kembalikanContoh, muatData,
  namaBulan, namaKategori, ringkasanBulan, simpanData, transaksiBulan,
} from './data.js';
import { gambarBatang, gambarLingkaran } from './charts.js';
import { hapusTransaksi, renderDaftar, renderFormulir, saringTransaksi, tambahTransaksi, ubahTransaksi } from './transactions.js';
import { renderAnggaran, ubahBatas } from './budget.js';

let data = muatData();
let bulan = '2026-11';
let filter = { kategori: 'semua', jenis: 'semua', cari: '' };
let editId = null;

const $ = (id) => document.getElementById(id);

function ruteAktif() {
  const r = location.hash.replace(/^#\/?/, '') || 'dasbor';
  return ['dasbor', 'transaksi', 'anggaran', 'laporan', 'tips'].includes(r) ? r : 'dasbor';
}

function tampilkanRute() {
  const r = ruteAktif();
  document.querySelectorAll('.halaman').forEach((s) => s.classList.toggle('aktif', s.id === 'hal-' + r));
  document.querySelectorAll('.nav a').forEach((a) =>
    a.classList.toggle('aktif', a.getAttribute('href') === '#/' + r));
  if (r === 'dasbor') renderDasbor();
  if (r === 'transaksi') renderTransaksi();
  if (r === 'anggaran') renderAnggaranHalaman();
  if (r === 'laporan') renderLaporan();
  if (r === 'tips') renderTips();
  window.scrollTo(0, 0);
}

function perbaruiPemilihBulan() {
  $('label-bulan').textContent = namaBulan(bulan);
  $('input-bulan').value = bulan;
}

function renderDasbor() {
  const r = ringkasanBulan(data, bulan);
  $('kartu-masuk').textContent = formatRupiah(r.masuk);
  $('kartu-keluar').textContent = formatRupiah(r.keluar);
  $('kartu-sisa').textContent = formatRupiah(r.sisa);
  $('kartu-sisa').classList.toggle('negatif', r.sisa < 0);
  $('kartu-tabungan').textContent = Math.round(r.tingkatTabungan * 100) + '%';
  $('subjudul-dasbor').textContent = `Ringkasan ${namaBulan(bulan)} — ${r.jumlah} transaksi tercatat.`;
  gambarBatang($('grafik-batang'), r.perKategori);
  gambarLingkaran($('grafik-lingkaran'), r.perKategori);
  const terbesar = Object.entries(r.perKategori).sort((a, b) => b[1] - a[1])[0];
  $('catatan-dasbor').textContent = terbesar && terbesar[1] > 0
    ? `Kategori terbesar bulan ini: ${namaKategori(terbesar[0])} (${formatRupiah(terbesar[1])}). Lihat halaman Anggaran untuk mengatur batasnya.`
    : 'Belum ada pengeluaran bulan ini. Tambah transaksi di halaman Transaksi.';
}

function renderTransaksi() {
  const daftar = saringTransaksi(transaksiBulan(data, bulan), filter);
  renderDaftar($('daftar-transaksi'), daftar, {
    onUbah: (id) => {
      editId = id;
      const t = data.transaksi.find((x) => x.id === id);
      renderFormulir($('wadah-formulir'), {
        mode: 'ubah', nilai: t,
        onSimpan: (perubahan) => { ubahTransaksi(data, id, perubahan); editId = null; renderTransaksi(); },
        onBatal: () => { editId = null; renderTransaksi(); },
      });
      $('wadah-formulir').scrollIntoView({ behavior: 'smooth' });
    },
    onHapus: (id) => { hapusTransaksi(data, id); renderTransaksi(); },
  });
  $('ringkasan-filter').textContent =
    `${daftar.length} transaksi ditampilkan dari ${transaksiBulan(data, bulan).length} transaksi ${namaBulan(bulan)}.`;
  if (!editId) {
    renderFormulir($('wadah-formulir'), {
      onSimpan: (trx) => { tambahTransaksi(data, trx); renderTransaksi(); },
      onBatal: () => renderTransaksi(),
    });
  }
}

function renderAnggaranHalaman() {
  const r = ringkasanBulan(data, bulan);
  const totalBatas = KATEGORI.reduce((s, k) => s + (data.anggaran[k.id] || 0), 0);
  $('ringkasan-anggaran').textContent =
    `Total batas belanja ${namaBulan(bulan)}: ${formatRupiah(totalBatas)} — terpakai ${formatRupiah(r.keluar)}.`;
  renderAnggaran($('daftar-anggaran'), data, r.perKategori, {
    onUbahBatas: (kategoriId, nilai) => { ubahBatas(data, kategoriId, nilai); renderAnggaranHalaman(); },
  });
}

function renderLaporan() {
  const kini = ringkasanBulan(data, bulan);
  const lalu = ringkasanBulan(data, bulanBerikutnya(bulan, -1));
  const selisih = (a, b) => (a - b >= 0 ? '+' : '−') + ' ' + formatRupiah(Math.abs(a - b));
  $('laporan-perbandingan').innerHTML = `
    <table class="tabel">
      <thead><tr><th></th><th>${namaBulan(bulanBerikutnya(bulan, -1))}</th><th>${namaBulan(bulan)}</th><th>Perubahan</th></tr></thead>
      <tbody>
        <tr><td>Pemasukan</td><td>${formatRupiah(lalu.masuk)}</td><td>${formatRupiah(kini.masuk)}</td><td>${selisih(kini.masuk, lalu.masuk)}</td></tr>
        <tr><td>Pengeluaran</td><td>${formatRupiah(lalu.keluar)}</td><td>${formatRupiah(kini.keluar)}</td><td>${selisih(kini.keluar, lalu.keluar)}</td></tr>
        <tr><td>Sisa uang</td><td>${formatRupiah(lalu.sisa)}</td><td>${formatRupiah(kini.sisa)}</td><td>${selisih(kini.sisa, lalu.sisa)}</td></tr>
        <tr><td>Tingkat tabungan</td><td>${Math.round(lalu.tingkatTabungan * 100)}%</td><td>${Math.round(kini.tingkatTabungan * 100)}%</td><td>${Math.round((kini.tingkatTabungan - lalu.tingkatTabungan) * 100)} poin</td></tr>
      </tbody>
    </table>`;
  $('laporan-kategori').innerHTML = `
    <table class="tabel">
      <thead><tr><th>Kategori</th><th class="kanan">Terpakai</th><th class="kanan">Anggaran</th><th class="kanan">Sisa / Kelebihan</th></tr></thead>
      <tbody>
        ${KATEGORI.map((k) => {
          const pakai = kini.perKategori[k.id] || 0;
          const batas = data.anggaran[k.id] || 0;
          const sel = batas - pakai;
          return `<tr><td>${namaKategori(k.id)}</td><td class="kanan">${formatRupiah(pakai)}</td><td class="kanan">${formatRupiah(batas)}</td><td class="kanan ${sel < 0 ? 'keluar' : 'masuk'}">${sel >= 0 ? 'Sisa ' + formatRupiah(sel) : 'Lewat ' + formatRupiah(-sel)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function renderTips() {
  const r = ringkasanBulan(data, bulan);
  const tips = [];
  const entri = Object.entries(r.perKategori).sort((a, b) => b[1] - a[1]);
  if (entri.length > 0 && entri[0][1] > 0) {
    tips.push(`Kategori terbesarmu bulan ini adalah ${namaKategori(entri[0][0])} (${formatRupiah(entri[0][1])}). Coba potong 10% dari kategori ini bulan depan — itu ${formatRupiah(entri[0][1] * 0.1)} yang bisa pindah ke tabungan.`);
  }
  const batasMakanan = data.anggaran.makanan || 0;
  const pakaiMakanan = r.perKategori.makanan || 0;
  if (batasMakanan > 0 && pakaiMakanan > batasMakanan * 0.8) {
    tips.push(`Belanja makanan sudah ${Math.round((pakaiMakanan / batasMakanan) * 100)}% dari anggaran. Masak di rumah tiga kali seminggu bisa menghemat sekitar ${formatRupiah(pakaiMakanan * 0.15)} sebulan.`);
  }
  if (r.tingkatTabungan < 0.1) {
    tips.push(`Tingkat tabunganmu ${Math.round(r.tingkatTabungan * 100)}% — di bawah 10%. Sisihkan tabungan di awal gajian, sebelum belanja, supaya tidak habis duluan.`);
  } else {
    tips.push(`Tingkat tabunganmu ${Math.round(r.tingkatTabungan * 100)}% — bagus, sudah di atas 10%. Pertahankan dengan menjaga pengeluaran hiburan tetap di bawah anggaran.`);
  }
  const hiburan = r.perKategori.hiburan || 0;
  if (hiburan > 0) tips.push(`Hiburan bulan ini ${formatRupiah(hiburan)}. Ganti satu kali nonton di luar dengan malam film di rumah dan simpan selisihnya.`);
  $('daftar-tips').innerHTML = tips.map((t) => `<li>${t}</li>`).join('');
  $('ringkasan-tips').textContent = `Dihitung dari angka ${namaBulan(bulan)}: pemasukan ${formatRupiah(r.masuk)}, pengeluaran ${formatRupiah(r.keluar)}.`;
}

function hitungKalkulator() {
  const target = Number($('calc-target').value) || 0;
  const bulanTarget = Number($('calc-bulan').value) || 0;
  if (target > 0 && bulanTarget > 0) {
    const perBulan = Math.ceil(target / bulanTarget);
    $('calc-hasil').textContent =
      `Untuk mencapai ${formatRupiah(target)} dalam ${bulanTarget} bulan, tabung ${formatRupiah(perBulan)} setiap bulan.`;
  } else {
    $('calc-hasil').textContent = 'Isi target dan jangka waktu untuk melihat tabungan bulanannya.';
  }
}

function pasangKontrolBulan() {
  $('btn-sebelum').addEventListener('click', () => { bulan = bulanBerikutnya(bulan, -1); perbaruiPemilihBulan(); tampilkanRute(); });
  $('btn-sesudah').addEventListener('click', () => { bulan = bulanBerikutnya(bulan, 1); perbaruiPemilihBulan(); tampilkanRute(); });
  $('input-bulan').addEventListener('change', (e) => { bulan = e.target.value || bulan; perbaruiPemilihBulan(); tampilkanRute(); });
  $('btn-contoh').addEventListener('click', () => {
    if (confirm('Kembalikan semua data ke data contoh Oktober–November 2026? Perubahanmu akan hilang.')) {
      data = kembalikanContoh();
      tampilkanRute();
    }
  });
}

function pasangFilter() {
  $('filter-kategori').innerHTML = '<option value="semua">Semua kategori</option>' +
    KATEGORI.map((k) => `<option value="${k.id}">${k.nama}</option>`).join('');
  $('filter-kategori').addEventListener('change', (e) => { filter.kategori = e.target.value; renderTransaksi(); });
  $('filter-jenis').addEventListener('change', (e) => { filter.jenis = e.target.value; renderTransaksi(); });
  $('filter-cari').addEventListener('input', (e) => { filter.cari = e.target.value; renderTransaksi(); });
}

function pasangKalkulator() {
  $('calc-target').addEventListener('input', hitungKalkulator);
  $('calc-bulan').addEventListener('input', hitungKalkulator);
  $('calc-form').addEventListener('submit', (e) => { e.preventDefault(); hitungKalkulator(); });
}

perbaruiPemilihBulan();
pasangKontrolBulan();
pasangFilter();
pasangKalkulator();
window.addEventListener('hashchange', tampilkanRute);
window.addEventListener('resize', () => { if (ruteAktif() === 'dasbor') renderDasbor(); });
tampilkanRute();
