# Presensi SMA - Frontend Decoupled Client Application

Repositori ini berisi antarmuka pengguna **Frontend Single-Page Application (SPA)** yang sepenuhnya terpisah (*decoupled*) untuk Sistem Absensi SMA.

## 🎨 Fitur Frontend SPA
- **Modern UI & Glassmorphism Design System**: Tampilan premium dengan responsivitas tinggi, badge status absensi interaktif, modal dialog dinamis, dan toast notification.
- **Client-side Routing without Page Reload**: Pengalaman navigasi cepat tanpa reload halaman.
- **Dua Portal Utama**:
  1. `index.html` - **Portal Admin & Guru**:
     - Dashboard statistik interaktif.
     - Management CRUD Data Siswa, Data Guru, Data Kelas, Mata Pelajaran, dan Jadwal Pelajaran.
     - Sesi Input Absensi Massal per kelas dan mata pelajaran.
     - Filter Rekapitulasi Laporan Absensi bulanan.
  2. `absen.html` - **Portal Mandiri Siswa**:
     - Verifikasi identitas NISN siswa.
     - Live clock digital & tanggal.
     - Integrated **HTML5 QR Code Scanner** kamera untuk presensi mandiri via QR Code.
     - Statistik & histori presensi terbaru siswa.

## ⚙️ Konfigurasi URL Backend
File konfigurasi backend terletak di `assets/js/config.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost/presensi_sma_backend/api'
};
```

## 📁 Struktur Folder
```
presensi_sma_frontend/
├── index.html        # Portal Admin & Guru SPA
├── absen.html        # Portal Mandiri Siswa SPA
├── assets/
│   ├── css/
│   │   └── style.css # Design system stylesheet
│   └── js/
│       ├── config.js # Configuration file
│       ├── api.js    # Fetch API client wrapper
│       ├── app.js    # Admin & Guru SPA controller
│       └── student.js# Student SPA controller
└── README.md
```
