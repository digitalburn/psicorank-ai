"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Home,
  LogOut,
  Menu,
  MoonStar,
  Search,
  Settings,
  Sparkles,
  Star,
  SunMedium,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { PlanStatus } from "@/components/plan-status";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Overview", icon: Home, href: "/dashboard" },
  { label: "Posts IA", icon: Sparkles, href: "/dashboard#instagram" },
  { label: "SEO local", icon: FileText, href: "/dashboard#google" },
  { label: "Avaliacoes", icon: Star, href: "/dashboard#reviews" },
  { label: "Calendario", icon: CalendarDays, href: "/dashboard#calendar", comingSoon: true },
  { label: "Relatorios", icon: BarChart3, href: "/dashboard#reports", comingSoon: true },
  { label: "Configuracoes", icon: Settings, href: "/dashboard#settings", comingSoon: true },
];

const shellVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};


export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hash, setHash] = useState("");

  const activePath = useMemo(() => pathname ?? "/dashboard", [pathname]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(180deg,#e2e8f0_0%,#dde4f0_100%)] text-slate-950 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(180deg,#060816_0%,#0b1020_100%)] dark:text-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 overflow-y-auto border-r border-slate-300/80 bg-slate-100/95 px-5 py-6 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-950/78 lg:block">
        <SidebarContent activePath={activePath} hash={hash} user={user} onSignOut={signOut} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm overflow-y-auto border-r border-slate-200/80 bg-white px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.24)] dark:border-slate-800 dark:bg-slate-950 lg:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-start justify-between gap-4">
                <AppLogo />
                <Button variant="ghost" className="size-10 rounded-full p-0" onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                  <X className="size-4" />
                </Button>
              </div>
              <div className="mt-8">
                <SidebarContent activePath={activePath} hash={hash} user={user} onSignOut={signOut} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <section className="lg:pl-80">
        <header className="sticky top-0 z-20 border-b border-slate-300/70 bg-slate-100/90 px-5 py-4 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-800/70 dark:bg-slate-950/72 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <Button variant="ghost" className="size-11 rounded-full p-0" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
                <Menu className="size-4" />
              </Button>
              <AppLogo />
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <div className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] dark:bg-white dark:text-slate-950">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Workspace premium
                </p>
                <h1 className="text-lg font-bold text-slate-950 dark:text-white">
                  Crescimento local com IA
                </h1>
              </div>
            </div>

            <div className="hidden min-w-0 flex-1 lg:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value.toLowerCase();
                  const map: Array<[string[], string]> = [
                    [["post", "instagram", "legenda", "hashtag"], "#instagram"],
                    [["seo", "google", "local", "cidade"], "#google"],
                    [["avaliacao", "review", "gmb", "negocio"], "#reviews"],
                    [["historico", "conteudo", "salvo"], "#historico"],
                  ];
                  const match = map.find(([keys]) => keys.some((k) => q.includes(k)));
                  if (match) window.location.hash = match[1];
                }}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <Search className="size-4 shrink-0 text-slate-400" />
                <input
                  name="search"
                  className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                  placeholder="Pesquisar — posts, SEO, avaliações, histórico..."
                />
              </form>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                className="size-11 rounded-full p-0"
                aria-label="Alternar tema"
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
              </Button>
              {user && (
                <div className="hidden items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex">
                  <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-mint to-cyan-400 text-xs font-bold text-white">
                    {(user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "U")
                      .split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("") || "?"}
                  </div>
                  <span className="max-w-[120px] truncate text-sm font-semibold text-slate-950 dark:text-white">
                    {user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <motion.div
          className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8"
          variants={shellVariants}
          initial="hidden"
          animate="show"
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}

function SidebarContent({
  activePath,
  hash,
  user,
  onSignOut,
}: {
  activePath: string;
  hash: string;
  user: User | null;
  onSignOut: () => Promise<void>;
}) {
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/75">
        <div className="flex items-center justify-between gap-3">
          <AppLogo />
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Live
          </span>
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-[0_20px_45px_rgba(15,23,42,0.28)] dark:bg-slate-100 dark:text-slate-950">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/55 dark:text-slate-500">
            Sinal do dia
          </p>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold">+34%</p>
              <p className="mt-1 text-sm text-white/68 dark:text-slate-600">
                Crescimento na descoberta local
              </p>
            </div>
            <div className="h-16 w-20 rounded-2xl bg-white/8 dark:bg-slate-950/5" />
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400"
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.label}</span>
                <span className="ml-auto rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  em breve
                </span>
              </div>
            );
          }

          const isActive = item.href.includes("#")
            ? hash === new URL(item.href, "https://local.test").hash
            : activePath === item.href;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200",
                isActive
                  ? "bg-white text-slate-900 shadow-[0_16px_36px_rgba(15,23,42,0.2)] dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
              )}
              href={item.href}
              key={item.label}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">Proximos passos</p>
        <div className="mt-4 space-y-3">
          {[
            { label: "Gere um post para Instagram", href: "/dashboard#instagram" },
            { label: "Crie um pacote de SEO local", href: "/dashboard#google" },
            { label: "Conecte o Google Meu Negocio", href: "/dashboard#reviews" },
          ].map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 transition hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900"
            >
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <PlanStatus />

      {/* User card */}
      <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-mint to-cyan-400 text-sm font-bold text-white shadow">
            {initials || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-800 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Sair da conta
        </button>
      </div>
    </>
  );
}
