# Product Requirements Document RunCue Android

**Versi:** 2.0 · **Tanggal riset:** 19 September 2026 · **Status:** Spesifikasi pengembangan Android dan persiapan Google Play

## 1. Keputusan produk

RunCue adalah aplikasi Android berbasis Flutter untuk membuat latihan interval yang bisa diubah sepenuhnya dan memberikan instruksi audio melalui headset, termasuk ketika layar terkunci. Fokusnya adalah membantu pengguna menjalankan sesi tanpa terus melihat jam. Aplikasi harus bekerja offline, tanpa akun, tanpa backend, dan tanpa melacak lokasi. Preset disimpan di perangkat. APK atau App Bundle produksi bukan pembungkus situs web; mesin sesi dan audio terintegrasi dengan Android.

**Alasan beralih dari web:** pengalaman utama memerlukan cue audio saat HP berada di kantong dan layar terkunci. Implementasi native memberi akses ke layanan foreground, notifikasi sesi, audio focus, dan siklus hidup Android. Namun sistem dan kebijakan tetap dapat menghentikan proses tertentu; reliabilitas harus dibuktikan di perangkat nyata.

**Preset awal yang dapat diedit:** pemanasan 5:00 → [lari 1:00 → jalan 2:00] × 8 → pendinginan 5:00 = 34:00. Mesin tidak mengunci pengguna pada pola tersebut.

**Positioning:** “Susun interval lari dan jalanmu sendiri. Dengarkan instruksinya tanpa melihat jam.” Tidak menjanjikan pengukuran pace, jarak, kalori, kesehatan, atau hasil latihan.

## 2. Pengguna, nilai, dan ukuran keberhasilan

**Pengguna utama:** pelari pemula dengan program run/walk yang berubah tiap minggu, memakai headset saat berlatih. **Pengguna sekunder:** orang yang menjalankan interval jalan, latihan kardio, atau aktivitas lain berbasis waktu. Aplikasi tetap mudah dipahami tanpa pengetahuan istilah olahraga.

**Nilai inti:** setel dalam kurang dari satu menit, mulai latihan, dan dengar instruksi tahap berikutnya saat layar mati. Tanpa login, tanpa iklan, tanpa langganan dalam rilis awal. Ini hipotesis produk untuk mengurangi friksi, bukan jaminan akan banyak diunduh.

| Ukuran pilot | Target sebelum produksi | Cara mengukur |
| --- | --- | --- |
| Keberhasilan sesi hands-free | Semua transisi terdengar dan tepat tahap pada 20 sesi uji 20–40 menit di matriks perangkat target; setiap kegagalan kritis diblokir | Log uji manual dengan timestamp, jenis headset, mode layar, perangkat, dan versi Android |
| Kegunaan editor | 8 dari 10 penguji baru membuat dan memulai pola kustom tanpa bantuan dalam 2 menit | Uji tugas observasional |
| Stabilitas | 0 crash/ANR pada skenario rilis inti di matriks uji; pantau Android vitals setelah rilis | Pre-launch report, closed test, Play Console |
| Ukuran terpasang | Target internal ≤30 MB unduhan terestimasi pada satu perangkat Android representatif; optimalkan jika terlampaui | Play Console App Bundle Explorer dan perbandingan build rilis |
| Waktu membuka player | Target internal ≤2 detik pada perangkat uji menengah dalam build release | Pengukuran dari ketukan ke UI siap; bukan benchmark universal |

Target ukuran dan waktu di atas adalah anggaran kualitas internal yang dapat disesuaikan setelah build dan pengukuran nyata. Nilai AAB unggahan bukan ukuran unduhan pengguna.

## 3. Ruang lingkup rilis 1

### Wajib

- Editor latihan dengan blok langkah dan grup pengulangan; tambah, edit, duplikasi, hapus, dan susun ulang.
- Jenis langkah: pemanasan, lari, jalan, pendinginan, istirahat, kustom. Setiap langkah memiliki label dan durasi detik.
- Grup pengulangan berisi minimal dua langkah dan jumlah 1–99; dapat berada di antara langkah tunggal; tanpa nested repeat pada v1.
- Pratinjau daftar tahap terurai, total durasi, dan repetisi; validasi sebelum menyimpan/mulai.
- Banyak preset tersimpan lokal; buat, ganti nama, buka, duplikasi, hapus, serta contoh yang dapat disalin dan diedit.
- Player dengan tahap kini, sisa waktu, tahap berikutnya, putaran, progres, jeda/lanjut, lewati, kembali, dan akhiri.
- Cue Bahasa Indonesia via Android TextToSpeech bila tersedia, fallback bunyi dan visual; tes suara dan tes bunyi.
- Mesin sesi native yang tetap berjalan saat layar terkunci melalui mekanisme Android yang diizinkan, dengan notifikasi aktif dan aksi jeda/lanjut/akhiri jika layak.
- Riwayat sangat sederhana hanya untuk sesi selesai/dihentikan bila diperlukan untuk debugging UX; pada v1 boleh tidak ada riwayat pengguna. Logging diagnostik tidak dikirim ke server.
- Pengaturan audio sederhana, informasi privasi, bantuan, dan informasi versi.

### Tidak termasuk rilis 1

Akun, sinkronisasi, cloud, GPS, pace, jarak, peta, pengukuran fisiologis, AI coach, rekomendasi intensitas medis, fitur sosial, wearable, integrasi Health Connect, pengingat terjadwal, iklan, monetisasi, dan iOS. Jangan tambahkan izin lokasi, mikrofon, kontak, penyimpanan luas, atau internet hanya untuk antisipasi fitur nanti.

## 4. Alur dan layar

1. **Beranda:** satu latihan contoh, preset tersimpan, tindakan “Buat latihan”, “Mulai” pada preset, dan penjelasan singkat bahwa aplikasi bekerja offline.
2. **Editor:** nama → blok langkah/grup → durasi menit/detik → pratinjau total dan urutan → simpan atau mulai. Pengguna tidak dipaksa menyimpan untuk mencoba; jika mulai dari draft, snapshot latihan untuk sesi aktif dibekukan.
3. **Persiapan audio:** uji suara/bunyi, status suara Bahasa Indonesia, pengaturan audio dan petunjuk volume/headset. Jelaskan bahwa notifikasi aktif muncul selama sesi.
4. **Player:** fokus pada tahap, waktu, repetisi, tindakan utama. Keluar dari layar tidak menghentikan sesi. Tombol Back membawa ke aplikasi tanpa menciptakan sesi ganda.
5. **Selesai:** hasil waktu terencana, waktu aktif, status selesai/dihentikan, ulangi, kembali ke daftar.
6. **Pengaturan/bantuan:** audio, bahasa yang tersedia, privasi, cara kerja layar terkunci, dan versi.

Jika TTS perangkat tidak memiliki suara Indonesia, beri pilihan bunyi saja atau suara lain yang tersedia setelah tes; jangan diam-diam beralih ke cloud TTS. Jika notifikasi atau fungsi foreground gagal karena kebijakan/perangkat, jelaskan keterbatasan sebelum sesi dianggap siap.

## 5. Persyaratan fungsional

| ID | Prioritas | Kriteria yang dapat diuji |
| --- | --- | --- |
| FR-01 | P0 | Contoh 5:00 + (1:00 + 2:00) × 8 + 5:00 menghasilkan 34:00 dan 18 tahap; semua angka dapat diganti. |
| FR-02 | P0 | Langkah bebas dapat disisipkan sebelum/sesudah grup; durasi minimal 1 detik, detik input 0–59, label kustom maksimal 40 karakter. |
| FR-03 | P0 | Total maksimal 4 jam dan ekspansi maksimal 100 tahap; grup minimal 2 langkah; validasi memberi pesan di field terkait. |
| FR-04 | P0 | Edit, urut, duplikasi, hapus, dan pratinjau memakai data yang sama dengan player; setelah edit total langsung diperbarui. |
| FR-05 | P0 | Preset disimpan offline dan tetap ada setelah aplikasi ditutup atau perangkat di-restart; kegagalan simpan ditampilkan. |
| FR-06 | P0 | Mulai, jeda, lanjut, lewati, kembali, dan akhiri mengikuti aturan mesin pada bagian 6; tidak ada transisi ganda. |
| FR-07 | P0 | Pada sesi yang disetujui berjalan di latar belakang, setiap batas tahap mengeluarkan tepat satu cue yang cocok dengan tahap baru, termasuk layar terkunci. |
| FR-08 | P0 | Notifikasi sesi menampilkan tahap dan kontrol minimal; muncul hanya saat sesi aktif, diperbarui dengan hemat, hilang setelah selesai/akhir. |
| FR-09 | P0 | Saat headset dicabut/audio focus berubah, perilaku yang dipilih jelas dan konsisten: default jeda otomatis saat output berubah agar cue tidak mendadak keluar speaker; sediakan penjelasan dan tindakan lanjut. |
| FR-10 | P0 | Saat proses aplikasi dibunuh sistem, jangan berpura-pura sesi/audio masih berjalan. Pada pembukaan berikutnya tampilkan status terputus dan opsi mulai ulang atau melanjutkan dari posisi tersimpan setelah rekonsiliasi; cue terlewat tidak dibacakan berturut-turut. |
| FR-11 | P0 | Saat force-stop manual atau perangkat reboot, layanan tidak hidup diam-diam; sesi ditandai terputus dan pengguna harus memulai/lanjut secara sadar. |
| FR-12 | P1 | Countdown 3 detik opsional; tidak menumpuk dengan instruksi transisi; durasi pendek ditangani. |
| FR-13 | P1 | Pemilihan suara TTS yang tersedia dan kecepatan wajar setelah tes; pilihan tersimpan lokal. |

Hapus preset memerlukan konfirmasi. Draft yang diubah tetapi belum disimpan memberi peringatan sebelum dibuang. Bila sesi aktif memakai preset yang kemudian diedit, sesi tetap memakai snapshot awal hingga selesai.

## 6. Mesin latihan dan keandalan waktu

Model domain: `Workout(id, name, blocks, schemaVersion, updatedAt)`, `Step(id, type, label, durationMs)`, `RepeatGroup(id, count, steps)`. Ekspansi menghasilkan `SessionSegment(sourceId, label, type, durationMs, repeatIndex?, repeatCount?, cumulativeStartMs, cumulativeEndMs)`. Domain tidak bergantung pada Widget Flutter, TTS, atau layanan Android.

State machine tunggal: `idle → preparing → running ↔ paused → completed | ended | interrupted`. Semua aksi dari UI atau notifikasi melewati satu pengendali sesi; hanya satu sesi aktif per aplikasi. Simpan `sessionId`, snapshot segmen, indeks/offset, `elapsedActiveMs`, state, dan ID cue terakhir secara atomik di penyimpanan lokal. Setiap command memiliki ID/sequence untuk mencegah tap ganda dan callback ganda.

Saat proses hidup, gunakan sumber waktu monoton Android seperti `elapsedRealtime()` untuk waktu aktif; saat jeda akumulasikan waktu dan hentikan kemajuan. UI hanya merefleksikan state mesin, tidak memiliki timer terpisah. Catat waktu dinding untuk rekonsiliasi dan tampilan, tetapi jangan mengandalkan `DateTime.now()` saja karena jam sistem bisa berubah. Setelah proses mati, tidak ada jaminan cue selama jeda proses; pulihkan dengan status `interrupted` dan konfirmasi pengguna. Bila beberapa batas terlewati akibat callback tertunda, lompat ke posisi terkini dan bunyikan maksimal satu instruksi relevan; jangan spam cue yang sudah terlewat.

| Aksi | Semantik |
| --- | --- |
| Mulai | Validasi; ambil snapshot; aktifkan layanan yang diperlukan dari interaksi pengguna; siapkan audio; mulai segmen pertama tepat sekali. |
| Jeda | Bekukan waktu aktif, hentikan TTS/cue, perbarui notifikasi. |
| Lanjut | Waktu aktif berjalan lagi dari offset tersimpan; ucapkan konteks tahap kini tepat sekali. |
| Lewati | Pindah ke awal segmen berikutnya dan ucapkan satu cue; pada segmen terakhir selesaikan. |
| Kembali | Mulai ulang segmen sebelumnya; pada segmen pertama mulai ulang segmen pertama. |
| Akhiri | Konfirmasi di UI; berhenti, lepaskan audio focus, hentikan layanan dan notifikasi. |
| Selesai | Hentikan sesi otomatis, cue selesai sekali, bersihkan sumber daya. |

**Batas audio:** instruksi dinamis dikonstruksi dari label/durasi dalam Bahasa Indonesia; hindari antrean TTS menumpuk. Bunyi pendek dibundel sebagai aset kecil. Putusan teknis apakah TTS Android dapat berjalan stabil di dalam layanan yang sesuai harus dibuktikan melalui spike sebelum UI dipoles.

## 7. Arsitektur aplikasi Flutter

Susunan berlapis, berorientasi fitur, dengan dependency mengarah ke domain:

```text
lib/
  app/                 # bootstrap, routing, tema, wiring dependency
  core/                # error, clock abstraction, ID, util kecil
  features/workouts/
    domain/             # model, validasi, ekspansi, use case
    data/               # repository lokal, migrasi skema
    presentation/       # editor, daftar preset, state UI
  features/session/
    domain/             # state machine dan aksi sesi
    data/               # checkpoint/recovery sesi
    presentation/       # player dan notifikasi status UI
  features/audio/
    domain/             # kontrak cue/audio
    data/               # adapter TTS, bunyi, audio focus
  features/settings/
    data/               # pengaturan lokal
    presentation/
android/                # layanan foreground, notification, platform bridge
test/                   # domain, repository, state machine
integration_test/       # alur utama, bila perangkat tersedia
```

Gunakan satu state-management yang sederhana dan konsisten (pilihan awal Riverpod atau alternatif ringan yang diputuskan setelah spike); jangan memasang beberapa framework state sekaligus. Repository memakai interface agar implementasi penyimpanan dapat diganti; data kecil dapat memakai store lokal sederhana yang mendukung penulisan aman dan migrasi. Jangan memilih database besar untuk beberapa preset sebelum terukur perlu. Untuk model bercabang, serialisasi versi dan validasi saat baca wajib. Simpan settings terpisah dari preset. Aset visual dan audio terdaftar eksplisit.

**Batas Flutter/native:** widget Flutter hanya menyajikan dan mengirim command. Komponen Android native menangani foreground service, notifikasi, audio focus, clock monoton, dan callback ketika UI tidak aktif; komunikasi memakai platform channel atau plugin yang benar-benar terbukti mendukung kasus ini. Jangan mengasumsikan Dart timer/background isolate tetap hidup saat layar terkunci. Plugin harus diaudit lisensi, pemeliharaan, kompatibilitas target SDK 36, izin manifest, dan dukungan 16 KB page size. Jika plugin tidak memenuhi syarat, implementasi Kotlin kecil lebih tepat daripada workaround yang rapuh.

**Spike teknis wajib sebelum fondasi dibekukan:** prototipe 20 menit dengan transisi tiap 30–60 detik, layar terkunci, headset Bluetooth dan kabel, background, serta kombinasi musik; cek notifikasi, TTS, audio focus, penghentian layanan, dan kebijakan jenis foreground service. Android mendokumentasikan tipe `mediaPlayback` untuk pemutaran audio/video latar belakang, tetapi penggunaannya untuk cue TTS yang berselang harus dinilai terhadap fungsi aktual dan deklarasi Play; jangan menamai service `mediaPlayback` hanya untuk lolos pengujian. Pilihan jenis service dan izin final harus memiliki alasan tertulis serta bukti uji. [Rujukan Android foreground service](https://developer.android.com/develop/background-work/services/fgs/service-types).

## 8. Ringan dan lancar

- Bangun AAB release dengan `flutter build appbundle`; ukur unduhan per perangkat via Play Console, bukan besar AAB mentah. Jalankan `flutter build appbundle --analyze-size` dan simpan baseline setiap rilis. [Panduan Flutter rilis](https://docs.flutter.dev/deployment/android), [pengukuran ukuran](https://docs.flutter.dev/perf/app-size).
- Pertahankan R8 pada release, audit dependensi transitif, jangan memasukkan SDK analytics/iklan, font multipel, gambar resolusi besar, video, atau paket ikon besar untuk v1. Gunakan ikon vektor terpilih, satu set bunyi pendek, dan font sistem.
- Render daftar tahap panjang secara lazy; timer mengubah hanya bagian UI yang perlu; cache hasil ekspansi selama sesi; hindari pekerjaan berat atau serialisasi setiap detik. Profilkan build **profile/release**, jangan menyimpulkan performa dari debug. [Panduan performa Flutter](https://docs.flutter.dev/perf/best-practices).
- MinSdk ditentukan setelah spike kompatibilitas dan survei perangkat penguji; jangan pilih terlalu tinggi tanpa alasan atau terlalu rendah hingga service tidak stabil. Target SDK tidak sama dengan minimum SDK. Verifikasi ABI 64 bit dan paket native pihak ketiga; jalankan pemeriksaan kompatibilitas 16 KB page size untuk native library.
- Tidak ada request jaringan runtime untuk fungsi inti. Jika nanti menambah crash reporting/analytics, ulangi audit privasi, ukuran, dan deklarasi Data safety sebelum rilis.

## 9. Strategi agar disukai pengguna

Masalah utama yang harus selalu diselesaikan adalah cue pada waktu yang tepat. Onboarding satu layar, preset contoh langsung bisa dicoba, dan editor pola run/walk umum harus selesai dengan sedikit ketukan. Gunakan kata kerja jelas, durasi mudah diubah, preview total yang akurat, serta kontrol besar yang bisa dipakai saat berkeringat. Sediakan jalur feedback dari pengaturan menuju email dukungan; jangan memunculkan permintaan ulasan pada sesi pertama.

Validasi nilai dengan penguji sungguhan, bukan jumlah fitur. Minta 12+ penguji tertutup mencoba dua pola berbeda, latihan dengan layar terkunci, lalu catat di mana mereka ragu atau cue gagal. Perbaiki penyebab gagal sebelum menambah GPS, sosial, atau gamifikasi. Deskripsi toko harus jujur menyebut pembuat interval dan cue audio, tanpa klaim medis atau janji hasil lari 5K.

## 10. Privasi dan keamanan

Rilis awal menyimpan preset dan preferensi hanya di perangkat. Tidak meminta akun, lokasi, mikrofon, akses file luas, atau izin internet untuk core flow. Minimalisasi permission dan periksa manifest gabungan hasil plugin, bukan hanya manifest aplikasi. Notifikasi dan foreground service diminta sesuai kebutuhan platform, dengan penjelasan yang mudah dimengerti. Jangan menaruh data sensitif dalam log. Data safety tetap harus diisi meskipun tidak ada data yang dikirim; setiap SDK pihak ketiga dapat mengubah deklarasinya. Kebijakan privasi harus tersedia lewat URL publik dan di dalam aplikasi, menjelaskan data lokal, retensi, penghapusan, kontak, serta identitas developer. [Kebijakan User Data](https://support.google.com/googleplay/android-developer/answer/10144311), [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469).

## 11. Google Play release gate

Syarat berikut diverifikasi ulang tepat sebelum pengiriman karena kebijakan Play dapat berubah.

| Gate | Persyaratan per 19 September 2026 | Bukti selesai |
| --- | --- | --- |
| Akun dan identitas | Buat/siapkan akun developer, lakukan verifikasi yang diminta Play Console; kategori akun personal/organisasi memengaruhi jalur uji | Dashboard akun tidak memiliki blokir identitas |
| Target API | Aplikasi Android baru dan update sejak 31 Agustus 2026 menargetkan Android 16, API 36 atau lebih tinggi | Konfigurasi Gradle dan laporan Play Console lulus; uji perubahan perilaku Android 16. [Aturan target API](https://support.google.com/googleplay/android-developer/answer/11926878) |
| Paket dan tanda tangan | ID paket permanen, versionCode naik, AAB release ditandatangani; kunci upload disimpan aman; gunakan Play App Signing | AAB dapat dipasang dari internal test dan tidak ada konflik tanda tangan. [Panduan Flutter](https://docs.flutter.dev/deployment/android) |
| Layanan foreground | Hanya tipe dan permission yang cocok dengan fungsi nyata; deklarasi Play Console dan demonstrasi use case jika diminta | Manifest final, formulir, notifikasi aktif, dan video/bukti yang diminta Play sesuai. [Dokumentasi Android](https://developer.android.com/develop/background-work/services/fgs/declare) |
| Privasi dan Data safety | Isi Data safety secara akurat termasuk dependensi; URL kebijakan privasi publik dan tautan/teks di aplikasi | Formulir dikirim dan halaman privasi dapat diakses tanpa login. [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469) |
| Health apps | Isi deklarasi Health apps; klasifikasikan RunCue sesuai fungsi latihan, kemungkinan **Activity and Fitness**; jangan asal menyatakan tidak punya fitur kesehatan | Formulir terkirim dengan deskripsi fitur yang sesuai. [Deklarasi Health apps](https://support.google.com/googleplay/android-developer/answer/14738291) |
| Konten toko | Judul, deskripsi singkat dan lengkap, kategori yang sesuai, ikon, screenshot nyata, feature graphic jika diminta, email dukungan, target audiens, rating konten, deklarasi iklan | Store listing mencerminkan aplikasi yang benar. [Panduan listing](https://support.google.com/googleplay/android-developer/answer/13393723), [penyiapan app](https://support.google.com/googleplay/android-developer/answer/9859152) |
| Closed test | **Jika akun personal dibuat setelah 13 November 2023:** minimal 12 tester opt-in terus-menerus ≥14 hari, lalu ajukan akses produksi dan jelaskan masukan serta perbaikannya. Akun lain mengikuti persyaratan yang ditampilkan pada Console | Bukti jumlah/masa opt-in, catatan feedback, aplikasi akses produksi disetujui. [Aturan pengujian](https://support.google.com/googleplay/android-developer/answer/14151465) |
| Kualitas dan kompatibilitas | Tidak crash, tidak ANR, tidak ada fitur rusak; tes Android/ukuran layar/headset; pre-launch report; kompatibilitas library native termasuk 16 KB page size | Laporan pengujian dan blocker nol. [Panduan 16 KB](https://developer.android.com/guide/practices/page-sizes) |
| Review | Tinjau Policy status, izin sensitif, peringatan otomatis, semua formulir, dan kesiapan rilis sebelum submit | Tidak ada blokir Play Console; rilis production hanya setelah akses diberikan |

Publikasi **tidak otomatis lolos** walau checklist lengkap: Google menilai perilaku aplikasi dan kelengkapan deklarasi. Jangan memakai klaim “selalu berjalan di semua HP” tanpa bukti. Tidak perlu membuat kebijakan privasi sebagai PDF; gunakan halaman web publik yang dapat diakses.

## 12. Matriks uji dan acceptance criteria

| Kategori | Skenario minimum | Hasil wajib |
| --- | --- | --- |
| Kalkulasi | Preset awal; 2:00 lari + 1:30 jalan ×6 dengan pemanasan/pendinginan 5:00 | 34:00/18 tahap dan 31:00/14 tahap sesuai; urutan dan ucapan mengikuti data |
| Kontrol | Pause 45 detik, resume, skip, previous, dua tap cepat, akhiri | Waktu aktif tidak maju saat jeda, tepat satu transisi/cue, layanan berhenti sesudah akhir |
| Tepi durasi | 1 detik, 1:30, batas grup, tahap terakhir, label panjang | Tidak hang, urutan konsisten, UI tidak overflow |
| Persistensi | 2 preset; edit saat sesi; restart aplikasi; file lokal rusak | Tidak hilang diam-diam; snapshot sesi stabil; kesalahan terbaca dan bisa dipulihkan |
| Latar belakang | Home, aplikasi lain, layar mati 20–40 menit | Tahap tepat dan cue terdengar sesuai matriks perangkat; notifikasi tersedia |
| Audio | Headset kabel/Bluetooth; musik aktif; telepon masuk; lepas headset; TTS id-ID tidak tersedia | Audio focus sesuai, perilaku jeda jelas, tidak memutar cue mengejutkan lewat speaker, fallback berfungsi |
| Gangguan sistem | Battery saver, izin notifikasi ditolak, proses dibunuh, force-stop, reboot, jam sistem berubah | Tidak ada sesi hantu atau klaim cue palsu; recovery menjelaskan status; tidak crash |
| Aksesibilitas | Font sistem besar, TalkBack, kontras, layar kecil, rotasi | Semua tindakan terjangkau; label dan urutan baca logis; konten tidak terpotong |
| Google Play | Install dari internal/closed track; target API, signed AAB, kebijakan dan formulir | Semua gate bagian 11 terpenuhi sebelum production |

Perangkat uji mencakup paling sedikit satu Android 16, satu perangkat kelas menengah, dan satu perangkat dengan pengelolaan baterai agresif bila tersedia; dokumentasikan model, versi, dan vendor. Uji Bluetooth dan kabel bila tersedia. Jika salah satu cue transisi kritis gagal secara konsisten ketika layar mati, **tunda produksi** dan perbaiki mekanisme foreground/audio; jangan menutupi kegagalan dengan teks peringatan yang menghapus inti manfaat aplikasi.

## 13. Tahapan pengembangan

1. **Spike layanan Android:** putuskan jenis foreground service, TTS, notifikasi, audio focus, dan plugin/native bridge dengan uji layar mati pada perangkat nyata.
2. **Domain dan kontrak:** model data versi 1, ekspansi, validasi, state machine, clock, dan command idempotent; unit test kasus batas.
3. **Penyimpanan dan UI dasar:** preset, editor, pratinjau, player dan settings memakai domain yang sama.
4. **Integrasi audio dan lifecycle:** layanan native, notifikasi, perangkat output, recovery, izin dan penghentian bersih.
5. **Pengukuran dan QA:** build release, profil performa, analisis ukuran, uji device matrix, aksesibilitas dan keamanan data.
6. **Persiapan toko:** kebijakan privasi, aset listing, deklarasi, closed test sesuai jenis akun, masukan penguji, production access, lalu submit.

## 14. Keputusan yang harus ditutup saat spike

- Jenis foreground service yang paling tepat untuk cue interval dengan audio sporadis dan apakah perlu jalur audio yang berbeda agar tetap sesuai kebijakan.
- Versi Android minimum yang didukung berdasarkan plugin, jumlah pengguna yang ingin dicakup, dan pengujian perangkat.
- Implementasi penyimpanan lokal terkecil yang menjaga migrasi skema serta pemulihan dari data rusak.
- Perilaku persis saat telepon masuk atau headset terlepas; default produk adalah jeda otomatis saat output berubah.
- Ketersediaan TTS Bahasa Indonesia offline di perangkat sasaran; fallback harus diuji, bukan diasumsikan.
- Nama dan package ID final yang unik setelah cek ketersediaan merek dan konflik listing sebelum rilis.

**Dokumen berikutnya:** `design.md` versi Android Flutter dibuat setelah keputusan PRD dan hasil spike ini, agar sistem visual, notifikasi, dan tampilan player mengikuti perilaku yang benar.
