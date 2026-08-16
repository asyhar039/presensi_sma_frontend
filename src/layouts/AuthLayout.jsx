export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_100%)]">
      <div className="w-full max-w-[420px] rounded-[20px] bg-white shadow-[0_1rem_3rem_rgba(0,0,0,0.175)]">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}