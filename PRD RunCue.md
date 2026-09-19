# Product Requirements Document RunCue

**Versi:** 1.0 · **Tanggal:** 19 September 2026 · **Status:** Siap dibangun sebagai MVP

## 1. Ringkasan produk

RunCue adalah web app mobile untuk menyusun latihan interval dan menerima instruksi suara saat berpindah tahap, sehingga pengguna dapat berlari dan berjalan tanpa terus melihat jam. Pengguna dapat mengubah setiap tahap, durasi, urutan, dan jumlah pengulangan. Aplikasi berjalan tanpa akun atau database; konfigurasi disimpan di perangkat.

**Contoh awal:** pemanasan jalan 5:00 → [lari 1:00 → jalan 2:00] × 8 → pendinginan jalan 5:00. Total 34:00. Ini hanya preset contoh, bukan batasan engine.

**Keputusan produk terpenting:** ketepatan cue ketika browser di latar belakang atau layar terkunci harus dibuktikan di perangkat Android nyata. Timestamp dapat mengoreksi tampilan waktu setelah aplikasi aktif lagi, tetapi tidak menjamin browser sempat mengucapkan instruksi tepat waktu ketika prosesnya ditunda oleh sistem. Karena itu, klaim “berfungsi dengan layar terkunci” baru boleh dibuat sesudah uji perangkat lulus.

## 2. Masalah, sasaran, dan metrik

**Masalah:** dalam sesi lari dan jalan bergantian, pengguna harus menghitung waktu dan melihat HP berulang kali. Ini mengganggu latihan, terlebih ketika langkah latihan berubah dari minggu ke minggu.

**Pengguna awal:** pelari pemula yang mengikuti program run/walk, menggunakan Android dan headset, serta ingin membuat sendiri rangkaian latihan. Desain harus tetap berguna bagi pengguna interval lain tanpa istilah yang terlalu khusus lari.

**Sasaran MVP:**

1. Pengguna bisa membuat atau mengubah sesi tanpa kode.
2. Pengguna memahami tahap saat ini, tahap berikutnya, repetisi, dan sisa waktu sekilas.
3. Cue suara dan bunyi tersedia pada perpindahan tahap selama browser mengizinkannya.
4. Preset tetap tersedia setelah halaman dibuka kembali di browser dan perangkat yang sama.
5. Produk secara jujur memberi tahu keterbatasan pemutaran audio saat layar terkunci.

**Ukuran keberhasilan pilot:** 5 dari 5 sesi uji dengan layar menyala memberi cue untuk seluruh perpindahan tahap, tanpa tahap terlewati atau cue ganda; sekurangnya 4 dari 5 pengguna uji dapat mengubah durasi dan memulai sesi tanpa bantuan; hasil uji layar terkunci dicatat terpisah per perangkat dan browser. Angka ini target validasi awal, bukan klaim performa yang sudah tercapai.

## 3. Ruang lingkup

### Dalam MVP

- Pembuat latihan berbasis urutan langkah bebas: Jalan/Pemanasan, Lari, Jalan, Pendinginan, Istirahat, atau Kustom.
- Langkah tunggal dan grup langkah berulang; grup dapat berisi dua atau lebih langkah, misalnya Lari → Jalan, sebanyak N putaran.
- Tambah, ubah, duplikasi, hapus, dan susun ulang langkah atau grup.
- Nama latihan; buat, simpan, buka, duplikasi, dan hapus preset lokal.
- Pratinjau urutan yang telah diekspansi dan total durasi sebelum mulai.
- Player latihan: mulai, jeda, lanjut, lewati, kembali ke awal tahap sebelumnya, akhiri.
- Cue suara Bahasa Indonesia dan bunyi; tombol tes audio; pengaturan volume mengikuti perangkat.
- Tampilan responsif untuk HP, status audio, dan peringatan untuk batasan browser.

### Di luar MVP

Akun dan sinkronisasi lintas perangkat; database; GPS, jarak, pace, kalori, dan integrasi smartwatch/Strava; program latihan otomatis; analitik riwayat; editor teks bebas untuk voice message; pengingat kalender; dukungan offline yang dijanjikan; aplikasi native. PWA dapat dievaluasi sesudah uji browser, tetapi pemasangannya sendiri tidak boleh diasumsikan menjamin cue saat layar terkunci.

## 4. Alur pengguna

1. Buka aplikasi → lihat preset contoh dan tombol buat latihan.
2. Ubah nama latihan dan susun langkah atau grup berulang → lihat total waktu dan daftar urutan yang akan dimainkan.
3. Simpan preset jika diinginkan → sambungkan headset → tekan **Tes suara** → atur volume HP.
4. Tekan **Mulai** melalui interaksi pengguna → player menampilkan tahap pertama dan mengucapkan instruksi jika audio aktif.
5. Saat batas tahap terlewati → tampilkan tahap berikutnya, bunyikan cue, ucapkan instruksi, dan perbarui indikator repetisi.
6. Pengguna dapat jeda, lanjut, lewati tahap, kembali, atau akhiri dengan konfirmasi.
7. Tahap terakhir selesai → cue selesai dan layar ringkasan sederhana berisi nama latihan, waktu terencana, dan waktu aktual sejak mulai termasuk jeda yang ditandai terpisah.

Jika browser kehilangan kesempatan menjalankan cue saat tersembunyi, ketika kembali aktif aplikasi menghitung posisi yang benar dan menampilkan informasi **“Beberapa instruksi mungkin tidak terdengar saat aplikasi di latar belakang.”** Aplikasi tidak membacakan antrean cue yang sudah terlewat.

## 5. Persyaratan fungsional

| ID | Prioritas | Persyaratan dan hasil yang bisa diuji |
| --- | --- | --- |
| FR-01 | P0 | Preset contoh berisi pemanasan 5:00, grup Lari 1:00 + Jalan 2:00 × 8, pendinginan 5:00; total 34:00. Semua nilainya dapat diubah. |
| FR-02 | P0 | Setiap langkah memiliki jenis, label, dan durasi dalam detik. Editor menerima menit dan detik, termasuk 1:30. Durasi harus >0; durasi 0 dilarang. |
| FR-03 | P0 | Tambah, hapus, duplikasi, dan urutkan ulang langkah; perubahan langsung memperbarui pratinjau dan total durasi. |
| FR-04 | P0 | Grup berulang dapat berisi ≥2 langkah dan jumlah putaran 1–99. Tampilan editor membedakan urutan grup dari urutan latihan keseluruhan. |
| FR-05 | P0 | Validasi mencegah mulai jika tidak ada langkah valid, ada durasi invalid, atau total melebihi batas aplikasi 4 jam. Tampilkan pesan di dekat masukan bermasalah. |
| FR-06 | P0 | Player menampilkan label tahap, hitung mundur mm:ss, tahap berikutnya, repetisi saat ada, progres sesi, total tersisa, dan kontrol besar. |
| FR-07 | P0 | Perpindahan tahap, jeda/lanjut, lewati, kembali, dan selesai tidak menghasilkan cue ganda. Perpindahan otomatis ke tahap pertama setelah grup atau ke akhir latihan harus benar. |
| FR-08 | P0 | Opsi suara dan bunyi diatur terpisah; keduanya dapat diuji sebelum mulai. Jika suara tidak tersedia, bunyi dan visual tetap berfungsi jika didukung. |
| FR-09 | P0 | Simpan beberapa preset di localStorage pada browser yang sama. Buka, ganti nama, duplikasi, dan hapus dengan konfirmasi; perubahan editor yang belum disimpan diberi penanda. |
| FR-10 | P0 | Saat halaman disegarkan atau ditutup saat latihan, sesi aktif tidak otomatis meneruskan audio. Setelah dibuka kembali, tampilkan opsi mulai ulang dari awal; preset tetap tersimpan. |
| FR-11 | P1 | Pilihan hitung mundur tiga detik sebelum pergantian tahap. Jika durasi tahap <3 detik, jangan memutar countdown yang tumpang tindih. |
| FR-12 | P1 | Izin Screen Wake Lock boleh diminta saat sesi dimulai jika tersedia; tampilkan bahwa layar akan tetap menyala dan lepaskan saat sesi berakhir. Ini opsi, bukan solusi untuk layar terkunci. |

**Aturan editor:** label khusus maksimal 40 karakter; nama latihan maksimal 60 karakter; minimal 1 langkah terpasang; maksimal 100 langkah setelah ekspansi dan maksimal 4 jam total untuk menjaga editor tetap praktis. Saat batas tercapai, pengguna melihat alasan dan cara mengurangi langkah. Jika perubahan belum disimpan, aksi meninggalkan editor meminta konfirmasi. Semua angka ditampilkan dengan satuan jelas.

## 6. Aturan timer dan kontrol

Latihan disusun sebagai daftar datar hasil ekspansi grup. Setiap entri memiliki `sourceId`, `type`, `label`, `durationSeconds`, serta metadata `repeatIndex` dan `repeatCount` bila berasal dari grup. Pratinjau dan player memakai daftar yang sama, sehingga total dan urutan konsisten.

Status player: `ready`, `running`, `paused`, `completed`, `ended`. Simpan indeks tahap, waktu aktif yang sudah berlalu sebelum jeda, dan timestamp saat mulai/lanjut. Saat `running`, hitung waktu aktif dari timestamp, bukan dengan mengurangi satu detik setiap interval. Cari posisi tahap dari jumlah kumulatif durasi. `setInterval` hanya memicu pembaruan tampilan; ia bukan sumber kebenaran waktu.

| Aksi | Perilaku |
| --- | --- |
| Mulai | Set posisi ke detik 0; mulai tahap pertama dan mainkan satu cue. |
| Jeda | Bekukan waktu aktif; hentikan cue yang masih berjalan; jangan lanjut otomatis. |
| Lanjut | Buat timestamp acuan baru dari waktu aktif tersimpan; bacakan tahap saat ini sekali jika pengaturan mengizinkan. |
| Lewati | Pindah ke awal tahap berikutnya; jika tahap terakhir, selesaikan latihan. |
| Kembali | Pindah ke awal tahap sebelumnya; bila sedang di tahap pertama, mulai ulang tahap pertama. |
| Akhiri | Minta konfirmasi; hentikan timer dan audio; tandai sesi dihentikan. |

Jika beberapa batas tahap terlewati selama browser tertunda, sinkronkan langsung ke posisi saat ini, keluarkan paling banyak satu cue untuk tahap saat ini bila masih relevan, dan catat bahwa cue di antaranya tidak terkirim. Pada saat tepat di batas, tahap baru dimulai. Akhir latihan tidak boleh menunggu tick berikutnya untuk mengubah status ketika aplikasi kembali aktif.

**Contoh urutan:** 5:00 pemanasan → lari 1:00 → jalan 2:00 → ... hingga putaran 8 → 5:00 pendinginan → selesai. Setelah jalan pada putaran 8, langsung masuk pendinginan; tidak ada lari putaran 9.

## 7. Audio dan bahasa

- Default Bahasa Indonesia. Template: “Mulai pemanasan. Jalan santai selama lima menit”; “Mulai lari selama satu menit. Putaran dua dari delapan”; “Sekarang jalan selama dua menit”; “Mulai pendinginan selama lima menit”; “Latihan selesai.”
- Durasi dibaca alami untuk jam, menit, dan detik; misalnya 1:30 menjadi “satu menit tiga puluh detik”. Nama langkah kustom diucapkan sesuai label jika voice browser mampu membacanya.
- Gunakan `speechSynthesis` untuk percobaan MVP dan pilih suara Bahasa Indonesia jika tersedia; fallback ke suara perangkat yang tersedia dengan label keterbatasan yang jelas. `speechSynthesis.cancel()` membersihkan ucapan sebelumnya pada pergantian supaya antrean tidak menumpuk.
- Bunyi transisi harus singkat dan berbeda dari tiga bunyi countdown. Audio pertama diaktifkan lewat ketukan **Tes suara** atau **Mulai**, karena browser bisa membatasi audio otomatis.
- Jika output headset terputus, perangkat dimatikan, tab dihentikan, atau audio berbenturan dengan pemutar musik, aplikasi tidak mengklaim cue selalu terdengar. Uji musik + headset sebagai skenario tersendiri.
- Jangan memakai notifikasi push sebagai pengganti timer lokal: MVP tidak memiliki server atau jadwal notifikasi yang dapat menjamin ucapan tepat di setiap batas.

## 8. Layar dan konten utama

| Layar | Elemen utama |
| --- | --- |
| Beranda/preset | Nama produk, ringkasan manfaat, preset contoh, daftar preset tersimpan, buat latihan. |
| Editor | Nama, daftar langkah dan grup, input durasi mm:ss, kontrol susun ulang, tambah, pratinjau ekspansi, total, simpan, mulai. |
| Persiapan audio | Tes suara, tes bunyi, sakelar masing-masing, informasi headset/volume, catatan layar terkunci. Bisa berupa panel sebelum mulai. |
| Player | Jenis dan nama tahap berwarna dan bertulisan, angka waktu besar, repetisi, berikutnya, progres, jeda/lanjut, lewati, kembali, akhiri. |
| Selesai | Status selesai/dihentikan, waktu terencana dan waktu aktif aktual, ulangi latihan, kembali ke preset. |

Utamakan ukuran sentuh yang nyaman, kontras tinggi, layar tetap dapat dibaca di luar ruangan, dan informasi tahap tidak hanya dibedakan oleh warna. Jangan membuat tombol “Lewati” lebih dominan daripada “Jeda”.

## 9. Data dan rancangan teknis

**Stack usulan:** Next.js dengan TypeScript dan Tailwind CSS, hosting Vercel. Seluruh logika editor, timer, dan audio berjalan di sisi klien. Tidak ada backend, akun, database, atau kunci API. Stack ini usulan implementasi, bukan kebutuhan produk yang mengikat.

```ts
type Step = { id: string; kind: 'step'; type: 'warmup'|'run'|'walk'|'cooldown'|'rest'|'custom'; label: string; durationSeconds: number };
type RepeatGroup = { id: string; kind: 'repeat'; count: number; steps: Step[] };
type Workout = { id: string; schemaVersion: 1; name: string; blocks: (Step | RepeatGroup)[]; updatedAt: string };
type AudioSettings = { voiceEnabled: boolean; beepEnabled: boolean; countdownEnabled: boolean; language: 'id-ID' };
```

Simpan `workouts` dan `settings` dengan versi skema. Tangani JSON rusak, localStorage tidak tersedia, dan kuota penuh: tampilkan pesan, biarkan sesi berjalan di memori, dan jangan menghapus semua preset tanpa persetujuan. Data tinggal pada browser/perangkat itu; menghapus data browser akan menghapus preset. Jangan simpan data kesehatan pribadi atau lokasi.

Unit test yang penting: ekspansi grup, total durasi, titik batas, pause/resume, skip/previous, dan pemulihan posisi setelah tick tertunda. UI test utama: membuat variasi latihan, menyimpan preset, dan menjalankan sesi pendek. Audio dan layar terkunci perlu uji manual di perangkat.

## 10. Kriteria penerimaan dan matriks uji

| Skenario | Hasil yang diterima |
| --- | --- |
| Preset contoh | Total 34:00; 18 tahap setelah ekspansi: 1 pemanasan + 16 interval + 1 pendinginan. |
| Variasi dinamis | Ubah lari 2:00, jalan 1:30, ×6, pemanasan dan pendinginan 5:00 → total 31:00; seluruh cue dan repetisi mengikuti nilai baru. |
| Urutan bebas | Langkah Lari 1:00 → Jalan 2:00 → Lari 3:00 tanpa grup berjalan tepat menurut urutan. |
| Jeda | Jeda 30 detik nyata saat tahap berjalan; sisa waktu dan tahap tetap sama. Lanjut tidak melewati 30 detik itu. |
| Batas tahap | Satu cue transisi per batas, tanpa ucapan lama menumpuk. Akhir sesi tepat sesudah pendinginan. |
| Latar belakang | Setelah pindah tab selama beberapa menit, kembali ke posisi waktu aktif yang benar; cue yang hilang tidak dibacakan beruntun. Catat apakah cue saat tersembunyi terdengar. |
| Layar terkunci | Uji sesi 15 menit dengan headset pada Chrome Android perangkat pengguna, layar terkunci, musik aktif dan mati. Catat setiap cue: tepat waktu, terlambat, atau tidak terdengar. Gagal jika fitur diklaim andal tetapi ada cue terlewat. |
| Penyimpanan | Simpan dua preset, muat ulang halaman, keduanya bisa dibuka dan diubah; hapus satu tidak menghapus yang lain. |
| Kesalahan masukan | Durasi 0, nilai bukan angka, grup kosong, dan total >4 jam dicegah dengan pesan spesifik. |
| Aksesibilitas | Kontrol bisa dipakai dengan keyboard; label input terbaca pembaca layar; teks status tersedia selain warna. |

**Gate rilis:** editor, timer, dan cue saat layar aktif harus lulus. Pengalaman layar terkunci dinilai secara terpisah. Bila cue pada layar terkunci tidak konsisten, rilis web boleh diberi label beta dengan penjelasan jelas sebelum mulai; kebutuhan “HP di kantong dan cue selalu terdengar” belum terpenuhi dan perlu evaluasi aplikasi native Android. Ini keputusan berdasarkan pengujian, bukan janji bahwa PWA akan menyelesaikannya.

## 11. Prioritas pengerjaan

1. Model data, ekspansi langkah/grup, validasi, dan total durasi.
2. Editor dan preset lokal.
3. Player dan state machine berbasis waktu aktif/timestamp.
4. Speech, bunyi, serta tes audio.
5. Uji Android headset, latar belakang, dan layar terkunci; perbaiki atau tampilkan batasan produk.
6. Poles aksesibilitas, performa, dan tampilan luar ruangan; deploy Vercel.

## 12. Risiko dan keputusan terbuka

| Risiko/keputusan | Penanganan MVP |
| --- | --- |
| Timer JavaScript di tab tersembunyi dapat dibatasi browser | Hitung posisi dari timestamp; jangan menjanjikan cue yang tidak sempat dijalankan. |
| Speech API atau suara Bahasa Indonesia berbeda antarperangkat | Sediakan tes audio, bunyi cadangan, dan pesan bila suara tak tersedia. |
| Screen Wake Lock menjaga layar menyala, bukan menjalankan audio saat layar terkunci | Jadikan pilihan pengguna dan uji secara terpisah. |
| Konten lokal hilang saat data browser dibersihkan | Jelaskan pada daftar preset; ekspor/impor JSON dipertimbangkan setelah MVP. |
| Kebutuhan benar-benar hands-free tidak tercapai di browser tertentu | Ukur dulu di Android pengguna; bila gagal, rencanakan aplikasi native sebagai tahap berikutnya. |

## 13. Rujukan teknis untuk validasi

- [Chrome for Developers tentang pembatasan timer pada tab tersembunyi](https://developer.chrome.com/blog/timer-throttling-in-chrome-88/).
- [MDN SpeechSynthesis speak](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/speak).
- [MDN Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).
- [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

Rujukan menjelaskan kemampuan dan batas platform, sedangkan kelayakan cue saat layar terkunci tetap harus ditetapkan melalui uji perangkat nyata.
