// transactions.js — Tambah, ubah, dan hapus transaksi, lengkap dengan filter
// kategori, filter jenis pemasukan/pengeluaran, dan pencarian keterangan.

import { formatRupiah, KATEGORI, namaKategori, simpanData } from './data.js';

export function tambahTransaksi(data, trx) {
  const id = 'trx-' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  data.transaksi.push({ id, ...trx });
  simpanData(data);
  return id;
}

export function ubahTransaksi(data, id, perubahan) {
  const t = data.transaksi.find((x) => x.id === id);
  if (!t) return false;
  Object.assign(t, perubahan);
  simpanData(data);
  return true;
}

export function hapusTransaksi(data, id) {
  const i = data.transaksi.findIndex((x) => x.id === id);
  if (i === -1) return false;
  data.transaksi.splice(i, 1);
  simpanData(data);
  return true;
}

export function saringTransaksi(daftar, { kategori = 'semua', jenis = 'semua', cari = '' } = {}) {
  const kata = cari.trim().toLowerCase();
  return daftar.filter((t) => {
    if (kategori !== 'semua' && t.kategori !== kategori) return false;
    if (jenis !== 'semua' && t.jenis !== jenis) return false;
    if (kata && !t.keterangan.toLowerCase().includes(kata)) return false;
    return true;
  });
}

function opsiKategori(pilih) {
  return KATEGORI.map((k) => `<option value="${k.id}"${k.id === pilih ? ' selected' : ''}>${k.nama}</option>`).join('');
}

export function renderFormulir(el, { mode = 'tambah', nilai = null, onSimpan, onBatal } = {}) {
  const v = nilai || { tanggal: new Date().toISOString().slice(0, 10), jenis: 'keluar', kategori: 'makanan', keterangan: '', jumlah: '' };
  el.innerHTML = `
    <form id="form-trx" class="form-trx">
      <h3>${mode === 'ubah' ? 'Ubah Transaksi' : 'Tambah Transaksi'}</h3>
      <label>Tanggal <input type="date" name="tanggal" value="${v.tanggal}" required></label>
      <label>Jenis
        <select name="jenis">
          <option value="keluar"${v.jenis === 'keluar' ? ' selected' : ''}>Pengeluaran</option>
          <option value="masuk"${v.jenis === 'masuk' ? ' selected' : ''}>Pemasukan</option>
        </select>
      </label>
      <label>Kategori <select name="kategori">${opsiKategori(v.kategori)}</select></label>
      <label>Keterangan <input type="text" name="keterangan" value="${(v.keterangan || '').replace(/"/g, '&quot;')}" placeholder="cth. Belanja pasar" required maxlength="80"></label>
      <label>Jumlah (Rp) <input type="number" name="jumlah" value="${v.jumlah}" min="1000" step="500" placeholder="100000" required></label>
      <div class="form-aksi">
        <button type="submit" class="btn utama">${mode === 'ubah' ? 'Simpan Perubahan' : 'Simpan Transaksi'}</button>
        <button type="button" class="btn" id="batal-trx">Batal</button>
      </div>
    </form>`;
  el.querySelector('#batal-trx').addEventListener('click', onBatal);
  el.querySelector('#form-trx').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    onSimpan({
      tanggal: String(f.get('tanggal')),
      jenis: String(f.get('jenis')),
      kategori: String(f.get('kategori')),
      keterangan: String(f.get('keterangan')).trim(),
      jumlah: Math.round(Number(f.get('jumlah'))),
    });
  });
}

export function renderDaftar(el, daftar, { onUbah, onHapus } = {}) {
  if (daftar.length === 0) {
    el.innerHTML = '<p class="kosong">Tidak ada transaksi yang cocok dengan filter. Coba ubah filter atau tambah transaksi baru.</p>';
    return;
  }
  el.innerHTML = `
    <table class="tabel">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jenis</th><th class="kanan">Jumlah</th><th>Aksi</th></tr></thead>
      <tbody>
        ${daftar.map((t) => `
          <tr>
            <td>${t.tanggal}</td>
            <td>${t.keterangan.replace(/</g, '&lt;')}</td>
            <td><span class="lencana">${namaKategori(t.kategori)}</span></td>
            <td>${t.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</td>
            <td class="kanan ${t.jenis === 'masuk' ? 'masuk' : 'keluar'}">${t.jenis === 'masuk' ? '+' : '−'} ${formatRupiah(t.jumlah)}</td>
            <td>
              <button class="btn kecil" data-ubah="${t.id}">Ubah</button>
              <button class="btn kecil bahaya" data-hapus="${t.id}">Hapus</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  el.querySelectorAll('[data-ubah]').forEach((b) =>
    b.addEventListener('click', () => onUbah(b.getAttribute('data-ubah'))));
  el.querySelectorAll('[data-hapus]').forEach((b) =>
    b.addEventListener('click', () => {
      if (confirm('Hapus transaksi ini?')) onHapus(b.getAttribute('data-hapus'));
    }));
}
