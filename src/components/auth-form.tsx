"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";
type LoadingAction = "credentials" | "google" | null;

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const isLoading = loadingAction !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingAction("credentials");
    setStatus(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name,
                },
              },
            });

      if (result.error) {
        setStatus(result.error.message);
        return;
      }

      if (mode === "login") {
        const redirect = searchParams.get("redirect");
        const plan = searchParams.get("plan");
        if (redirect === "checkout" && (plan === "pro" || plan === "clinic")) {
          const res = await fetch("/api/asaas/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan, billing: "monthly" }),
          });
          const data = (await res.json()) as { url?: string };
          if (data.url) { window.location.href = data.url; return; }
        }
        router.push("/dashboard");
        return;
      }

      setStatus(
        "Cadastro criado! Verifique seu e-mail para confirmar a conta antes de entrar.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel autenticar.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleGoogleLogin() {
    setLoadingAction("google");
    setStatus(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setStatus(error.message);
        setLoadingAction(null);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao foi possivel entrar com Google.");
      setLoadingAction(null);
    }
  }

  return (
    <div className="login-card premium-motion w-full max-w-[460px] rounded-[1.75rem] p-4 shadow-soft sm:p-5">
      <div className="rounded-[1.35rem] border border-white/70 bg-white/[0.88] p-5 shadow-panel sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint">
              Acesso seguro
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-normal text-ink">
              Entre no seu workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Conte&uacute;dos, reputa&ccedil;&atilde;o local e IA em um painel privado.
            </p>
          </div>
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-white shadow-panel">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-ink/10 bg-cloud p-1">
          <button
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition duration-300 ${
              mode === "login"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/55 hover:text-ink"
            }`}
            type="button"
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition duration-300 ${
              mode === "signup"
                ? "bg-white text-ink shadow-sm"
                : "text-ink/55 hover:text-ink"
            }`}
            type="button"
            onClick={() => setMode("signup")}
          >
            Cadastro
          </button>
        </div>

        <Button
          className="mt-5 w-full border-ink/10 bg-white text-ink hover:border-ink/20 hover:bg-cloud"
          disabled={isLoading}
          icon={
            loadingAction === "google" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span className="grid size-5 place-items-center rounded-full bg-white text-sm font-black text-[#4285f4] shadow-sm">
                G
              </span>
            )
          }
          type="button"
          variant="secondary"
          onClick={handleGoogleLogin}
        >
          Continuar com Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink/35">
          <span className="h-px flex-1 bg-ink/10" />
          ou
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div
            className={`grid transition-all duration-500 ${
              mode === "signup" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <label className="block overflow-hidden">
              <span className="text-sm font-semibold text-ink">Nome</span>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 transition focus-within:border-mint/60 focus-within:ring-2 focus-within:ring-mint/20">
                <UserRound className="size-4 shrink-0 text-ink/35" aria-hidden="true" />
                <input
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Dra. Ana Silva"
                  required={mode === "signup"}
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-ink">E-mail</span>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 transition focus-within:border-mint/60 focus-within:ring-2 focus-within:ring-mint/20">
              <Mail className="size-4 shrink-0 text-ink/35" aria-hidden="true" />
              <input
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@consultorio.com"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Senha</span>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 transition focus-within:border-mint/60 focus-within:ring-2 focus-within:ring-mint/20">
              <LockKeyhole className="size-4 shrink-0 text-ink/35" aria-hidden="true" />
              <input
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimo de 6 caracteres"
                minLength={6}
                required
              />
              <button
                className="rounded-md p-1 text-ink/45 transition hover:bg-ink/5 hover:text-ink"
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          <Button
            className="group mt-2 w-full overflow-hidden bg-ink text-white hover:bg-black"
            disabled={isLoading}
            icon={
              loadingAction === "credentials" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              )
            }
            type="submit"
          >
            {mode === "login" ? "Entrar agora" : "Criar conta premium"}
          </Button>
        </form>

        {status && (
          <p className="mt-4 rounded-xl border border-ink/10 bg-cloud px-4 py-3 text-sm font-medium leading-6 text-ink/70">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
