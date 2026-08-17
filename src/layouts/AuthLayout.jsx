const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#f1f5f9]">
      <div className="relative w-full max-w-[420px] rounded-[20px] bg-white shadow-[0_1rem_3rem_rgba(0,0,0,0.175)] overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#4f46e5] rounded-full blur-[70px] opacity-25"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#7c3aed] rounded-full blur-[90px] opacity-20"></div>
        <div className="relative p-4">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;