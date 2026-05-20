export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#060816]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-mint" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-mint/20 to-cyan-400/20" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Carregando...</p>
      </div>
    </div>
  );
}
