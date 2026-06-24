import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Calendário Editorial" };

export default function CalendarioPage() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Calendário Editorial"
      description="Planeje, agende e visualize todos os seus posts em um calendário intuitivo, com sugestões automáticas de IA para os melhores dias e horários de publicação."
      features={[
        "Agendamento de posts para Instagram e Google",
        "Sugestões de horários com maior engajamento",
        "Visualização mensal, semanal e diária",
        "Integração com o gerador de posts IA",
        "Lembretes e notificações por email",
      ]}
    />
  );
}
