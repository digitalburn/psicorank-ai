import { BarChart3, CheckCircle2, MessageSquareText, SearchCheck, Sparkles } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { AuthForm } from "@/components/auth-form";
import { AuthMessage } from "@/components/auth-message";

const highlights = [
  { label: "Conteúdo pronto", value: "128", icon: Sparkles },
  { label: "SEO local", value: "82%", icon: SearchCheck },
  { label: "Respostas éticas", value: "4.9", icon: MessageSquareText },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="login-surface relative min-h-screen overflow-hidden px-5 py-6 text-ink sm:px-8">
      <div className="login-sheen" aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between">
        <AppLogo />
        <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/60 shadow-sm backdrop-blur md:flex">
          <CheckCircle2 className="size-4 text-mint" aria-hidden />
          Ambiente protegido
        </div>
      </div>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14">
        <div className="premium-motion max-w-3xl">
          <span className="inline-flex rounded-full border border-mint/20 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-mint shadow-sm backdrop-blur">
            SaaS para psicologia
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
            Presença digital premium para psicólogos com IA.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink/65 sm:text-lg">
            Entre no PsicoRank AI para planejar conteúdo, fortalecer sua reputação local
            e transformar avaliações em sinais de confiança.
          </p>

          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="login-metric rounded-2xl border border-white/70 bg-white/[0.78] p-4 shadow-sm backdrop-blur"
                  style={{ animationDelay: `${160 + index * 90}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink/55">{item.label}</span>
                    <Icon className="size-4 text-mint" aria-hidden />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-ink">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="login-preview mt-8 hidden max-w-2xl rounded-[1.5rem] border border-white/70 bg-white/[0.78] p-4 shadow-panel backdrop-blur md:block">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <p className="text-sm font-bold text-ink">Agenda inteligente</p>
                <p className="text-xs font-medium text-ink/45">Semana ativa no consultório</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-mint/10 px-3 py-1 text-xs font-bold text-mint">
                <BarChart3 className="size-3.5" aria-hidden />
                +34%
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {["Post educativo", "Otimizar Google Business", "Responder avaliação"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-cloud px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_0_5px_rgba(24,184,143,0.12)]" />
                  <span className="text-sm font-semibold text-ink">{item}</span>
                  <span className="ml-auto h-2 w-24 rounded-full bg-ink/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Mensagens de erro/sucesso vindas de redirects (OAuth, e-mail confirm) */}
          <AuthMessage error={params.error} message={params.message} />
          <AuthForm />
        </div>
      </section>
    </main>
  );
}
