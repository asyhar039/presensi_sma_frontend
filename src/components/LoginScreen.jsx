export function LoginScreen({ form, onChange, onSubmit, message }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '20px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="mx-auto mb-3 text-primary d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.1)', fontSize: 32 }}>
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h4 className="fw-bold text-dark">ABSENSI SMA</h4>
            <p className="text-muted small">React UI untuk portal admin & guru</p>
          </div>

          {message ? <div className="alert alert-danger">{message}</div> : null}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input className="form-control form-control-lg" value={form.username} onChange={(e) => onChange('username', e.target.value)} placeholder="Masukkan username" required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control form-control-lg" value={form.password} onChange={(e) => onChange('password', e.target.value)} placeholder="Masukkan password" required />
            </div>
            <button className="btn btn-primary btn-lg w-100 fw-bold" type="submit">Masuk Sekarang</button>
          </form>

          <div className="mt-4 p-3 bg-light rounded-3 text-muted small">
            <strong>Credential Demo:</strong><br />
            • Admin: <code>admin</code> / <code>admin123</code><br />
            • Guru: <code>guru</code> / <code>guru123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
