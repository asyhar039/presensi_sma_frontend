/**
 * Admin & Teacher SPA Controller Application
 */
document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;

    // Toast helper
    window.showToast = function(msg, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'custom-toast-msg';
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'exclamation-triangle text-danger'}"></i> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    // Check Auth State
    async function checkAuth() {
        const res = await API.get('/auth/me.php');
        if (res.status === 'success' && res.data.user) {
            currentUser = res.data.user;
            document.getElementById('login-screen').classList.add('d-none');
            document.getElementById('user-fullname').textContent = currentUser.nama_lengkap;
            document.getElementById('user-role').textContent = `Role: ${currentUser.role.toUpperCase()}`;
            document.getElementById('user-avatar').textContent = currentUser.nama_lengkap.charAt(0).toUpperCase();
            
            // Handle Navigation
            handleRoute();
        } else {
            document.getElementById('login-screen').classList.remove('d-none');
        }
    }

    // Login Form Submit
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const alertBox = document.getElementById('login-alert');

        alertBox.classList.add('d-none');
        const res = await API.post('/auth/login.php', { username, password });

        if (res.status === 'success') {
            checkAuth();
        } else {
            alertBox.textContent = res.message || 'Login gagal';
            alertBox.classList.remove('d-none');
        }
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', async () => {
        await API.get('/auth/logout.php');
        currentUser = null;
        document.getElementById('login-screen').classList.remove('d-none');
    });

    // Navigation Router
    window.addEventListener('hashchange', handleRoute);

    function handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-view') === hash);
        });

        const titles = {
            dashboard: 'Dashboard Utama',
            siswa: 'Manajemen Data Siswa',
            guru: 'Manajemen Data Guru',
            kelas: 'Manajemen Data Kelas',
            mapel: 'Data Mata Pelajaran',
            jadwal: 'Jadwal Pelajaran Sekolah',
            absensi: 'Input & Manajemen Absensi',
            laporan: 'Rekap Laporan Absensi'
        };

        document.getElementById('page-title').textContent = titles[hash] || 'Dashboard';

        switch(hash) {
            case 'dashboard': renderDashboard(); break;
            case 'siswa': renderSiswa(); break;
            case 'guru': renderGuru(); break;
            case 'kelas': renderKelas(); break;
            case 'mapel': renderMapel(); break;
            case 'jadwal': renderJadwal(); break;
            case 'absensi': renderAbsensi(); break;
            case 'laporan': renderLaporan(); break;
            default: renderDashboard();
        }
    }

    // 1. DASHBOARD VIEW
    async function renderDashboard() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const res = await API.get('/dashboard/stats.php');
        if (res.status !== 'success') {
            container.innerHTML = `<div class="alert alert-danger">${res.message}</div>`;
            return;
        }

        const { totals, today_attendance, today_date } = res.data;

        container.innerHTML = `
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="icon-box bg-primary"><i class="fas fa-users"></i></div>
                        <div>
                            <div class="val text-primary">${totals.total_siswa}</div>
                            <div class="lbl">Total Siswa</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="icon-box bg-success"><i class="fas fa-chalkboard-teacher"></i></div>
                        <div>
                            <div class="val text-success">${totals.total_guru}</div>
                            <div class="lbl">Total Guru</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="icon-box bg-warning"><i class="fas fa-school"></i></div>
                        <div>
                            <div class="val text-warning">${totals.total_kelas}</div>
                            <div class="lbl">Total Kelas</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="icon-box bg-info"><i class="fas fa-book"></i></div>
                        <div>
                            <div class="val text-info">${totals.total_mapel}</div>
                            <div class="lbl">Mata Pelajaran</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-custom">
                <h5 class="fw-bold mb-3"><i class="fas fa-clipboard-list text-primary me-2"></i> Ringkasan Absensi Hari Ini (${today_date})</h5>
                <div class="row text-center g-3">
                    <div class="col-3">
                        <div class="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                            <div class="fs-2 fw-bold">${today_attendance.Hadir}</div>
                            <div class="small fw-semibold">Hadir</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="p-3 rounded-3 bg-info bg-opacity-10 text-info">
                            <div class="fs-2 fw-bold">${today_attendance.Izin}</div>
                            <div class="small fw-semibold">Izin</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                            <div class="fs-2 fw-bold">${today_attendance.Sakit}</div>
                            <div class="small fw-semibold">Sakit</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="p-3 rounded-3 bg-danger bg-opacity-10 text-danger">
                            <div class="fs-2 fw-bold">${today_attendance.Alfa}</div>
                            <div class="small fw-semibold">Alfa</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. SISWA VIEW
    async function renderSiswa() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const [resSiswa, resKelas] = await Promise.all([
            API.get('/siswa/index.php'),
            API.get('/kelas/index.php')
        ]);

        const siswaList = resSiswa.data || [];
        const kelasList = resKelas.data || [];

        container.innerHTML = `
            <div class="card-custom">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold m-0"><i class="fas fa-user-graduate text-primary me-2"></i> Data Seluruh Siswa</h5>
                    ${currentUser.role === 'admin' ? '<button class="btn btn-primary fw-bold" id="btn-add-siswa"><i class="fas fa-plus me-1"></i> Tambah Siswa</button>' : ''}
                </div>

                <div class="table-responsive">
                    <table class="table-custom">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NISN</th>
                                <th>Nama Lengkap</th>
                                <th>L/P</th>
                                <th>Kelas</th>
                                <th>No. Telp</th>
                                ${currentUser.role === 'admin' ? '<th class="text-end">Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${siswaList.map((s, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td class="fw-bold">${s.nisn}</td>
                                    <td>${s.nama_lengkap}</td>
                                    <td>${s.jenis_kelamin}</td>
                                    <td><span class="badge bg-secondary">${s.nama_kelas || '-'}</span></td>
                                    <td>${s.no_telp || '-'}</td>
                                    ${currentUser.role === 'admin' ? `
                                        <td class="text-end">
                                            <button class="btn btn-sm btn-outline-danger btn-delete-siswa" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        if (document.getElementById('btn-add-siswa')) {
            document.getElementById('btn-add-siswa').onclick = () => {
                const modal = new bootstrap.Modal(document.getElementById('app-modal'));
                document.getElementById('modal-title').textContent = 'Tambah Siswa Baru';
                document.getElementById('modal-body').innerHTML = `
                    <form id="form-siswa">
                        <div class="mb-3">
                            <label class="form-label">NISN</label>
                            <input type="text" class="form-control" name="nisn" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nama Lengkap</label>
                            <input type="text" class="form-control" name="nama_lengkap" required>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">Jenis Kelamin</label>
                                <select class="form-select" name="jenis_kelamin" required>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">Kelas</label>
                                <select class="form-select" name="kelas_id" required>
                                    ${kelasList.map(k => `<option value="${k.id}">${k.nama_kelas}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 fw-bold">Simpan Siswa</button>
                    </form>
                `;

                document.getElementById('form-siswa').onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    const res = await API.post('/siswa/index.php', data);
                    if (res.status === 'success') {
                        modal.hide();
                        showToast('Siswa berhasil ditambahkan');
                        renderSiswa();
                    } else showToast(res.message, 'error');
                };

                modal.show();
            };
        }

        document.querySelectorAll('.btn-delete-siswa').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Yakin ingin menghapus siswa ini?')) {
                    const res = await API.delete(`/siswa/index.php?id=${btn.dataset.id}`);
                    if (res.status === 'success') {
                        showToast('Siswa berhasil dihapus');
                        renderSiswa();
                    } else showToast(res.message, 'error');
                }
            };
        });
    }

    // 3. GURU VIEW
    async function renderGuru() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const res = await API.get('/guru/index.php');
        const guruList = res.data || [];

        container.innerHTML = `
            <div class="card-custom">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold m-0"><i class="fas fa-chalkboard-teacher text-primary me-2"></i> Data Guru</h5>
                </div>
                <div class="table-responsive">
                    <table class="table-custom">
                        <thead>
                            <tr><th>No</th><th>NIP</th><th>Nama Lengkap</th><th>Email</th><th>No. Telp</th></tr>
                        </thead>
                        <tbody>
                            ${guruList.map((g, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td class="fw-bold">${g.nip}</td>
                                    <td>${g.nama_lengkap}</td>
                                    <td>${g.email || '-'}</td>
                                    <td>${g.no_telp || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 4. KELAS VIEW
    async function renderKelas() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const res = await API.get('/kelas/index.php');
        const kelasList = res.data || [];

        container.innerHTML = `
            <div class="card-custom">
                <h5 class="fw-bold mb-3"><i class="fas fa-school text-primary me-2"></i> Data Kelas</h5>
                <div class="table-responsive">
                    <table class="table-custom">
                        <thead>
                            <tr><th>No</th><th>Nama Kelas</th><th>Tingkat</th><th>Jurusan</th><th>Wali Kelas</th></tr>
                        </thead>
                        <tbody>
                            ${kelasList.map((k, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td class="fw-bold">${k.nama_kelas}</td>
                                    <td>${k.tingkat}</td>
                                    <td>${k.jurusan || '-'}</td>
                                    <td>${k.guru_nama || 'Belum Ditentukan'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 5. MAPEL VIEW
    async function renderMapel() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const res = await API.get('/mapel/index.php');
        const mapelList = res.data || [];

        container.innerHTML = `
            <div class="card-custom">
                <h5 class="fw-bold mb-3"><i class="fas fa-book-open text-primary me-2"></i> Mata Pelajaran</h5>
                <div class="table-responsive">
                    <table class="table-custom">
                        <thead>
                            <tr><th>No</th><th>Kode Mapel</th><th>Nama Mapel</th><th>Guru Pengampu</th></tr>
                        </thead>
                        <tbody>
                            ${mapelList.map((m, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><span class="badge bg-primary">${m.kode_mapel}</span></td>
                                    <td class="fw-bold">${m.nama_mapel}</td>
                                    <td>${m.guru_nama || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 6. JADWAL VIEW
    async function renderJadwal() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const res = await API.get('/jadwal/index.php');
        const jadwalList = res.data || [];

        container.innerHTML = `
            <div class="card-custom">
                <h5 class="fw-bold mb-3"><i class="fas fa-calendar-alt text-primary me-2"></i> Jadwal Pelajaran</h5>
                <div class="table-responsive">
                    <table class="table-custom">
                        <thead>
                            <tr><th>No</th><th>Hari</th><th>Jam</th><th>Kelas</th><th>Mata Pelajaran</th><th>Guru</th></tr>
                        </thead>
                        <tbody>
                            ${jadwalList.map((j, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><span class="badge bg-dark">${j.hari}</span></td>
                                    <td>${j.jam_mulai} - ${j.jam_selesai}</td>
                                    <td class="fw-bold">${j.nama_kelas}</td>
                                    <td>${j.nama_mapel}</td>
                                    <td>${j.guru_nama}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 7. ABSENSI VIEW
    async function renderAbsensi() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const resJadwal = await API.get('/jadwal/index.php');
        const jadwalList = resJadwal.data || [];

        container.innerHTML = `
            <div class="card-custom mb-4">
                <h5 class="fw-bold mb-3"><i class="fas fa-clipboard-check text-primary me-2"></i> Pilih Sesi Pelajaran</h5>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Pilih Jadwal Pelajaran</label>
                        <select id="select-jadwal" class="form-select">
                            <option value="">-- Pilih Jadwal --</option>
                            ${jadwalList.map(j => `<option value="${j.id}">${j.nama_kelas} - ${j.nama_mapel} (${j.hari}, ${j.jam_mulai})</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Tanggal Absensi</label>
                        <input type="date" id="input-tanggal-absen" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button id="btn-load-attendees" class="btn btn-primary w-100 fw-bold">Tampilkan</button>
                    </div>
                </div>
            </div>
            <div id="attendees-container"></div>
        `;

        document.getElementById('btn-load-attendees').onclick = async () => {
            const jId = document.getElementById('select-jadwal').value;
            const tgl = document.getElementById('input-tanggal-absen').value;
            if (!jId) { showToast('Pilih jadwal terlebih dahulu', 'error'); return; }

            const res = await API.get(`/absensi/input.php?jadwal_id=${jId}&tanggal=${tgl}`);
            if (res.status !== 'success') { showToast(res.message, 'error'); return; }

            const { jadwal, attendees } = res.data;
            const attContainer = document.getElementById('attendees-container');

            attContainer.innerHTML = `
                <div class="card-custom">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold m-0">Input Presensi: ${jadwal.nama_kelas} - ${jadwal.nama_mapel}</h5>
                        <div>
                            <button id="btn-generate-qr" class="btn btn-primary fw-bold me-2"><i class="fas fa-qrcode me-1"></i> Generate QR Presensi</button>
                            <button id="btn-save-absensi" class="btn btn-success fw-bold"><i class="fas fa-save me-1"></i> Simpan Absensi Massal</button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table-custom">
                            <thead>
                                <tr><th>NISN</th><th>Nama Siswa</th><th>Status Presence</th><th>Keterangan</th></tr>
                            </thead>
                            <tbody>
                                ${attendees.map(a => `
                                    <tr class="row-student" data-siswa-id="${a.siswa_id}">
                                        <td class="fw-bold">${a.nisn}</td>
                                        <td>${a.nama_lengkap}</td>
                                        <td>
                                            <select class="form-select form-select-sm select-status">
                                                <option value="Hadir" ${a.status === 'Hadir' ? 'selected' : ''}>Hadir</option>
                                                <option value="Izin" ${a.status === 'Izin' ? 'selected' : ''}>Izin</option>
                                                <option value="Sakit" ${a.status === 'Sakit' ? 'selected' : ''}>Sakit</option>
                                                <option value="Alfa" ${a.status === 'Alfa' ? 'selected' : ''}>Alfa</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input type="text" class="form-control form-control-sm input-keterangan" value="${a.keterangan || ''}" placeholder="Alasan jika izin/sakit">
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            document.getElementById('btn-save-absensi').onclick = async () => {
                const rows = document.querySelectorAll('.row-student');
                const payload = [];
                rows.forEach(r => {
                    payload.push({
                        siswa_id: r.dataset.siswaId,
                        status: r.querySelector('.select-status').value,
                        keterangan: r.querySelector('.input-keterangan').value
                    });
                });

                const saveRes = await API.post('/absensi/input.php', {
                    jadwal_id: jId,
                    tanggal: tgl,
                    attendees: payload
                });

                if (saveRes.status === 'success') {
                    showToast('Absensi berhasil disimpan!');
                } else showToast(saveRes.message, 'error');
            };

            document.getElementById('btn-generate-qr').onclick = () => {
                const modal = new bootstrap.Modal(document.getElementById('app-modal'));
                document.getElementById('modal-title').textContent = 'Generate QR Code Presensi';
                document.getElementById('modal-body').innerHTML = `
                    <form id="form-generate-qr">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Pilih Durasi Kedaluwarsa QR Code</label>
                            <select class="form-select" name="durasi" required>
                                <option value="5">5 Menit</option>
                                <option value="15" selected>15 Menit</option>
                                <option value="30">30 Menit</option>
                                <option value="60">60 Menit</option>
                                <option value="120">2 Jam</option>
                            </select>
                            <small class="text-muted">Setelah waktu habis, QR Code tidak dapat dipindai lagi oleh siswa.</small>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 fw-bold"><i class="fas fa-qrcode me-2"></i> Tampilkan QR Code</button>
                    </form>
                `;

                document.getElementById('form-generate-qr').onsubmit = async (e) => {
                    e.preventDefault();
                    const durasi = new FormData(e.target).get('durasi');
                    const btn = e.target.querySelector('button');
                    btn.disabled = true;
                    btn.innerHTML = 'Memproses...';

                    const res = await API.post('/absensi/generate_qr.php', {
                        jadwal_id: jId,
                        tanggal: tgl,
                        durasi: durasi
                    });

                    if (res.status === 'success') {
                        const token = res.data.token;
                        const expiresAt = new Date(res.data.expires_at).getTime();

                        // Render QR Code View
                        document.getElementById('modal-title').innerHTML = '<i class="fas fa-qrcode text-primary"></i> Scan Presensi Sekarang';
                        document.getElementById('modal-body').innerHTML = `
                            <div class="text-center">
                                <h4 class="fw-bold mb-1">${jadwal.nama_mapel}</h4>
                                <p class="text-muted mb-4">Kelas ${jadwal.nama_kelas} | ${tgl}</p>
                                
                                <div id="qrcode-display" class="d-inline-block p-3 bg-white rounded-4 shadow-sm mb-4"></div>
                                
                                <div class="alert alert-warning mb-0">
                                    <h5 class="fw-bold mb-1" id="qr-timer">00:00</h5>
                                    <small>Waktu tersisa sebelum QR Code kedaluwarsa</small>
                                </div>
                            </div>
                        `;

                        // Generate QR Code Image
                        new QRCode(document.getElementById("qrcode-display"), {
                            text: token,
                            width: 250,
                            height: 250,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                        });

                        // Timer logic
                        const timerInterval = setInterval(() => {
                            const now = new Date().getTime();
                            const distance = expiresAt - now;

                            if (distance < 0) {
                                clearInterval(timerInterval);
                                document.getElementById('qr-timer').textContent = "WAKTU HABIS";
                                document.getElementById('qr-timer').parentElement.className = "alert alert-danger mb-0";
                                document.getElementById('qrcode-display').style.opacity = "0.2";
                            } else {
                                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                document.getElementById('qr-timer').textContent = 
                                    minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
                            }
                        }, 1000);

                        // Cleanup timer when modal is closed
                        document.getElementById('app-modal').addEventListener('hidden.bs.modal', function onModalHide() {
                            clearInterval(timerInterval);
                            document.getElementById('app-modal').removeEventListener('hidden.bs.modal', onModalHide);
                            document.getElementById('btn-load-attendees').click(); // Refresh data
                        });
                    } else {
                        showToast(res.message, 'error');
                        btn.disabled = false;
                        btn.innerHTML = 'Tampilkan QR Code';
                    }
                };

                modal.show();
            };
        };
    }

    // 8. LAPORAN VIEW
    async function renderLaporan() {
        const container = document.getElementById('view-container');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        const resKelas = await API.get('/kelas/index.php');
        const kelasList = resKelas.data || [];

        container.innerHTML = `
            <div class="card-custom mb-4">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Pilih Kelas</label>
                        <select id="select-laporan-kelas" class="form-select">
                            ${kelasList.map(k => `<option value="${k.id}">${k.nama_kelas}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Bulan</label>
                        <select id="select-laporan-bulan" class="form-select">
                            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(m => `<option value="${m}" ${m === new Date().getMonth() + 1 ? 'selected' : ''}>Bulan ${m}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Tahun</label>
                        <input type="number" id="input-laporan-tahun" class="form-control" value="${new Date().getFullYear()}">
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button id="btn-load-laporan" class="btn btn-primary w-100 fw-bold">Filter</button>
                    </div>
                </div>
            </div>
            <div id="laporan-result-container"></div>
        `;

        const loadReport = async () => {
            const kId = document.getElementById('select-laporan-kelas').value;
            const bln = document.getElementById('select-laporan-bulan').value;
            const thn = document.getElementById('input-laporan-tahun').value;

            const res = await API.get(`/absensi/laporan.php?kelas_id=${kId}&bulan=${bln}&tahun=${thn}`);
            if (res.status !== 'success') return;

            const { kelas, bulan_nama, laporan } = res.data;
            document.getElementById('laporan-result-container').innerHTML = `
                <div class="card-custom">
                    <h5 class="fw-bold mb-3">Rekapitulasi Absensi: Kelas ${kelas?.nama_kelas || ''} (${bulan_nama} ${thn})</h5>
                    <div class="table-responsive">
                        <table class="table-custom text-center">
                            <thead>
                                <tr><th class="text-start">Nama Siswa</th><th>NISN</th><th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alfa</th><th>Persentase</th></tr>
                            </thead>
                            <tbody>
                                ${laporan.map(l => `
                                    <tr>
                                        <td class="text-start fw-bold">${l.nama_lengkap}</td>
                                        <td>${l.nisn}</td>
                                        <td><span class="badge badge-hadir">${l.total_hadir}</span></td>
                                        <td><span class="badge badge-izin">${l.total_izin}</span></td>
                                        <td><span class="badge badge-sakit">${l.total_sakit}</span></td>
                                        <td><span class="badge badge-alfa">${l.total_alfa}</span></td>
                                        <td class="fw-bold text-primary">${l.persentase_hadir}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        };

        document.getElementById('btn-load-laporan').onclick = loadReport;
        loadReport();
    }

    // Run Initial Auth Check
    checkAuth();
});
