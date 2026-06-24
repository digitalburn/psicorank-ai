import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Configurações"
      description="Gerencie sua conta, perfil profissional, notificações e integrações em um painel centralizado e fácil de usar."
      features={[
        "Editar perfil e especialidade",
        "Gerenciar assinatura e plano",
        "Preferências de notificação por email",
        "Conectar e desconectar Google Meu Negócio",
        "Exportar e excluir dados da conta (LGPD)",
      ]}
    />
  );
}
