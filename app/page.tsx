export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">SVA Learning Management System</h1>
        <p className="text-lg mb-4">Scientia Vitae Academy - Production Educational Infrastructure</p>
        <div className="mt-8 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: Core data layer initialized with Drizzle ORM
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Next steps: Generate migrations, implement RBAC, build dashboards
          </p>
        </div>
      </div>
    </main>
  );
}

