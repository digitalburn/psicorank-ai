"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock,
  Copy,
  FileText,
  MapPin,
  Sparkles,
  Trash2,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { deletePost, deleteSeo, getRecentPosts, getRecentSeo } from "@/lib/supabase/queries";
import type { GeneratedPostRow, GeneratedSeoRow } from "@/lib/database.types";
import { cn } from "@/lib/cn";

type Tab = "posts" | "seo";

const TOPIC_LABELS: Record<string, string> = {
  ansiedade: "Ansiedade",
  autoestima: "Autoestima",
  casal: "Casal",
  TDAH: "TDAH",
  "terapia infantil": "Terapia Infantil",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-200"
      title="Copiar"
    >
      {copied ? (
        <Check className="size-3.5 text-mint" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

function PostCard({
  post,
  onDelete,
}: {
  post: GeneratedPostRow;
  onDelete: (id: string) => void;
}) {
  const fullText = [
    `Legenda:\n${post.legenda}`,
    `CTA:\n${post.cta}`,
    `Hashtags:\n${post.hashtags.join(" ")}`,
    `Ideia visual:\n${post.ideia_visual}`,
  ].join("\n\n");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-mint/10">
            <Sparkles className="size-3.5 text-mint" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-mint">
              {TOPIC_LABELS[post.topic] ?? post.topic}
            </span>
            {post.clinic_name && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{post.clinic_name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={fullText} />
          <button
            onClick={() => onDelete(post.id)}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800"
            title="Excluir"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {post.legenda}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.hashtags.slice(0, 6).map((h) => (
          <span
            key={h}
            className="rounded-full bg-mint/8 px-2.5 py-0.5 text-xs font-semibold text-mint dark:bg-mint/10"
          >
            {h}
          </span>
        ))}
        {post.hashtags.length > 6 && (
          <span className="text-xs text-slate-400">+{post.hashtags.length - 6}</span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Clock className="size-3" />
        {formatDate(post.created_at)}
      </div>
    </motion.div>
  );
}

function SeoCard({
  seo,
  onDelete,
}: {
  seo: GeneratedSeoRow;
  onDelete: (id: string) => void;
}) {
  const fullText = [
    `Descrição otimizada:\n${seo.descricao_otimizada}`,
    `Serviços:\n${seo.servicos.map((s) => `- ${s}`).join("\n")}`,
    `Títulos SEO:\n${seo.titulos_locais_seo.map((t) => `- ${t}`).join("\n")}`,
  ].join("\n\n");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-xl bg-indigo-500/10">
            <MapPin className="size-3.5 text-indigo-500" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {seo.city}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">{seo.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={fullText} />
          <button
            onClick={() => onDelete(seo.id)}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800"
            title="Excluir"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {seo.descricao_otimizada}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {seo.titulos_locais_seo.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-full bg-indigo-500/8 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Clock className="size-3" />
        {formatDate(seo.created_at)}
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-1.5">
          <div className="h-2.5 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-2 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-2.5 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-2.5 w-4/6 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export function ContentHistory() {
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<GeneratedPostRow[]>([]);
  const [seoList, setSeoList] = useState<GeneratedSeoRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const [p, s] = await Promise.all([
        getRecentPosts(supabase),
        getRecentSeo(supabase),
      ]);
      setPosts(p);
      setSeoList(s);
    } catch {
      // Sem autenticação ou erro de rede — silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const handler = () => void loadData();
    window.addEventListener("psicorank:content-generated", handler);
    return () => window.removeEventListener("psicorank:content-generated", handler);
  }, [loadData]);

  async function handleDeletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      const supabase = createBrowserSupabaseClient();
      await deletePost(supabase, id);
    } catch {
      void loadData();
    }
  }

  async function handleDeleteSeo(id: string) {
    setSeoList((prev) => prev.filter((s) => s.id !== id));
    try {
      const supabase = createBrowserSupabaseClient();
      await deleteSeo(supabase, id);
    } catch {
      void loadData();
    }
  }

  const activeItems = tab === "posts" ? posts : seoList;
  const isEmpty = !loading && activeItems.length === 0;

  return (
    <section id="historico" className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-mint">Conteúdo salvo</p>
          <h2 className="mt-0.5 text-2xl font-bold text-slate-950 dark:text-white">
            Histórico de gerações
          </h2>
        </div>

        {/* Tabs */}
        <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
          {(
            [
              { id: "posts" as Tab, label: "Posts IA", icon: Sparkles, count: posts.length },
              { id: "seo" as Tab, label: "SEO Local", icon: FileText, count: seoList.length },
            ] as const
          ).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                tab === id
                  ? "bg-slate-950 text-white shadow dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums",
                    tab === id
                      ? "bg-white/15 text-white dark:bg-slate-950/15 dark:text-slate-950"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              {tab === "posts" ? (
                <Sparkles className="size-6 text-slate-400" />
              ) : (
                <MapPin className="size-6 text-slate-400" />
              )}
            </div>
            <p className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
              Nenhum {tab === "posts" ? "post" : "pacote SEO"} gerado ainda
            </p>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Use o gerador acima para criar e salvar conteúdo automaticamente.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {tab === "posts"
                ? posts.map((post) => (
                    <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                  ))
                : seoList.map((seo) => (
                    <SeoCard key={seo.id} seo={seo} onDelete={handleDeleteSeo} />
                  ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
