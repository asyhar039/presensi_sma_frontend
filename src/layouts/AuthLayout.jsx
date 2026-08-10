export default function AuthLayout({ children }) {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '20px' }}>
        <div className="card-body p-4">{children}</div>
      </div>
    </div>
  );
}
