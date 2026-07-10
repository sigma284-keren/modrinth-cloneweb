# XMZ MCMOD

Web browser buat search & download mod, modpack, resource pack, shader, plugin, datapack Minecraft. Sumber data: **Modrinth** (via API resmi mereka, legal, gratis). Developer: **Xemzz**.

File download di-stream langsung lewat server kita sendiri (bukan redirect ke Modrinth), jadi pengalaman download tetap di dalam web dan tetap cepat walau file ratusan MB.

## Fitur

- Search real-time (debounce 400ms)
- Filter by tipe: mod, modpack, resource pack, shader, plugin, datapack
- Detail project + list versi + tombol download langsung
- Download di-proxy/stream lewat server sendiri
- UI glassmorphic dark, Tailwind CSS, Font Awesome 6

## Struktur

```
api/
  search.js      -> proxy ke Modrinth /v2/search
  project.js     -> detail project + list versi
  download.js    -> stream file dari cdn.modrinth.com
public/
  index.html     -> frontend SPA (vanilla JS)
  logo.png       -> logo XMZ MCMOD
vercel.json
package.json
```

## Install & Deploy

Butuh Node.js 18+ dan Vercel CLI.

```bash
npm install -g vercel
vercel login
```

Deploy dari root folder project:

```bash
vercel --prod
```

Untuk coba lokal:

```bash
vercel dev
```

Gak butuh environment variable apapun — semua endpoint publik dan gratis dari Modrinth API.

## Catatan

- Rate limit Modrinth API: 300 request/menit per IP (shared sama semua user yang akses web ini lewat server yang sama)
- Endpoint `/api/download` cuma bisa proxy file dari `cdn.modrinth.com`, domain lain otomatis ditolak
- Semua konten murni hasil dari Modrinth API — data mod, deskripsi, dan file tetap milik masing-masing pembuatnya di Modrinth

## Lisensi

MIT (kode). Konten mod/modpack tetap ikut lisensi masing-masing dari Modrinth.
