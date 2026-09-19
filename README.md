# RunCue

<p align="center">
  <a href="https://github.com/rezkyrevansyah/runcue">
    <img src="https://img.shields.io/github/stars/rezkyrevansyah/runcue?style=for-the-badge&logo=github" alt="GitHub Repo stars" />
  </a>
  <a href="https://github.com/rezkyrevansyah/runcue/issues">
    <img src="https://img.shields.io/github/issues/rezkyrevansyah/runcue?style=for-the-badge" alt="GitHub issues" />
  </a>
  <a href="https://github.com/rezkyrevansyah/runcue/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/rezkyrevansyah/runcue?style=for-the-badge" alt="License" />
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  </a>
</p>

<p align="center">
  <strong>Latihan interval lari & jalan yang fokus pada gerakan, bukan layar.</strong>
</p>

RunCue adalah aplikasi web mobile-first untuk membangun sesi latihan interval Anda sendiri. Anda bisa mengatur durasi pemanasan, lari, jalan, pendinginan, dan repetisi tanpa perlu terus melihat jam. Saat sesi berjalan, aplikasi memberi cue suara otomatis agar Anda tetap fokus pada ritme dan pernapasan.

## Mengapa RunCue?

- Fokus pada latihan tanpa gangguan: tidak perlu melihat layar terus-menerus
- Bikin rutinitas dengan cepat: drag-and-drop style workflow untuk sesi interval
- Cue suara otomatis: instruksi berbasis suara untuk transisi fase latihan
- Mobile-first design: praktis untuk digunakan di ponsel saat berlari atau berjalan
- Local-first: tanpa akun, tanpa database, data tersimpan di perangkat sendiri
- Mudah dimodifikasi: cocok untuk pemula hingga latihan yang lebih kompleks

## Fitur utama

- Membuat dan mengedit latihan interval custom
- Atur urutan langkah seperti pemanasan, lari, jalan, istirahat, cooldown
- Support grup berulang untuk pola seperti run/walk cycle
- Simpan beberapa preset di localStorage
- Tes audio dan volume sebelum mulai latihan
- Player dengan timer, status fase, sisa waktu, dan kontrol cepat
- Desain responsif untuk pengalaman mobile yang nyaman
- Cocok untuk lari santai, joging, dan latihan interval ringan

## Demo

Berikut alur dasar penggunaan:

1. Buat latihan baru
2. Atur urutan langkah dan durasi
3. Simpan preset
4. Tes suara dan bunyi
5. Mulai sesi
6. Fokus pada latihan, bukan jam tangan

## Stack teknologi

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- LocalStorage untuk data lokal

## Instalasi

Clone repository:

```bash
git clone https://github.com/rezkyrevansyah/runcue.git
cd runcue
npm install
npm run dev
```

Buka http://localhost:3000 untuk melihat aplikasi.

## Menjalankan aplikasi

```bash
npm run dev
```

Untuk build produksi:

```bash
npm run build
npm run start
```

## Struktur proyek

```text
.
├── public/
│   └── logo/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── ...
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── LICENSE
└── CONTRIBUTING.md
```

## Roadmap

- [ ] Uji audio yang lebih stabil di perangkat mobile
- [ ] Integrasi mode latihan yang lebih kaya
- [ ] Eksport/import preset
- [ ] Peningkatan UI/UX untuk onboarding
- [ ] Dukungan tema gelap/terang lebih eksplisit
- [ ] Pengalaman interaksi yang lebih kuat untuk runner advanced

## Kontribusi

Kontribusi sangat terbuka. Jika Anda ingin membantu:

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fiturnya`
3. Commit perubahan: `git commit -m "Add some feature"`
4. Push ke GitHub: `git push origin feature/nama-fiturnya`
5. Buka pull request

Silakan lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkapnya.

## Lisensi

Proyek ini dilisensikan di bawah MIT License. Lihat [LICENSE](LICENSE) untuk detail lengkap.

## Tips agar project ini lebih banyak bintang di GitHub

Untuk menarik lebih banyak stars, fokus pada hal berikut:

- Buat README yang jelas dan langsung menjelaskan manfaat produk
- Tampilkan demo singkat atau video layar yang menunjukkan workflow penggunaan
- Gunakan visual yang menarik: logo, banner, screenshot, mockup, atau GIF
- Pastikan repo terlihat aktif: commit teratur, issue terjawab, PR berkelanjutan
- Tulis solusi yang unik: project ini bukan sekadar template, tapi produk yang punya use case nyata
- Bagikan di komunitas seperti r/nextjs, r/webdev, r/fitness, dan grup teknologi lokal
- Tambahkan badge status, install guide, roadmap, dan contribution guide

## Status

RunCue masih dalam tahap pengembangan aktif sebagai aplikasi web mobile-first untuk latihan interval. Ini adalah proyek yang bagus untuk portfolio, eksperimen fitur, dan pengembangan produk nyata yang bisa terus dikembangkan.

<p align="center">
  <a href="https://github.com/rezkyrevansyah/runcue">
    <img src="https://img.shields.io/github/stars/rezkyrevansyah/runcue?style=social" alt="Star this project" />
  </a>
</p>
