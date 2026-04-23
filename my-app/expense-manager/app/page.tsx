export default function Home() {
  const deployments = [
    {
      name: "Frontend",
      url: "https://web-frontend-rho-opal.vercel.app/",
      note: "Main user interface",
    },
    {
      name: "API Health",
      url: "https://test-tau-flax-71.vercel.app/api/health",
      note: "Backend status endpoint",
    },
    {
      name: "expense-manager",
      url: "https://test-4e5b.vercel.app/",
      note: "This app's public URL",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 text-gray-900">
      <main className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Expense Manager Deployment</h1>
        <p className="mt-2 text-gray-600">
          Connected links for frontend, backend API, and this Next.js deployment.
        </p>

        <div className="mt-6 space-y-3">
          {deployments.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-200 p-4 transition hover:border-gray-400 hover:bg-gray-50"
            >
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 break-all text-sm text-gray-600">{item.url}</p>
              <p className="mt-1 text-sm text-gray-500">{item.note}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
