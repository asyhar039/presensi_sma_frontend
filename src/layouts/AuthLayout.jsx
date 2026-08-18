import firstBg from '../assets/images/backgrounds/first_bg.png';

const AuthLayout = ({ children }) => {
  return (
    <div
      className="relative min-h-dvh w-full overflow-y-auto overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${firstBg})` }}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" aria-hidden="true"></div>
      <div className="relative z-10 flex min-h-dvh w-full items-center justify-center pt-[calc(env(safe-area-inset-top,0px)+2rem)] pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] pl-[calc(env(safe-area-inset-left,0px)+1rem)] pr-[calc(env(safe-area-inset-right,0px)+1rem)]">
        <div className="relative w-full max-w-[420px] rounded-[20px] bg-white/95 backdrop-blur-md shadow-[0_1rem_3rem_rgba(0,0,0,0.175)] overflow-hidden z-10">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#4f46e5] rounded-full blur-[70px] opacity-25"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#7c3aed] rounded-full blur-[90px] opacity-20"></div>
          <div className="relative p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;