"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CpfCheckoutModal } from "@/components/cpf-checkout-modal";
import type { LucideIcon } from "lucide-react";
import {
  Clipboard,
  FileText,
  HelpCircle,
  ListChecks,
  Loader2,
  MapPin,
  Newspaper,
  SearchCheck,
  Send,
  Sparkles,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedGoogleSeo, GoogleSeoGeneratorPayload } from "@/lib/generation";

type GeneratedSeoResult = {
  title: string;
  content: GeneratedGoogleSeo;
};

export function GoogleSeoGenerator() {
  const [city, setCity] = useState("Sao Paulo");
  const [specialty, setSpecialty] = useState("Psicologia clinica");
  const [therapeuticFocus, setTherapeuticFocus] = useState("ansiedade e autoestima");
  const [extraContext, setExtraContext] = useState("");
  const [result, setResult] = useState<GeneratedSeoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const resultText = useMemo(() => {
    if (!result?.content) {
      return "";
    }

    return [
      `Descricao otimizada:\n${result.content.descricaoOtimizada}`,
      `Servicos:\n${result.content.servicos.map((item) => `- ${item}`).join("\n")}`,
      `Perguntas e respostas:\n${result.content.perguntasRespostas
        .map((item) => `P: ${item.pergunta}\nR: ${item.resposta}`)
        .join("\n\n")}`,
      `Titulos locais SEO:\n${result.content.titulosLocaisSeo.map((item) => `- ${item}`).join("\n")}`,
      `Posts estrategicos:\n${result.content.postsEstrategicos
        .map((item) => `${item.titulo}\n${item.texto}\nObjetivo: ${item.objetivo}`)
        .join("\n\n")}`,
    ].join("\n\n");
  }, [result]);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsPlanLimit(false);

    const payload: GoogleSeoGeneratorPayload = {
      kind: "google-seo",
      city,
      specialty,
      therapeuticFocus,
      extraContext,
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as Partial<GeneratedSeoResult> & { error?: string };

      if (!response.ok || !data.content) {
        if (response.status === 403) setIsPlanLimit(true);
        setError(data.error || "Nao foi possivel gerar o SEO para Google Meu Negocio.");
        return;
      }

      setResult({
        title: data.title || `SEO Google Meu Negocio em ${city}`,
        content: data.content,
      });
      window.dispatchEvent(new CustomEvent("psicorank:content-generated"));
    } catch {
      setError("Falha de conexao ao chamar o gerador.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyResult() {
    if (!resultText) {
      return;
    }

    await navigator.clipboard.writeText(resultText);
  }

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-[360px_1fr]" id="google">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72">
        <div className="grid size-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <SearchCheck className="size-5" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
          Google Meu Negocio
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
          Gerador SEO local
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Informe cidade, especialidade e foco terapeutico para gerar um pacote de textos
          otimizado para busca local.
        </p>

        <div className="mt-5 space-y-3">
          {[
            { icon: FileText, label: "Descricao otimizada" },
            { icon: ListChecks, label: "Servicos" },
            { icon: HelpCircle, label: "Perguntas e respostas" },
            { icon: Tags, label: "Titulos locais SEO" },
            { icon: Newspaper, label: "Posts estrategicos" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <Icon className="size-4 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-950 dark:text-white">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              SEO local para psicologos
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              Conteudo para Google Meu Negocio
            </h2>
          </div>
          <Button
            icon={isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            disabled={isLoading}
            onClick={handleGenerate}
          >
            {isLoading ? "Gerando..." : "Gerar SEO"}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Cidade">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
              <MapPin className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <input
                className="w-full bg-transparent text-sm text-slate-950 outline-none dark:text-white"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
          </Field>
          <Field label="Especialidade">
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
            />
          </Field>
          <Field label="Foco terapeutico">
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={therapeuticFocus}
              onChange={(event) => setTherapeuticFocus(event.target.value)}
            />
          </Field>
          <Field label="Contexto adicional">
            <textarea
              className="focus-ring min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={extraContext}
              onChange={(event) => setExtraContext(event.target.value)}
              placeholder="Ex.: bairro, atendimento online, abordagem, publico atendido..."
            />
          </Field>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-slate-950 dark:text-white">Resultado SEO</p>
            <Button
              className="min-h-9 px-3"
              disabled={!resultText}
              icon={<Clipboard className="size-4" />}
              onClick={copyResult}
              variant="secondary"
            >
              Copiar
            </Button>
          </div>

          <div className="mt-4 min-h-72 rounded-[1.25rem] bg-white p-4 text-sm leading-7 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
            {isLoading && (
              <div className="flex h-56 items-center justify-center gap-2 font-semibold text-slate-500 dark:text-slate-400">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Gerando SEO com Claude IA...
              </div>
            )}
            {!isLoading && error && (
              isPlanLimit ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="grid size-14 place-items-center rounded-2xl bg-amber-500/10">
                    <Sparkles className="size-6 text-amber-500" aria-hidden />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">Limite do plano Starter atingido</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Você usou seu SEO gratuito este mês. Faça upgrade para SEO ilimitado.</p>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="rounded-xl bg-mint px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(24,184,143,.35)] transition hover:-translate-y-0.5"
                  >
                    Assinar Pro — R$147/mês
                  </button>
                  <AnimatePresence>
                    {showUpgradeModal && (
                      <CpfCheckoutModal plan="pro" billing="monthly" onClose={() => setShowUpgradeModal(false)} />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-rose-500 dark:text-rose-400">{error}</p>
              )
            )}
            {!isLoading && !error && result?.content && (
              <div className="grid gap-4">
                <SeoBlock icon={FileText} label="Descricao otimizada">
                  {result.content.descricaoOtimizada}
                </SeoBlock>
                <SeoBlock icon={ListChecks} label="Servicos">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {result.content.servicos.map((service) => (
                      <li
                        key={service}
                        className="rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </SeoBlock>
                <SeoBlock icon={HelpCircle} label="Perguntas e respostas">
                  <div className="space-y-3">
                    {result.content.perguntasRespostas.map((item) => (
                      <div key={item.pergunta} className="rounded-lg bg-white p-3 dark:bg-slate-950">
                        <p className="font-bold text-slate-950 dark:text-white">{item.pergunta}</p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">{item.resposta}</p>
                      </div>
                    ))}
                  </div>
                </SeoBlock>
                <SeoBlock icon={Tags} label="Titulos locais SEO">
                  <div className="flex flex-wrap gap-2">
                    {result.content.titulosLocaisSeo.map((title) => (
                      <span
                        key={title}
                        className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600 dark:text-emerald-300"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </SeoBlock>
                <SeoBlock icon={Newspaper} label="Posts estrategicos para Google Meu Negocio">
                  <div className="grid gap-3 md:grid-cols-2">
                    {result.content.postsEstrategicos.map((post) => (
                      <div key={post.titulo} className="rounded-lg bg-white p-3 dark:bg-slate-950">
                        <p className="font-bold text-slate-950 dark:text-white">{post.titulo}</p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">{post.texto}</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">
                          {post.objetivo}
                        </p>
                      </div>
                    ))}
                  </div>
                </SeoBlock>
              </div>
            )}
            {!isLoading && !error && !result?.content && (
              <p>
                Preencha os dados locais para gerar uma descricao, lista de servicos,
                perguntas frequentes, titulos SEO e posts para Google Meu Negocio.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block md:[&:last-child]:col-span-3">
      <span className="mb-2 block text-sm font-bold text-slate-950 dark:text-white">
        {label}
      </span>
      {children}
    </label>
  );
}

function SeoBlock({
  children,
  icon: Icon,
  label,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-2 font-bold text-slate-950 dark:text-white">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
        {label}
      </div>
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  );
}
