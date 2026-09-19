# RunCue Design Specification

**Versi:** 1.0 · **Acuan produk:** PRD RunCue · **Target utama:** browser Android, layar kecil hingga desktop

## 1. Arah visual

RunCue terasa ramah, energik, dan mudah dipahami seperti aplikasi belajar yang menyenangkan. Gunakan warna cerah, sudut membulat, teks tegas, tombol yang jelas, dan feedback singkat. Ambil *vibes* kemudahan Duolingo tanpa meniru logo, ilustrasi, maskot, tipografi khas, atau tata letak persisnya. Tidak ada maskot pada versi ini. Antarmuka tetap ringan: latar polos, sedikit bayangan, tidak ada animasi dekoratif terus-menerus, gradien besar, gambar stok, atau efek kaca.

Urutan perhatian pengguna adalah **tahap latihan → waktu tersisa → tindakan utama → tahap berikutnya**. Editor terasa seperti menyusun blok sederhana; player terasa seperti panel instruksi yang bisa dibaca dalam satu lirikan.

**Prinsip:** satu tindakan utama per layar; warna tidak menjadi satu-satunya penanda; ruang kosong disengaja; komponen konsisten; konten tetap aman ketika teks panjang, viewport sempit, font diperbesar, atau keyboard ponsel terbuka.

## 2. Design tokens

| Token | Nilai | Kegunaan |
| --- | --- | --- |
| `canvas` | `#F7F9F6` | Latar halaman yang lembut |
| `surface` | `#FFFFFF` | Kartu dan panel |
| `ink` | `#21312A` | Teks utama |
| `muted` | `#53645A` | Teks pendukung; pastikan kontras tetap terbaca |
| `line` | `#DCE6DF` | Border dan pemisah |
| `brand` | `#23884A` | Tombol utama dan progres |
| `brandHover` | `#1B713D` | Hover tombol utama |
| `brandPressed` | `#165D33` | Pressed tombol utama |
| `brandSoft` | `#E6F5E9` | Latar penekanan ringan |
| `run` | `#21824B` | Aksen tahap lari |
| `walk` | `#246CB7` | Aksen tahap jalan |
| `warmup` | `#A36B12` | Aksen pemanasan |
| `cooldown` | `#6255AD` | Aksen pendinginan |
| `danger` | `#B33A35` | Akhiri atau hapus; jangan dipakai untuk tombol utama |

Pakai warna aksen tahap pada ikon, badge, atau garis tepi kecil, bukan sebagai latar penuh yang mengurangi keterbacaan. Semua kombinasi teks dan latar harus memenuhi WCAG AA: minimal 4.5:1 untuk teks biasa dan 3:1 untuk teks besar atau komponen penting. Jika token di atas ternyata tidak memenuhi kombinasi tertentu, sesuaikan warna ketika implementasi; jangan memaksakan token.

**Tipografi:** gunakan font sistem (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif) agar cepat dimuat. Heading 28/34 px pada mobile dan 36/42 px pada desktop; judul kartu 18/26 px; body 16/24 px; teks bantu 14/21 px; angka timer memakai angka tabular (`font-variant-numeric: tabular-nums`) 64–88 px mobile dan maksimal 112 px desktop. Jangan memakai teks di bawah 12 px. Berat 600–800 untuk judul dan angka utama.

**Spacing:** skala `4, 8, 12, 16, 20, 24, 32, 40, 48` px. Padding horizontal halaman 16 px pada ponsel, 24 px pada tablet, 32 px pada desktop. Jarak antarbagian 24–32 px; jarak di dalam kartu 12–20 px. Radius kartu 20 px, input 14 px, tombol 16 px, badge 999 px. Border 1 px; bayangan kartu opsional dan sangat halus. Gunakan padding dan gap, jangan merapikan posisi memakai margin acak atau absolute positioning.

## 3. Kerangka layout responsif

| Lebar viewport | Struktur | Aturan |
| --- | --- | --- |
| 320–599 px | Satu kolom | Konten memenuhi lebar aman dengan padding 16 px. Aksi editor tersusun vertikal jika label tidak muat. Tidak ada horizontal scroll halaman. |
| 600–899 px | Satu kolom lebar sedang | Konten utama maksimal 680 px, terpusat. Ringkasan dapat berdampingan dengan opsi audio hanya jika keduanya tetap nyaman dibaca. |
| ≥900 px | Dua kolom pada editor | Kontainer maksimal 1120 px. Editor `minmax(0, 1fr)` dan panel ringkasan 300–340 px. Player tetap satu kolom terpusat maksimal 680 px. |

Header maksimal 1120 px, tinggi fleksibel, logo teks **RunCue** di kiri, navigasi singkat di kanan jika muat. Pada 320 px, header boleh membungkus ke dua baris. Gunakan `min-width: 0` pada anak grid/flex yang memuat teks panjang; label panjang harus membungkus atau dipotong secara terkontrol dengan judul lengkap tetap dapat diakses. Jangan tentukan tinggi tetap untuk kartu, header, modal, atau tombol yang menampung teks. Pakai `box-sizing: border-box` global; lebar elemen `max-width: 100%`.

**Safe area:** halaman dan kontrol bawah memakai `env(safe-area-inset-*)`. Jika tombol utama dibuat sticky pada mobile, beri latar solid, border atas, ruang bawah untuk safe area, dan padding bawah konten setinggi tombol agar langkah terakhir tidak tertutup. Saat keyboard terbuka, tombol sticky boleh kembali ke alur dokumen jika menutupi input. Panel ringkasan desktop boleh sticky dengan `top` aman tetapi berhenti di kontainernya; tidak boleh melapisi footer.

## 4. Komponen inti

### Tombol

| Varian | Tampilan | Penggunaan |
| --- | --- | --- |
| Primary | Hijau solid, teks putih tebal, border bawah sedikit lebih gelap untuk rasa taktil | Mulai latihan, Simpan preset, Lanjut |
| Secondary | Putih, border hijau/abu, teks gelap | Tes suara, Tambah langkah, Ulangi |
| Tertiary | Tanpa panel penuh, teks/ikon jelas | Edit, duplikasi, pindah urutan |
| Danger | Teks merah atau tombol merah hanya di dialog konfirmasi | Akhiri latihan, Hapus preset |

Tinggi minimum 48 px; target sentuh minimal 44×44 px; padding horizontal 16–20 px; label kalimat singkat, misalnya **Mulai latihan**. Tombol utama boleh full width di mobile dan lebar sesuai konten di desktop. Hover hanya untuk perangkat pointer; pressed jelas tanpa menggeser layout komponen lain. Disabled menggunakan warna redup tetapi tetap memperlihatkan label dan alasan dalam teks dekat tombol. Focus ring 3 px yang jelas dan tidak terpotong oleh `overflow: hidden`. Indikator loading menggantikan ikon di tempat yang sama agar tombol tidak berubah lebar.

### Input dan pengaturan

Semua input punya label di atasnya, bantuan ringkas di bawah bila perlu, dan pesan kesalahan spesifik di bawah input. Tinggi minimum 48 px. Durasi dibuat sebagai dua input numerik **menit** dan **detik** dengan label eksplisit; detik 0–59. Saat data dibaca kembali, tampilkan `mm:ss`. `inputmode="numeric"` membantu keyboard ponsel, tetapi validasi tetap wajib. Jangan menyembunyikan label hanya dalam placeholder. Sakelar suara, bunyi, dan countdown memiliki area sentuh penuh satu baris dan status tertulis Aktif/Nonaktif.

### Kartu langkah dan grup pengulangan

Kartu langkah berisi badge jenis, judul atau label, durasi yang paling mudah ditemukan, kontrol ubah urutan, duplikasi, dan hapus. Pada mobile, baris pertama berisi label + durasi; kontrol pindah/duplikasi/hapus di baris kedua yang boleh membungkus. Kontrol tidak boleh tumpang tindih dengan judul. Grup berulang berupa satu kartu dengan header **Ulangi 8 kali**, daftar langkah di dalamnya, dan latar sedikit berbeda. Indentasi maksimal satu tingkat; jangan menumpuk garis, kartu, dan bayangan berlapis.

Urutan dapat diubah dengan tombol **Naik** dan **Turun** yang berlabel aksesibel; drag-and-drop boleh menjadi tambahan desktop, bukan satu-satunya cara. Saat menghapus, fokus dipindahkan secara wajar ke kartu terdekat. Bila grup kosong sesaat selama editing, tampilkan ajakan **Tambahkan langkah** dan nonaktifkan mulai dengan penjelasan.

### Badge, progres, dan dialog

Badge tahap selalu memuat teks (**Lari**, **Jalan**, dan seterusnya) beserta warna. Progres berupa bar tipis 8–12 px, dengan nilai numerik yang juga tertulis. Dialog konfirmasi muat di viewport sempit (`width: min(100% - 32px, 440px)`), memiliki judul, penjelasan, batal, dan aksi berisiko; pada mobile tombol boleh ditumpuk. Dialog memiliki scroll internal hanya bila konten melebihi tinggi layar dan fokus terjaga.

## 5. Layar

### Beranda dan daftar preset

Header sederhana → hero singkat **Latihan interval tanpa terus melihat jam** → kartu preset contoh dengan durasi **34 menit** dan ringkasan **Pemanasan 5 menit · Lari/Jalan ×8 · Pendinginan 5 menit** → tombol **Mulai** dan **Ubah latihan** → daftar preset tersimpan. Pada layar kosong, tampilkan satu kartu ajakan membuat latihan. Jangan menampilkan grafik atau statistik yang belum ada dalam MVP. Kartu preset memakai menu tindakan yang mudah ditemukan untuk duplikasi dan hapus, dengan konfirmasi sebelum hapus.

### Editor latihan

Judul halaman **Susun latihan** → nama latihan → daftar kartu langkah/grup → tombol **Tambah langkah** dan **Tambah pengulangan** → panel ringkasan (durasi total, jumlah tahap, pratinjau urutan) → pengaturan audio → tindakan **Simpan preset** dan **Mulai latihan**. Pada mobile, ringkasan muncul setelah daftar langkah; sebelum tombol Mulai tetap tampil total durasi secara jelas. Pada desktop, ringkasan ada di kolom kanan. Batasi pratinjau panjang dengan kontrol **Lihat semua 18 tahap**, bukan memaksa 100 baris selalu terbuka.

**Contoh visual teks kartu:** `Lari · 01:00` dan `Jalan · 02:00` berada di dalam grup `Ulangi 8 kali`. Pastikan aksi Tambah Pengulangan tidak tampak seolah mengulang seluruh latihan bila hanya grup tertentu yang dipilih.

### Persiapan audio

Sebelum sesi pertama, tampilkan panel ringan: **Tes suara**, **Tes bunyi**, sakelar audio, dan pesan singkat **Pastikan volume headset terdengar. Instruksi ketika layar terkunci bergantung pada browser dan perangkat.** Tombol Mulai tetap jelas. Jangan memunculkan izin sistem yang tidak dibutuhkan. Jika suara gagal, jelaskan bahwa pengguna dapat memakai bunyi dan melihat layar.

### Player latihan

Kontainer satu kolom terpusat. Baris atas: tombol kembali yang tidak mengakhiri diam-diam, nama preset, dan progres keseluruhan. Tengah: badge tahap dan repetisi, judul **LARI**, timer besar `00:42`, bar progres, teks **Berikutnya: Jalan · 02:00**. Bawah: **Jeda** sebagai tombol dominan, **Kembali** dan **Lewati** sebagai secondary, **Akhiri latihan** sebagai tindakan tersendiri dengan konfirmasi. Saat jeda, teks besar **Dijeda** dan tombol **Lanjut** menggantikan Jeda. Gunakan `min-height: 100dvh` jika sesuai; pada layar pendek, konten harus bisa discroll, bukan mengecilkan timer sampai sulit dibaca atau menumpuk kontrol.

### Selesai

Judul **Latihan selesai** atau **Latihan diakhiri**, ringkasan waktu terencana dan waktu aktif, lalu **Ulangi latihan** serta **Kembali ke latihan**. Tidak perlu konfeti atau animasi berat; cukup feedback singkat dan tenang.

## 6. Keadaan dan microcopy

| Keadaan | Tampilan dan pesan |
| --- | --- |
| Belum ada preset | “Belum ada latihan tersimpan.” dan tombol “Buat latihan”. |
| Input tidak valid | “Isi durasi minimal 1 detik.” / “Detik harus antara 0 dan 59.” di dekat field. |
| Total melebihi batas | “Total latihan maksimal 4 jam. Kurangi durasi atau pengulangan.” |
| Audio suara tidak tersedia | “Suara tidak tersedia di browser ini. Bunyi dan instruksi di layar tetap bisa digunakan.” |
| Preset gagal disimpan | “Latihan belum tersimpan di perangkat. Periksa ruang penyimpanan browser lalu coba lagi.” Jangan klaim berhasil. |
| Tab kembali aktif setelah tertunda | “Waktu latihan sudah disesuaikan. Beberapa instruksi mungkin tidak terdengar saat aplikasi di latar belakang.” |
| Sesi dijeda | “Dijeda” dan waktu tetap. |

Pesan tidak boleh hilang terlalu cepat jika memuat informasi penting. Gunakan `aria-live="polite"` untuk status biasa dan batasi pengumuman pembaca layar agar timer tidak dibacakan tiap detik.

## 7. Gerak, aksesibilitas, dan performa

Transisi tombol dan progress 120–200 ms, tanpa motion yang mengganggu saat berlari. Hormati `prefers-reduced-motion`; nonaktifkan animasi yang tidak perlu. Tidak ada autoplay video atau font eksternal wajib. Ikon sederhana SVG inline atau satu pustaka ikon ringan dengan ukuran konsisten 20–24 px; teks selalu menjelaskan aksi penting. Target kontras WCAG AA; urutan tab mengikuti urutan visual; semua fungsi editor dan player dapat dioperasikan keyboard. Tampilkan fokus dengan jelas.

Tata letak tidak bergantung pada tinggi layar tetap. Jangan gunakan lebar piksel kaku untuk kolom utama, `position: absolute` untuk konten utama, `white-space: nowrap` pada teks dinamis, atau `overflow-x: hidden` pada halaman untuk menyembunyikan kesalahan layout. Jika nama preset panjang, bungkus maksimal dua baris pada kartu; di editor izinkan seluruh teks terlihat. Hormati zoom browser hingga 200% tanpa tombol tertutup.

## 8. Checklist implementasi dan QA visual

Uji halaman Beranda, Editor, Persiapan, Player, Selesai, dan semua dialog pada lebar **320, 360, 390, 430, 768, 1024, dan 1440 px**; uji tinggi pendek sekitar 568 px, orientasi lanskap, serta zoom 200%. Uji nama latihan panjang, label kustom panjang, 100 tahap pratinjau, pesan error, dan keyboard mobile terbuka.

Kriteria lulus:

1. `document.documentElement.scrollWidth <= window.innerWidth` pada seluruh lebar uji, kecuali elemen tertentu yang memang dirancang scroll horizontal dan diberi penanda jelas.
2. Tidak ada teks, tombol, timer, atau dialog yang keluar dari viewport, saling menimpa, atau tertutup sticky bar.
3. Jarak antarkartu dan antara label, input, bantuan, serta error konsisten dengan skala spacing.
4. Tombol aktif dapat disentuh tanpa menyentuh tombol tetangga; label tombol tidak terpotong.
5. Saat teks sistem diperbesar, komponen bertambah tinggi secara alami dan urutan konten tetap logis.
6. Dialog, error, loading, empty state, paused state, dan completed state memiliki tata letak yang selesai, bukan hanya happy path.
7. Layar player terbaca sekilas di luar ruangan dan masih bisa digunakan pada layar pendek tanpa elemen bertumpuk.

**Panduan akhir untuk coding agent:** implementasikan komponen dari tokens yang sama; ambil screenshot pada seluruh breakpoint utama; perbaiki overflow dan overlap sebelum menganggap satu layar selesai. Keindahan visual tidak boleh dicapai dengan mengorbankan keterbacaan atau keandalan kontrol saat latihan.
