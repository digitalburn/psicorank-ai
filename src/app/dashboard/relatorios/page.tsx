import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Relatórios" };

export default function RelatoriosPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Relatórios de Reputação"
      description="Acompanhe a evolução da sua presença digital com relatórios mensais detalhados — crescimento de avaliações, alcance no Google, desempenho dos posts e muito mais."
      features={[
        "Relatório mensal de reputação em PDF",
        "Evolução das avaliações no Google",
        "Desempenho de posts por período",
        "Comparativo com meses anteriores",
        "Score de visibilidade local com histórico",
      ]}
    />
  );
}
