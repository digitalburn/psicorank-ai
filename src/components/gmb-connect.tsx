"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Link2, Loader2, MapPin, Star, StarOff } from "lucide-react";
import type { GmbReview } from "@/lib/gmb-api";
import { starToNumber } from "@/lib/gmb-api";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type ReviewsResponse = {
  connected: boolean;
  reviews?: GmbReview[];
  locations?: Array<{ location_name: string; location_id: string }>;
  error?: string;
};

function StarRating({ rating }: { rating: GmbReview["starRating"] }) {
  const value = starToNumber(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
        ) : (
          <StarOff key={i} className="size-3.5 text-slate-300 dark:text-slate-600" />
        ),
      )}
    </div>
  );
}

export function GmbConnect() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [plan, setPlan] = useState<string>("starter");
  const [loading, setLoading] = useState(true);

  const gmbParam = searchParams.get("gmb");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.from("profiles").select("plan").single()
      .then(({ data: profile }) => { if (profile?.plan) setPlan(profile.plan); });

    fetch("/api/gmb/reviews")
      .then((r) => r.json())
      .then((d: ReviewsResponse) => setData(d))
      .catch(() => setData({ connected: false }))
      .finally(() => setLoading(false));
  }, []);

  if (plan === "starter") {
    return (
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-amber-500/10 text-amber-600">
            <Star className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white">Avaliações Google</h3>
            <p className="text-sm text-slate-500">Disponível no plano Pro ou Clínica</p>
          </div>
        </div>
        <Link
          href="/#planos"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
          Ver planos
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-[2rem] border border-slate-200/80 bg-white/85 p-10 dark:border-slate-800/80 dark:bg-slate-950/72">
        <Loader2 className="size-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!data?.connected) {
    return (
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72">
        {gmbParam === "error" && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertCircle className="size-4 shrink-0" />
            Erro ao conectar. Tente novamente.
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MapPin className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white">Google Meu Negócio</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Conecte para ver suas avaliações reais
            </p>
          </div>
        </div>
        <a
          href="/api/gmb/connect"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
          <Link2 className="size-4" />
          Conectar Google Meu Negócio
        </a>
      </div>
    );
  }

  const reviews = data.reviews ?? [];
  const avg = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + starToNumber(r.starRating), 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72">
      {gmbParam === "connected" && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          Google Meu Negócio conectado com sucesso!
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Avaliações reais</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
            Google Meu Negócio
          </h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-950 dark:text-white">{avg}</p>
          <p className="text-xs text-slate-400">{reviews.length} avaliações</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-400">Nenhuma avaliação encontrada.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {reviews.map((review) => (
            <motion.div
              key={review.reviewId}
              className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    {review.reviewer.displayName}
                  </p>
                  <div className="mt-1">
                    <StarRating rating={review.starRating} />
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(review.createTime).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {review.comment}
                </p>
              )}
              {review.reviewReply && (
                <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 dark:border-emerald-900 dark:bg-emerald-950/20">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Sua resposta
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {review.reviewReply.comment}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <a
        href="/api/gmb/connect"
        className="mt-4 block text-center text-xs text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
      >
        Reconectar / trocar conta
      </a>
    </div>
  );
}
