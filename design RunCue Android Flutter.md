# RunCue Android Design Specification

**Versi:** 1.0 · **Tanggal:** 19 September 2026 · **Acuan:** PRD RunCue Android Flutter v2.0

## 1. Konsep desain

RunCue memakai bahasa visual aplikasi running yang bersih dan editorial: latar putih, bidang abu sangat muda, tipografi hitam yang tegas, aksen biru terbatas, kartu bersudut lembut, dan banyak ruang bernapas. Referensi pertama dan kedua menunjukkan angka besar serta kartu ringkasan yang teratur; referensi ketiga menunjukkan layar aktivitas beraksen biru dengan fokus pada satu tindakan. Desain ini menerjemahkan pola tersebut ke fungsi interval RunCue.

**Yang diambil dari referensi:** hierarki angka dan judul yang jelas; kartu putih atau abu muda; kontrol utama berbentuk bulat; tab atau bottom bar yang sederhana; aksen biru untuk aksi; perbedaan kuat antara halaman pengaturan yang tenang dan player yang fokus.

**Yang tidak diambil:** logo, nama merek, foto atlet berlisensi, aset grafis, layout yang dijiplak piksel demi piksel, tampilan iPhone/Dynamic Island pada Android, peta, jarak, pace, kalori, detak jantung, stories, challenge sosial, atau pemutar musik palsu. RunCue belum mengukur metrik tersebut. Desain tidak memerlukan maskot, fotografi, ilustrasi besar, atau animasi berat.

**Arah suasana:** sportif, rapi, ringan, dapat dipercaya. Hero pada beranda adalah **latihan yang siap dimulai**, bukan angka pencapaian yang belum diukur. Hero pada player adalah **waktu tersisa untuk tahap saat ini**.

## 2. Prinsip komposisi

1. Satu titik fokus per layar. Dalam player, tahap dan waktu selalu lebih dominan dari dekorasi, total sesi, atau tombol tambahan.
2. Setiap nilai mempunyai label dan satuan; warna dan ikon memperkuat makna, tidak menjadi satu-satunya penanda.
3. Grid, padding, radius, dan jarak memakai token tetap. Hindari perataan dengan margin acak atau posisi absolut.
4. Kartu tumbuh mengikuti konten. Ketinggian tetap dipakai hanya untuk elemen kontrol yang benar-benar terukur.
5. Tindakan berisiko berjarak dari kontrol yang ditekan saat berlari.
6. Ruang di sekitar kamera depan, status bar, navigation bar, keyboard, dan lipatan layar dihormati.
7. Gaya minimal berlaku untuk semua state: kosong, error, izin ditolak, sesi terputus, jeda, dan selesai.

## 3. Tokens visual

### Warna

| Token | Hex | Pemakaian |
| --- | --- | --- |
| `background` | `#FFFFFF` | Halaman utama |
| `surfaceSoft` | `#F4F6F8` | Kartu informasi dan area grup |
| `surfaceRaised` | `#FFFFFF` | Kartu di atas latar lembut dan bottom sheet |
| `ink` | `#15191F` | Judul, timer, tombol gelap |
| `textSecondary` | `#545E6A` | Keterangan |
| `textTertiary` | `#68737F` | Metadata tetap penting dibaca |
| `border` | `#E2E7EC` | Pembatas dan input |
| `blue` | `#245FDD` | Tindakan utama, progres, fokus |
| `bluePressed` | `#194FC0` | Tombol utama ditekan |
| `blueSoft` | `#E9F0FF` | Badge dan penekanan lembut |
| `runTint` | `#E9F0FF` | Tahap lari, dipasangkan dengan label |
| `walkTint` | `#E8F5EF` | Tahap jalan, dipasangkan dengan label |
| `warmTint` | `#FFF3DF` | Pemanasan |
| `coolTint` | `#F0ECFF` | Pendinginan |
| `danger` | `#B73535` | Aksi akhiri/hapus |

Semua pasangan teks dan latar diuji kontrasnya, jangan mengasumsikan nilai di atas otomatis memenuhi WCAG untuk seluruh ukuran teks. Untuk teks kecil yang gagal, gelapkan teks atau ubah latarnya. Mode terang adalah target rilis pertama; sistem dark mode boleh mengikuti kemudian, tetapi jangan menghasilkan campuran kartu terang pada latar gelap secara tidak sengaja. Jika dark mode belum dibuat, deklarasikan tema terang konsisten.

### Tipografi

Pakai font sistem Android/Flutter agar unduhan tetap kecil. Gunakan `FontWeight.w700` untuk heading dan `w800` untuk timer; periksa bentuk angka pada perangkat uji. Angka timer memakai tabular figures bila tersedia. Huruf kapital hanya pada label tahap pendek, bukan paragraf. Jangan mereplikasi font miring khas merek pada referensi.

| Gaya | Ukuran/line height acuan | Contoh |
| --- | --- | --- |
| Display timer | 72/80 sp pada lebar normal, adaptif 54–88 sp | `00:42` |
| Display ringkasan | 40/46 sp | `34 menit` |
| Heading halaman | 26/32 sp | `Latihanmu` |
| Heading kartu | 18/25 sp | `Run Walk Pemula` |
| Body utama | 16/24 sp | Petunjuk singkat |
| Body sekunder | 14/21 sp | Metadata dan bantuan |
| Caption | 12/18 sp, gunakan secukupnya | Label angka |

Nilai sp adalah titik awal desain; `MediaQuery.textScaler` tetap dihormati. Jangan menonaktifkan pembesaran teks atau memaksa semua judul satu baris. Angka di player boleh turun ukuran berdasarkan **ruang tersedia** tanpa mengurangi skala teks sistem. Nama preset panjang boleh membungkus dua baris pada kartu; teks lengkap muncul di editor/detail.

### Spacing dan bentuk

Skala jarak dalam dp: `4, 8, 12, 16, 20, 24, 32, 40, 48`. Margin layar 20 dp pada lebar ponsel normal; 16 dp pada jendela <360 dp; maksimum isi utama 560 dp untuk halaman satu kolom. Jarak antarbagian 28–32 dp; antar kartu 12–16 dp; padding kartu 16–20 dp; jarak label ke nilai 4–8 dp. Radius kartu 20 dp, tombol 14–16 dp, input 14 dp, pill penuh. Garis 1 dp. Elevation 0–2 saja; gunakan border dan warna lembut sebagai pemisah utama.

Ikon garis 20–24 dp dengan ketebalan seragam; ikon kontrol utama 24–28 dp. Area sentuh minimal 48×48 dp; visual ikon boleh lebih kecil dari area sentuhnya.

## 4. Kerangka navigasi

Rilis pertama memakai bottom navigation dengan **Latihan** dan **Pengaturan** jika memang kedua destinasi terpisah. Jika Pengaturan hanya satu layar yang jarang dibuka, lebih ringan memakai ikon pengaturan di app bar Beranda dan **tanpa bottom navigation**. Pilihan final sebelum implementasi: **ikon pengaturan di app bar**, sehingga beranda dan editor tidak kehilangan tinggi vertikal. Referensi bottom bar diambil sebagai petunjuk rasa visual, bukan kewajiban memasukkan tab kosong seperti Club atau Activity.

Hierarki: **Beranda → Editor/Detail preset → Persiapan audio → Player → Selesai**. Pengaturan dibuka dari Beranda atau Persiapan. Back Android dan gesture kembali mengikuti rute logis; ketika sesi aktif, kembali dari player ke beranda hanya menutup layar player, sementara sesi tetap aktif dan banner **Sesi berjalan · Buka player** muncul. Keluar dari sesi membutuhkan tindakan **Akhiri** yang dikonfirmasi. Jangan membuat dua player atau dua sesi ketika navigasi diulang.

## 5. Komponen

### Tombol

| Varian | Visual | Aksi |
| --- | --- | --- |
| Primary | Biru solid, teks putih semibold, tinggi 52 dp, radius 16 dp | Mulai latihan, Simpan, Lanjut |
| Secondary | Putih dengan border abu, teks gelap, tinggi 48–52 dp | Tes suara, Ubah, Tambah langkah |
| Dark | Hitam lembut, teks putih, tinggi 52 dp | Alternatif hero CTA hanya bila biru sudah menjadi aksen dekoratif; pilih salah satu gaya CTA per layar |
| Icon button | Area sentuh 48 dp, ikon 22–24 dp | Kembali, opsi, pindah urutan |
| Destructive | Teks merah pada permukaan netral; merah solid hanya dalam dialog terakhir | Akhiri, hapus |

Label tombol berupa kata kerja jelas. Status pressed mengubah warna/opacity, tanpa menggeser tombol yang lain. Status loading mempertahankan lebar dan tinggi tombol. Disabled tetap menunjukkan alasannya melalui pesan dekat field atau tooltip yang tersedia. Focus indicator dan TalkBack label harus terlihat/terdengar. Jangan mengandalkan ikon saja untuk `Akhiri` dan `Jeda` pada player.

### Kartu preset

Permukaan `surfaceSoft`, padding 20 dp, judul maksimal dua baris, informasi **34 menit · 8 putaran** dan pratinjau **Pemanasan → Lari/Jalan → Pendinginan**. Tindakan utama **Mulai** tampak jelas; aksi **Ubah** dan menu Duplikasi/Hapus di lokasi terpisah. Kartu tidak memakai grafik jarak/kalori rekaan. Bila daftar panjang, gunakan list lazy dan pertahankan tinggi kartu fleksibel.

### Kartu langkah dan grup

Kartu langkah: badge jenis, label, durasi `01:30`, area tindakan urut/duplikasi/hapus. Pada lebar ponsel sempit, label dan durasi dipisah baris lalu tindakan di baris bawah. Grup mempunyai bingkai lembut `blueSoft`, judul **Ulangi 8 kali**, daftar langkah, dan kontrol jumlah putaran. Pengulangan hanya satu tingkat; jangan membuat kartu bertingkat dengan tiga border/bayangan. Tombol **Naik** dan **Turun** dengan label aksesibel selalu tersedia; drag handle boleh tambahan.

### Input durasi

Dua input terpisah **Menit** dan **Detik**, bukan teks bebas ambigu; keyboard numerik; lebar fleksibel sama besar; detik 0–59. Label tetap terlihat saat fokus, helper/error berada di bawah input, dan scrolling otomatis memastikan field serta error tidak tertutup keyboard. Angka contoh bukan placeholder satu-satunya petunjuk. Nilai invalid tidak mengubah total menjadi `NaN` atau nilai negatif.

### Status audio dan notifikasi

Baris pengaturan suara dan bunyi memakai switch dengan label dan status. Tombol **Tes suara** dan **Tes bunyi** tidak memulai sesi. Banner dalam aplikasi membedakan **Headset terputus · Sesi dijeda**, **Suara Indonesia tidak tersedia**, dan **Sesi terputus**. Notifikasi Android menggunakan ikon dan nama sendiri, teks tahap serta waktu yang relevan, aksi minimal berdasarkan hasil spike teknis; UI notifikasi mengikuti gaya native agar terbaca di lock screen, bukan disalin dari kartu Flutter.

### Progress

Progress sesi berupa garis tebal 6–8 dp dan teks **12 dari 34 menit** atau persentase sesuai konteks. Tahap dan repetisi tertulis jelas. Perubahan warna antarjenis tahap boleh memperkuat identitas, tetapi timer tidak bergantung pada warna saja.

## 6. Spesifikasi layar

### 6.1 Beranda

**Urutan:** status bar aman → header `RunCue` + ikon Pengaturan → sapaan ringkas **Siap latihan?** → kartu hero latihan terakhir atau preset contoh → tombol **Mulai latihan** → judul **Latihan tersimpan** + tombol **Buat baru** → daftar preset → ruang bawah aman.

Hero menampilkan total waktu besar **34 menit** dan ringkasan pola, mengikuti penekanan angka pada referensi. Jika belum ada preset pribadi, tampilkan contoh 34 menit dan pesan bahwa ini bisa diubah. Tidak ada “Recent Activity 8,31K” karena RunCue tidak melacak jarak. Jika sesi aktif dan pengguna kembali, banner sesi berada tepat di bawah header sebelum daftar preset, tidak melayang di atas tombol lain.

### 6.2 Editor latihan

App bar **Susun latihan** + kembali → nama latihan → daftar blok → tombol **Tambah langkah** dan **Tambah pengulangan** → kartu ringkasan **Total 34 menit · 18 tahap** + tautan **Lihat urutan** → kontrol simpan/mulai. Aksi utama berada di footer aman jika ruang cukup; daftar memiliki padding bawah minimal setinggi footer agar kartu terakhir tidak tertutup. Jika keyboard terbuka, footer masuk ke alur scroll atau tersembunyi sementara; field aktif tetap terlihat.

Pratinjau panjang ditampilkan dalam halaman atau bottom sheet dengan list lazy dan header jelas; jangan membuka 100 tahap sekaligus di editor. Penyuntingan grup mengubah total segera. Draft belum tersimpan memakai indikator teks sederhana **Belum disimpan**.

### 6.3 Persiapan audio

App bar **Siapkan audio** → status suara, bunyi dan headset → tombol Tes suara/Tes bunyi → penjelasan singkat notifikasi aktif selama sesi → CTA **Mulai latihan**. Jangan memaksa headset sebagai syarat, karena speaker tetap dapat digunakan secara sadar. Jika sistem tidak menyediakan suara Indonesia, tampilkan opsi bunyi saja atau suara lain setelah pengguna mengetesnya. Pesan kebijakan baterai hanya ditampilkan jika relevan dan tidak menjanjikan bahwa pengaturan tertentu menyelesaikan semua perangkat.

### 6.4 Player aktif

Susunan satu kolom berpusat: header nama latihan + menu → badge **PUTARAN 3 DARI 8** bila relevan → label tahap **LARI** → timer paling besar **00:42** → progres tahap → teks **Berikutnya: Jalan · 02:00** → progres sesi dan total waktu → tombol utama **Jeda** → kontrol **Sebelumnya** dan **Lewati** → tindakan teks **Akhiri latihan** di bagian bawah yang terpisah secara visual.

Gunakan ruang kosong dari referensi Running untuk menenangkan player. Jangan menaruh kartu statistik empat kolom yang tidak digunakan. Tombol jeda boleh lingkaran 64 dp dengan label tepat di bawahnya, tetapi jika layar sempit/teks diperbesar, gunakan tombol persegi panjang full width agar label tidak terpotong. Saat dijeda, angka tidak bergerak; label **DIJEDA** dan tombol **Lanjut** jelas. Gunakan semantic label seperti “Jeda latihan, waktu tahap tersisa 42 detik”.

### 6.5 Selesai dan terputus

Layar selesai menampilkan ikon centang sederhana, **Latihan selesai**, waktu aktif dan durasi terencana, lalu **Ulangi latihan** dan **Kembali ke latihan**. Tidak menampilkan hasil distance/pace/kcal yang tidak diukur. Jika sesi diakhiri manual, judul **Latihan diakhiri**. Jika proses berhenti, judul **Sesi terputus**, penjelasan bahwa cue mungkin tidak berlangsung selama gangguan, tombol **Lanjut dari posisi tersimpan** dan **Mulai dari awal** sesuai kemampuan recovery yang terbukti.

### 6.6 Pengaturan dan privasi

Daftar sederhana: Suara, Bunyi, Countdown, Tes audio, Cara menggunakan layar terkunci, Kebijakan privasi, Kirim masukan, Versi. Tiap kelompok punya heading. Jangan membuat halaman profil, club, atau analytics kosong hanya untuk mengikuti referensi.

## 7. Responsivitas Android dan pencegahan overflow

Gunakan lebar **ruang aplikasi yang benar-benar tersedia** dalam logical pixels, bukan model perangkat atau orientasi sebagai satu-satunya kondisi. Flutter menganjurkan keputusan layout dari constraints (`LayoutBuilder`, `MediaQuery.sizeOf`) serta mempertahankan state saat rotasi/perubahan ukuran. [Panduan Flutter responsive](https://docs.flutter.dev/ui/adaptive-responsive), [praktik adaptive](https://docs.flutter.dev/ui/adaptive-responsive/best-practices).

| Ruang tersedia | Struktur |
| --- | --- |
| <360 dp | Satu kolom, padding 16 dp, tindakan editor boleh ditumpuk vertikal, timer adaptif, kartu tumbuh menurut teks |
| 360–599 dp | Satu kolom, padding 20 dp, tombol utama full width, footer aman |
| 600–839 dp | Konten utama maksimum 560 dp terpusat; editor dapat menampilkan pratinjau dalam sheet lebar atau panel jika muat |
| ≥840 dp | Editor dua panel: daftar blok fleksibel dan ringkasan 280–320 dp; player tetap terpusat maksimum 640 dp, tidak meregang selebar tablet |

Breakpoint adalah acuan implementasi, bukan pemicu berdasarkan nama “tablet”. Saat landscape atau split screen, jika tinggi sempit, gunakan scroll, bukan memaksa semua komponen terlihat sekaligus. Jangan kunci orientasi. Dalam dua panel, jika salah satu panel akan kurang dari 280 dp, kembali ke satu kolom. Keyboard, text scale, dan insets dihitung sebelum memutuskan kolom.

**Aturan teknis Flutter:**

- `SafeArea` dan `MediaQuery.viewInsetsOf(context)` untuk status/navigation bar dan keyboard; konten harus aman saat Android edge-to-edge. Hindari padding sistem ganda. [Panduan Android edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge).
- `LayoutBuilder` untuk kartu/editor/player yang bergantung pada constraints; `Flexible`/`Expanded` digunakan pada teks dan kolom sesuai konteks. Jangan menyelipkan `Expanded` ke parent dengan tinggi tak terbatas di dalam scroll.
- Daftar preset dan pratinjau panjang memakai `ListView.builder`/sliver; jangan memakai `Column` berisi 100 tahap tanpa scroll. `SingleChildScrollView` untuk halaman pendek yang isinya dinamis; nested scroll hanya jika ditangani jelas.
- Hindari `Stack` dan `Positioned` untuk elemen utama yang berisi teks; pakai `Column`, `Row`, `Wrap`, dan constraint. `Stack` hanya untuk dekorasi atau overlay yang aman.
- Jangan menggunakan `FittedBox` untuk mengecilkan seluruh halaman hingga sulit dibaca. Teks harus wrap, kartu bertambah tinggi, dan bila perlu tindakan pindah ke baris baru.
- Footer sticky menggunakan `Scaffold.bottomNavigationBar` atau slot setara dengan safe inset; konten scroll mempunyai padding bawah yang cukup. Pada keyboard terbuka, kontrol bawah tidak boleh menutup input.
- Pertahankan posisi list, draft editor, dan state player saat rotasi, resize, atau aplikasi dari background. UI tidak membuat ulang sesi native.

## 8. Keadaan interaksi dan copy

| Keadaan | Copy dan tindakan |
| --- | --- |
| Daftar preset kosong | “Belum ada latihan tersimpan.” + “Buat latihan” dan contoh yang bisa diedit |
| Durasi nol | “Isi durasi minimal 1 detik.” dekat field |
| Detik di luar batas | “Detik harus 0–59.” dekat field |
| Total >4 jam | “Total latihan maksimal 4 jam. Kurangi durasi atau putaran.” |
| Suara tak tersedia | “Suara Indonesia belum tersedia di perangkat ini. Coba bunyi atau suara lain.” + Tes audio |
| Izin notifikasi ditolak | Pesan yang menjelaskan dampak pada tampilan status sesi; arahkan ke pengaturan bila diperlukan, tanpa loop izin |
| Headset dilepas | “Headset terputus. Latihan dijeda.” + “Lanjut” |
| Sesi terputus | “Sesi sempat terhenti. Beberapa instruksi mungkin tidak terdengar.” + opsi pemulihan |
| Penyimpanan gagal | “Latihan belum tersimpan. Coba lagi.” dan jangan menutup editor |

Snackbar hanya untuk aksi ringan seperti preset diduplikasi. Kesalahan penyimpanan, audio, dan sesi terputus membutuhkan pesan yang menetap hingga pengguna bertindak. Konfirmasi Hapus/Akhiri menampilkan objek yang tepat dan dua tindakan yang tidak ambigu.

## 9. Aksesibilitas dan performa visual

Semua kontrol penting minimal 48 dp area sentuh, diurutkan secara logis untuk TalkBack, memiliki semantic label untuk ikon, dan punya state yang tidak bergantung pada warna. Berikan teks besar khusus player, tetapi tetap hormati pengaturan font sistem. Tidak ada animasi berulang; transisi kartu/tombol maksimal 150–220 ms dan menghormati reduced motion. Timer mengubah subtree kecil setiap detik, bukan membangun ulang seluruh layar.

Gunakan aset kecil: ikon vektor yang diperlukan saja, tidak ada foto full-screen sebagai background player, tidak ada chart berbasis gambar, dan tidak mengemas font berat. Screenshot referensi dengan foto atlet dianggap mood board untuk komposisi; rilis tidak perlu memperoleh lisensi foto agar tampil lengkap.

## 10. QA visual dan definition of done

Uji paling sedikit lebar logis **320, 360, 393, 430, 600, 840, dan 1024 dp**, tinggi pendek sekitar **568 dp**, portrait, landscape, split screen, dan text scale besar (misalnya 1.3× dan 2× jika tersedia). Sertakan keyboard numerik terbuka, nama preset 60 karakter, label 40 karakter, 100 tahap, pesan error, serta notifikasi sesi aktif. Pengujian pada emulator dilengkapi perangkat fisik Android.

**Kriteria lulus setiap layar:**

1. Tidak ada exception `RenderFlex overflowed`, elemen terpotong, tindakan tertutup insets/footer/keyboard, atau konten penting di luar jangkauan scroll.
2. Teks panjang membungkus sesuai hierarki; angka timer dan label tahap tidak saling menimpa pada ruang terkecil.
3. Jarak antarbagian mengikuti token; alignment kartu, ikon, label, dan nilai stabil pada seluruh state.
4. Tombol tetangga tidak saling bertabrakan saat font diperbesar, dan target sentuh tetap terpisah.
5. Dialog dan sheet muat pada tinggi pendek, dapat discroll, serta memiliki aksi Batal yang terlihat.
6. Perubahan orientasi atau ukuran jendela tidak mengulang sesi, menghapus draft, atau menghilangkan kontrol.
7. Layar player dapat dipahami dalam satu lirikan dan seluruh kontrol dapat dipakai sambil bergerak.

Ambil screenshot untuk tiap layar dan state penting pada ukuran sempit, normal, dan lebar. Perbaiki overflow sampai bersih sebelum menandai tugas UI selesai. Pemeriksaan visual dilakukan di build yang mendekati release untuk memastikan ukuran teks, insets, dan performa representatif.

## 11. Catatan implementasi desain

Dokumen ini memberi struktur visual dan aturan layout; implementasi audio latar belakang, service, izin, serta recovery mengikuti PRD Android dan hasil spike teknis. Jangan menambah halaman statistik atau fitur pengukuran semata agar layar menyerupai gambar referensi. Jika nama produk atau kemampuan rilis berubah, perbarui copy dan screenshot Play Store agar tetap sesuai dengan aplikasi.
