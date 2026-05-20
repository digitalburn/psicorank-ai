"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  {
    question: "Preciso de conhecimento técnico para usar o PsicoRank AI?",
    answer:
      "Não! A plataforma foi criada especialmente para psicólogos que não têm experiência com marketing digital ou tecnologia. É tão simples quanto preencher um formulário — você descreve seu consultório e a IA faz o resto.",
  },
  {
    question: "O conteúdo gerado está em conformidade com as normas do CFP?",
    answer:
      "Sim. Nossa IA foi treinada com as resoluções do Conselho Federal de Psicologia e nunca gera conteúdo que viole os princípios éticos da profissão. Não divulgamos preços, não prometemos resultados e respeitamos o sigilo profissional.",
  },
  {
    question: "Funciona para todas as especialidades da psicologia?",
    answer:
      "Funciona para psicólogos clínicos, terapeutas cognitivo-comportamentais, neuropsicólogos, psicólogos escolares, organizacionais e qualquer outra especialidade. A IA adapta a linguagem e os temas automaticamente ao seu perfil.",
  },
  {
    question: "Quanto tempo leva para ver resultados no Google?",
    answer:
      "A maioria dos nossos clientes percebe aumento no volume de buscas locais entre 30 e 60 dias de uso regular. O SEO é um processo contínuo, mas os posts e as otimizações do Google Business costumam gerar resultados mais rápidos.",
  },
  {
    question: "Posso gerenciar mais de um consultório na mesma conta?",
    answer:
      "No plano Clínica, você pode cadastrar até 5 psicólogos e gerenciar múltiplos consultórios em regiões diferentes, tudo em um painel unificado. Ideal para clínicas e grupos de saúde mental.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim, sem fidelidade e sem complicação. Você cancela pelo painel com um clique. No plano anual, se cancelar nos primeiros 14 dias, devolvemos o valor integralmente.",
  },
];

function FaqItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        isOpen
          ? "border-mint/40 bg-mint/[0.04] dark:border-mint/30 dark:bg-mint/[0.03]"
          : "border-slate-200/80 bg-white/80 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700",
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900 dark:text-white">{question}</span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180 text-mint",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.85, 0.2, 1] }}
          >
            <p className="px-6 pb-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/60 to-white dark:from-[#060816] dark:via-[#0a1020] dark:to-[#060816]"
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="size-3.5" aria-hidden />
            Perguntas frequentes
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Dúvidas? Respondemos tudo.
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Se não encontrar o que precisa, fale com nossa equipe pelo WhatsApp.
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          className="mt-12 space-y-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-12 rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-panel backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-base font-semibold text-slate-950 dark:text-white">
            Ainda tem dúvidas?
          </p>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Nossa equipe está disponível de segunda a sexta, das 9h às 18h.
          </p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.28)] dark:bg-white dark:text-slate-950"
          >
            Falar no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
