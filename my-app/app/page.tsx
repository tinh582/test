export default function Home() {
  const links = [
    {
      label: "Frontend (Vite)",
      href: "https://web-frontend-rho-opal.vercel.app/",
      desc: "Main UI for expense tracking",
    },
    {
      label: "my-app API Health",
      href: "https://test-tau-flax-71.vercel.app/api/health",
      desc: "Backend API health check",
    },
    {
      label: "expense-manager (Next.js)",
      href: "https://test-4e5b.vercel.app/",
      desc: "Secondary Next.js deployment",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-900">
      <main className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Web QL Chi Tieu - API Hub</h1>
        <p className="mt-2 text-slate-600">
          This deployment hosts API routes for your frontend and provides quick access
          to all live environments.
        </p>

        <div className="mt-6 grid gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <p className="font-semibold">{link.label}</p>
              <p className="mt-1 break-all text-sm text-slate-600">{link.href}</p>
              <p className="mt-1 text-sm text-slate-500">{link.desc}</p>
            </a>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-500">
          API base URL for frontend: https://test-tau-flax-71.vercel.app/api
        </p>
      </main>
    </div>
  );
}
