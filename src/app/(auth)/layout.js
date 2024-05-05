export default function AuthLayout({ children }) {
  return (
    <div className="relative flex h-screen w-full items-center justify-center  bg-slate-600">
      {children}
    </div>
  );
}
