"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CpfCheckoutModal } from "@/components/cpf-checkout-modal";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  BrainCircuit,
  Clipboard,
  Download,
  Hash,
  Heart,
  Image,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  UsersRound,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedPost, PostGeneratorPayload, PostTopic } from "@/lib/generation";
import { postTopics } from "@/lib/generation";

type GeneratedResult = {
  title: string;
  content: GeneratedPost;
};

const topicDetails: Record<
  PostTopic,
  {
    label: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  ansiedade: {
    label: "Ansiedade",
    description: "Psicoeducacao, regulacao emocional e sinais de alerta.",
    icon: BrainCircuit,
  },
  autoestima: {
    label: "Autoestima",
    description: "Autocuidado, autoconhecimento e dialogo interno.",
    icon: Heart,
  },
  casal: {
    label: "Casal",
    description: "Comunicacao, conflitos e vinculos mais saudaveis.",
    icon: UsersRound,
  },
  TDAH: {
    label: "TDAH",
    description: "Rotina, foco, organizacao e acolhimento sem estigma.",
    icon: Sparkles,
  },
  "terapia infantil": {
    label: "Terapia infantil",
    description: "Orientacao para familias, desenvolvimento e cuidado.",
    icon: Baby,
  },
};

export function GeneratorWorkspace() {
  const [topic, setTopic] = useState<PostTopic>("ansiedade");
  const [clinicName, setClinicName] = useState("Clinica PsicoRank");
  const [specialty, setSpecialty] = useState("Psicologia clinica");
  const [audience, setAudience] = useState("Adultos que buscam terapia");
  const [tone, setTone] = useState("acolhedor, profissional e acessivel");
  const [extraContext, setExtraContext] = useState("");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlanLimit, setIsPlanLimit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const selectedTopic = topicDetails[topic];
  const resultText = useMemo(() => {
    if (!result?.content) {
      return "";
    }

    return [
      `Legenda:\n${result.content.legenda}`,
      `CTA:\n${result.content.cta}`,
      `Hashtags:\n${result.content.hashtags.join(" ")}`,
      `Ideia visual:\n${result.content.ideiaVisual}`,
    ].join("\n\n");
  }, [result]);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsPlanLimit(false);

    const payload: PostGeneratorPayload = {
      kind: "post",
      topic,
      clinicName,
      specialty,
      audience,
      tone,
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

      const data = (await response.json()) as Partial<GeneratedResult> & { error?: string };

      if (!response.ok || !data.content) {
        if (response.status === 403) setIsPlanLimit(true);
        setError(data.error || "Nao foi possivel gerar o post.");
        return;
      }

      setResult({
        title: data.title || `Post sobre ${selectedTopic.label}`,
        content: data.content,
      });
      setImageUrl(null);
      setImageError(null);
      window.dispatchEvent(new CustomEvent("psicorank:content-generated"));
    } catch {
      setError("Falha de conexao ao chamar o gerador.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateImage() {
    if (!result?.content.ideiaVisual) return;
    setIsGeneratingImage(true);
    setImageUrl(null);
    setImageError(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideiaVisual: result.content.ideiaVisual,
          topic,
          specialty,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erro ao gerar imagem.");
      setImageUrl(data.url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Erro ao gerar imagem.");
    } finally {
      setIsGeneratingImage(false);
    }
  }

  async function copyResult() {
    if (!resultText) {
      return;
    }

    await navigator.clipboard.writeText(resultText);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_1fr]" id="instagram">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72">
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Gerador de posts</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">Escolha o tema</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          O conteudo gerado inclui legenda, CTA, hashtags e ideia visual para Instagram.
        </p>

        <div className="mt-5 space-y-3">
          {postTopics.map((item) => {
            const details = topicDetails[item];
            const Icon = details.icon;
            const isActive = item === topic;

            return (
              <button
                className={`w-full rounded-xl border p-4 text-left transition ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_42px_rgba(15,23,42,0.18)] dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-slate-200 bg-slate-50 text-slate-950 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
                key={item}
                type="button"
                onClick={() => setTopic(item)}
              >
                <div className="flex items-start gap-3">
                  <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${isActive ? "bg-white/12" : "bg-mint/10 text-mint"}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold">{details.label}</p>
                    <p className={`mt-1 text-sm leading-5 ${isActive ? "text-white/68 dark:text-slate-500" : "text-slate-600 dark:text-slate-400"}`}>
                      {details.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{selectedTopic.label}</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">Post para psicólogos com Claude IA</h2>
          </div>
          <Button icon={isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} disabled={isLoading} onClick={handleGenerate}>
            {isLoading ? "Gerando..." : "Gerar post"}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Nome do consultorio">
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={clinicName}
              onChange={(event) => setClinicName(event.target.value)}
            />
          </Field>
          <Field label="Especialidade">
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
            />
          </Field>
          <Field label="Publico-alvo">
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            />
          </Field>
          <Field label="Tom de voz">
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            />
          </Field>
          <Field label="Contexto adicional">
            <textarea
              className="focus-ring min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              value={extraContext}
              onChange={(event) => setExtraContext(event.target.value)}
              placeholder="Ex.: cidade, abordagem, campanha do mes, duvida comum dos pacientes..."
            />
          </Field>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-slate-950 dark:text-white">Resultado</p>
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
                Gerando com Claude IA...
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
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Você usou seus 5 posts gratuitos este mês. Faça upgrade para continuar.</p>
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
                <ResultBlock icon={MessageSquareText} label="Legenda">
                  {result.content.legenda}
                </ResultBlock>
                <ResultBlock icon={Send} label="CTA">
                  {result.content.cta}
                </ResultBlock>
                <ResultBlock icon={Hash} label="Hashtags">
                  <div className="flex flex-wrap gap-2">
                    {result.content.hashtags.map((hashtag) => (
                      <span key={hashtag} className="rounded-full bg-mint/10 px-3 py-1 text-sm font-semibold text-mint">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </ResultBlock>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
                      <Image className="size-4 text-mint" aria-hidden="true" />
                      Ideia visual
                    </div>
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(24,184,143,0.35)] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isGeneratingImage
                        ? <><Loader2 className="size-3 animate-spin" />Gerando...</>
                        : <><Wand2 className="size-3" />Gerar imagem</>}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
                    {result.content.ideiaVisual}
                  </p>
                  {isGeneratingImage && (
                    <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Loader2 className="size-6 animate-spin text-mint" />
                        Gerando imagem com DALL-E 3...
                      </div>
                    </div>
                  )}
                  {imageError && (
                    <p className="mt-3 text-sm text-rose-500 dark:text-rose-400">{imageError}</p>
                  )}
                  {imageUrl && !isGeneratingImage && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Imagem gerada por IA" className="w-full" />
                      <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
                        <a
                          href={imageUrl}
                          download="post-psicorank.png"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <Download className="size-3" />
                          Baixar imagem
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isLoading && !error && !result?.content && (
              <p>
                Selecione um tema, ajuste as informacoes do consultorio e gere uma versao
                pronta para revisar antes de publicar.
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
    <label className="block md:[&:last-child]:col-span-2">
      <span className="mb-2 block text-sm font-bold text-slate-950 dark:text-white">
        {label}
      </span>
      {children}
    </label>
  );
}

function ResultBlock({
  children,
  icon: Icon,
  label,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-2 flex items-center gap-2 font-bold text-slate-950 dark:text-white">
        <Icon className="size-4 text-mint" aria-hidden="true" />
        {label}
      </div>
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  );
}
