/**
 * Student Portal SPA Application Controller
 */
document.addEventListener('DOMContentLoaded', () => {
    let currentStudent = null;
    let html5QrcodeScanner = null;

    // Live Clock
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock-display').textContent = now.toLocaleTimeString('id-ID');
        document.getElementById('date-display').textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, 1000);

    // Check Student Session
    async function loadStudentData() {
        const res = await API.get('/student/profile.php');
        if (res.status === 'success' && res.data.student) {
            currentStudent = res.data.student;

            document.getElementById('student-login-card').classList.add('d-none');
            document.getElementById('student-dashboard').classList.remove('d-none');
            document.getElementById('student-header-info').classList.remove('d-none');
            document.getElementById('student-name-display').textContent = currentStudent.nama_lengkap;

            const { stats, history } = res.data;
            document.getElementById('stat-hadir').textContent = stats.Hadir || 0;
            document.getElementById('stat-izin').textContent = stats.Izin || 0;
            document.getElementById('stat-sakit').textContent = stats.Sakit || 0;
            document.getElementById('stat-alfa').textContent = stats.Alfa || 0;

            const historyContainer = document.getElementById('history-container');
            if (history.length > 0) {
                historyContainer.innerHTML = `
                    <table class="table table-dark table-striped text-center align-middle mb-0" style="border-radius: 12px; overflow: hidden;">
                        <thead>
                            <tr><th>Tanggal</th><th>Mata Pelajaran</th><th>Status</th><th>Keterangan</th></tr>
                        </thead>
                        <tbody>
                            ${history.map(h => `
                                <tr>
                                    <td>${h.tanggal_indo}</td>
                                    <td class="fw-bold">${h.nama_mapel}</td>
                                    <td><span class="badge ${h.status === 'Hadir' ? 'bg-success' : 'bg-warning'}">${h.status}</span></td>
                                    <td>${h.keterangan || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                historyContainer.innerHTML = '<div class="text-muted text-center py-3">Belum ada riwayat kehadiran</div>';
            }

            initQRScanner();
        } else {
            document.getElementById('student-login-card').classList.remove('d-none');
            document.getElementById('student-dashboard').classList.add('d-none');
            document.getElementById('student-header-info').classList.add('d-none');
        }
    }

    // Student Login
    document.getElementById('form-student-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('stud-username').value;
        const password = document.getElementById('stud-password').value;
        const alertBox = document.getElementById('student-login-alert');

        alertBox.classList.add('d-none');
        const res = await API.post('/auth/student_login.php', { username, password });

        if (res.status === 'success') {
            loadStudentData();
        } else {
            alertBox.textContent = res.message || 'Login gagal';
            alertBox.classList.remove('d-none');
        }
    });

    // Student Logout
    document.getElementById('btn-student-logout').addEventListener('click', async () => {
        await API.get('/auth/logout.php');
        if (html5QrcodeScanner) html5QrcodeScanner.clear();
        loadStudentData();
    });

    // Initialize QR Code Scanner
    function initQRScanner() {
        if (html5QrcodeScanner) return;

        html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } });

        async function onScanSuccess(decodedText) {
            try {
                // Now QR Code text is simply the token
                let payload = { token: decodedText };
                
                // Keep backward compatibility if they scan old static QRs
                if (decodedText.startsWith('{')) {
                    payload = JSON.parse(decodedText);
                } else if (decodedText.includes('jadwal_id=')) {
                    const urlParams = new URLSearchParams(decodedText.split('?')[1] || decodedText);
                    payload = {
                        jadwal_id: urlParams.get('jadwal_id'),
                        tanggal: urlParams.get('tanggal') || new Date().toISOString().split('T')[0]
                    };
                }

                if (payload.token || payload.jadwal_id) {
                    const scanRes = await API.post('/absensi/scan.php', payload);
                    const resBox = document.getElementById('scan-result');
                    resBox.classList.remove('d-none', 'alert-danger', 'alert-success');

                    if (scanRes.status === 'success') {
                        resBox.classList.add('alert-success');
                        resBox.textContent = scanRes.message;
                        loadStudentData();
                    } else {
                        resBox.classList.add('alert-danger');
                        resBox.textContent = scanRes.message;
                    }
                }
            } catch (err) {
                console.error("QR Code parsing error:", err);
            }
        }

        html5QrcodeScanner.render(onScanSuccess, () => {});
    }

    loadStudentData();
});
