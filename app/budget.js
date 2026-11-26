// budget.js — Batas belanja bulanan per kategori, bilah pemakaian, dan statusnya:
// Aman (di bawah 80%), Hampir habis (80–100%), LEWAT anggaran (di atas 100%).

import { formatRupiah, KATEGORI, namaKategori, simpanData, warnaKategori } from './data.js';

export function statusAnggaran(terpakai, batas) {
  if (batas <= 0) return { label: 'Belum diatur', kelas: 'netral', persen: 0 };
  const persen = (terpakai / batas) * 100;
  if (persen > 100) return { label: 'LEWAT anggaran', kelas: 'lewat', persen };
  if (persen >= 80) return { label: 'Hampir habis', kelas: 'hampir', persen };
  return { label: 'Aman', kelas: 'aman', persen };
}

export function ubahBatas(data, kategoriId, batasBaru) {
  data.anggaran[kategoriId] = Math.max(0, Math.round(batasBaru));
  simpanData(data);
}

export function renderAnggaran(el, data, perKategori, { onUbahBatas } = {}) {
  el.innerHTML = KATEGORI.map((k) => {
    const terpakai = perKategori[k.id] || 0;
    const batas = data.anggaran[k.id] || 0;
    const s = statusAnggaran(terpakai, batas);
    const lebarBar = Math.min(100, s.persen);
    const sisa = batas - terpakai;
    return `
      <article class="kartu-anggaran">
        <div class="anggaran-kepala">
          <span class="titik" style="background:${warnaKategori(k.id)}"></span>
          <strong>${namaKategori(k.id)}</strong>
          <span class="status ${s.kelas}">${s.label}</span>
        </div>
        <div class="bar-luar"><div class="bar-dalam ${s.kelas}" style="width:${lebarBar}%"></div></div>
        <p class="anggaran-angka">${formatRupiah(terpakai)} dari ${formatRupiah(batas)} <span class="persen">(${Math.round(s.persen)}%)</span></p>
        <p class="anggaran-sisa">${sisa >= 0 ? 'Sisa ' + formatRupiah(sisa) : 'Kelebihan ' + formatRupiah(-sisa)}</p>
        <form class="form-batas" data-kategori="${k.id}">
          <label>Batas bulanan (Rp)
            <input type="number" name="batas" value="${batas}" min="0" step="10000">
          </label>
          <button type="submit" class="btn kecil">Ubah Batas</button>
        </form>
      </article>`;
  }).join('');
  el.querySelectorAll('.form-batas').forEach((f) =>
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const nilai = Number(new FormData(f).get('batas'));
      onUbahBatas(f.getAttribute('data-kategori'), nilai);
    }));
}
