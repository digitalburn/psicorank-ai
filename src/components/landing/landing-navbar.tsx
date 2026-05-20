"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MoonStar, SunMedium, X } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Plataforma", href: "#plataforma" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const sysDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const t = saved === "dark" || (!saved && sysDark) ? "dark" : "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-slate-200/60 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-[#060816]/90"
            : "bg-transparent",
        )}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.2, 0.85, 0.2, 1] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <AppLogo />

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Alternar tema"
              className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
            </button>

            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white md:block"
            >
              Entrar
            </Link>

            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.3)] dark:bg-white dark:text-slate-950 md:inline-flex"
            >
              Começar grátis
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-72 border-l border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-[#060816] md:hidden"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid size-10 place-items-center rounded-full border border-slate-200 dark:border-slate-800"
                  aria-label="Fechar"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold dark:border-slate-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                  Começar grátis
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
