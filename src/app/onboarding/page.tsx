"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Loader2, MapPin, Sparkles, Star } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const SPECIALTIES = [
  "Psicologia clínica",
  "Neuropsicologia",
  "Psicologia infantil",
  "Psicologia do esporte",
  "Psicologia organizacional",
  "Psicologia hospitalar",
  "Terapia de casal e família",
  "Psicologia da saúde",
  "Outra",
] as const;

const HIGHLIGHTS = [
  { icon: Sparkles, text: "Posts para Instagram gerados pela IA" },
  { icon: MapPin, text: "SEO local para sua cidade específica" },
  { icon: Star, text: "Respostas éticas para avaliações Google" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState<string>(SPECIALTIES[0]);
  const [city, setCity] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prefill() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // Preenche nome a partir dos metadados do Google/signup
        const metaName =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.display_name ||
          "";

        if (metaName) setName(metaName);

        // Verifica se já passou pelo onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, specialty, city, clinic_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.specialty && profile?.clinic_name) {
          router.replace("/dashboard");
          return;
        }

        if (profile?.name) setName(profile.name);
        if (profile?.specialty) setSpecialty(profile.specialty);
        if (profile?.city) setCity(profile.city);
        if (profile?.clinic_name) setClinicName(profile.clinic_name);
      } catch {
        // ignora erro de rede silenciosamente
      } finally {
        setInitializing(false);
      }
    }

    void prefill();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: upsertError } = await supabase
        .from("profiles")
        .update({ name, specialty, city, clinic_name: clinicName })
        .eq("id", user.id);

      if (upsertError) throw upsertError;

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#060816]">
        <Loader2 className="size-6 animate-spin text-mint" />
      </div>
    );
  }

  return (
    <main className="login-surface relative min-h-screen overflow-hidden px-5 py-6 text-ink sm:px-8">
      <div className="login-sheen" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between">
        <AppLogo />
        <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/60 shadow-sm backdrop-blur md:flex">
          <CheckCircle2 className="size-4 text-mint" aria-hidden />
          Cadastro concluído
        </div>
      </div>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-center gap-10 py-8 lg:grid-cols-[1fr_460px] lg:gap-16">
        {/* Left: contexto */}
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.85, 0.2, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-mint backdrop-blur">
            <BrainCircuit className="size-3.5" aria-hidden />
            Configuração inicial
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            Personalize seu
            <span className="block text-mint">workspace de IA.</span>
          </h1>

          <p className="mt-5 text-lg leading-8 text-ink/65">
            Essas informações tornam os conteúdos gerados pelo Claude muito mais precisos e
            relevantes para o seu consultório e cidade.
          </p>

          <div className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-mint/10">
                    <Icon className="size-4 text-mint" aria-hidden />
                  </div>
                  <p className="text-base font-semibold text-ink/80">{item.text}</p>
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-full bg-mint text-xs font-bold text-white">
                1
              </div>
              <span className="text-sm font-semibold text-mint">Perfil</span>
            </div>
            <div className="h-px w-10 bg-ink/15" />
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-full bg-ink/10 text-xs font-bold text-ink/40">
                2
              </div>
              <span className="text-sm font-medium text-ink/40">Dashboard</span>
            </div>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          className="login-card w-full rounded-[1.75rem] p-4 shadow-soft sm:p-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.2, 0.85, 0.2, 1] }}
        >
          <div className="rounded-[1.35rem] border border-white/70 bg-white/[0.88] p-5 shadow-panel sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint">
                  Passo 1 de 1
                </p>
                <h2 className="mt-2 text-2xl font-bold text-ink">Sobre o seu consultório</h2>
                <p className="mt-1.5 text-sm leading-6 text-ink/60">
                  Pode alterar a qualquer momento nas configurações.
                </p>
              </div>
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink text-white shadow">
                <BrainCircuit className="size-5" aria-hidden />
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">
                  Seu nome completo
                </span>
                <input
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 transition focus:border-mint/60 focus:ring-2 focus:ring-mint/20"
                  placeholder="Dra. Ana Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Especialidade</span>
                <select
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint/60 focus:ring-2 focus:ring-mint/20"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">
                  Cidade de atuação
                </span>
                <input
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 transition focus:border-mint/60 focus:ring-2 focus:ring-mint/20"
                  placeholder="São Paulo, SP"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="address-level2"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">
                  Nome do consultório
                </span>
                <input
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 transition focus:border-mint/60 focus:ring-2 focus:ring-mint/20"
                  placeholder="Consultório Dra. Ana Silva"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  required
                />
              </label>

              {error && (
                <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_18px_42px_rgba(17,24,39,0.26)] disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Salvando...
                  </>
                ) : (
                  <>
                    Entrar no dashboard
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-3 w-full text-center text-xs text-ink/35 transition hover:text-ink/55"
            >
              Pular por agora
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
