// DompetKeluarga — program penyerahan entry (Node 22, pustaka standar saja).
// Situsnya adalah folder app/ di samping file ini: berkas statis polos yang
// dibuka browser di app/index.html (modul ES, CSS, tanpa langkah build), dan
// isinya tersimpan di berkasnya sendiri: tidak ada yang dijalankan, digaya,
// atau ditampilkan memuat lewat jaringan. Program ini menyerahkannya: menyalin
// app/ dan screenshots/ dari samping file ini ke /output dan menulis
// /output/dossier.json, ringkasan yang dibaca juri (tangkapan layar, berkas
// dan byte muatan pertama, serta sumbernya), dengan pustaka vendor make.fun.
// Biarkan vendor/makefun-frontend.ts apa adanya: penilai mengharuskan
// dossier.json sama persis byte demi byte dengan yang ditulis salinannya.
//
// Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas penilai sendiri (acuan/gate.json): hanya text_max_bytes yang membentuk
// byte; yang lain menolak entry yang akan ditolak penilai (lebih dari 4
// tangkapan layar atau satu di atas 256 KiB; lebih dari 993 berkas dan direktori
// di app/ atau 16 MiB berkas app: app/ dihitung di samping batas 1000 entri
// /output sendiri, berikut screenshots/ dan dossier.json-nya). Menulis dossier
// terakhir supaya isinya selalu mencerminkan app/ dan screenshots/ yang baru
// saja disalin di atas.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

console.log(`DompetKeluarga diserahkan ke ${out}: app/, screenshots/, dossier.json.`);
