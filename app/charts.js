// charts.js — Grafik batang dan grafik lingkaran yang digambar di <canvas>.
// Tanpa pustaka apa pun: semua garis, batang, dan irisan dihitung dan digambar
// langsung dari angka yang sama dengan yang ditampilkan di tabel.

import { formatRupiah, namaKategori, warnaKategori } from './data.js';

function siapkanCanvas(canvas, tinggiCss) {
  const rasio = window.devicePixelRatio || 1;
  const lebar = canvas.clientWidth || canvas.parentElement.clientWidth || 300;
  canvas.width = Math.round(lebar * rasio);
  canvas.height = Math.round(tinggiCss * rasio);
  canvas.style.height = tinggiCss + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(rasio, 0, 0, rasio, 0, 0);
  return { ctx, lebar, tinggi: tinggiCss };
}

export function gambarBatang(canvas, perKategori) {
  const { ctx, lebar, tinggi } = siapkanCanvas(canvas, 250);
  const entri = Object.entries(perKategori)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  ctx.clearRect(0, 0, lebar, tinggi);
  if (entri.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pengeluaran bulan ini', lebar / 2, tinggi / 2);
    return;
  }
  const maks = entri[0][1];
  const labelW = 96;
  const barW = Math.min(34, (lebar - labelW - 90) / entri.length - 8);
  const langkah = (lebar - labelW - 12) / entri.length;
  const dasar = tinggi - 62;
  const tinggiMaks = tinggi - 92;
  ctx.font = '12px system-ui, sans-serif';
  entri.forEach(([id, nilai], i) => {
    const x = labelW + i * langkah + (langkah - barW) / 2;
    const h = Math.max(4, (nilai / maks) * tinggiMaks);
    ctx.fillStyle = warnaKategori(id);
    ctx.beginPath();
    ctx.roundRect(x, dasar - h, barW, h, [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText(formatRupiah(nilai).replace('Rp', 'Rp '), x + barW / 2, dasar - h - 6);
    // Label kategori dimiringkan supaya nama panjang tidak bertabrakan.
    ctx.save();
    ctx.translate(x + barW / 2, dasar + 12);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'right';
    ctx.fillText(namaKategori(id), 0, 4);
    ctx.restore();
  });
}

export function gambarLingkaran(canvas, perKategori) {
  const { ctx, lebar, tinggi } = siapkanCanvas(canvas, 220);
  const entri = Object.entries(perKategori)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  ctx.clearRect(0, 0, lebar, tinggi);
  const total = entri.reduce((s, [, v]) => s + v, 0);
  if (total === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pengeluaran bulan ini', lebar / 2, tinggi / 2);
    return;
  }
  const cx = 110;
  const cy = tinggi / 2;
  const r = 84;
  let sudut = -Math.PI / 2;
  for (const [id, nilai] of entri) {
    const porsi = (nilai / total) * Math.PI * 2;
    ctx.fillStyle = warnaKategori(id);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, sudut, sudut + porsi);
    ctx.closePath();
    ctx.fill();
    sudut += porsi;
  }
  // Lubang tengah: donat, dengan total di tengahnya.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Total', cx, cy - 4);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(formatRupiah(total), cx, cy + 14);
  // Legenda di kanan.
  ctx.textAlign = 'left';
  let y = 26;
  for (const [id, nilai] of entri) {
    ctx.fillStyle = warnaKategori(id);
    ctx.fillRect(212, y - 9, 12, 12);
    ctx.fillStyle = '#0f172a';
    ctx.font = '12px system-ui, sans-serif';
    const persen = Math.round((nilai / total) * 100);
    ctx.fillText(`${namaKategori(id)} — ${persen}%`, 230, y + 2);
    y += 22;
  }
}
