export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] dark:bg-[linear-gradient(180deg,#060816_0%,#0b1020_100%)]">
      {/* Sidebar skeleton */}
      <aside className="fixed inset-y-0 left-0 hidden w-80 border-r border-slate-200/80 bg-white/85 px-5 py-6 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/78 lg:block">
        <div className="animate-pulse space-y-4">
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-11 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </aside>

      {/* Main skeleton */}
      <section className="lg:pl-80">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/72 px-5 py-4 backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-950/72 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="h-11 w-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="ml-auto h-11 w-11 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-5 px-5 py-6 sm:px-8 sm:py-8">
          {/* Hero card */}
          <div className="h-52 animate-pulse rounded-[2rem] bg-white dark:bg-slate-900" />

          {/* Metric cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-[1.75rem] bg-white dark:bg-slate-900" />
            ))}
          </div>

          {/* Generator */}
          <div className="h-64 animate-pulse rounded-[2rem] bg-white dark:bg-slate-900" />
        </div>
      </section>
    </div>
  );
}
