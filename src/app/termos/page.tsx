import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso da plataforma PsicoRank AI.",
};

export default function TermosPage() {
  return (
    <div className="landing-bg min-h-screen text-slate-950 dark:text-white">
      <LandingNavbar />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-mint">Legal</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Termos de Uso
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Última atualização: 24 de junho de 2026
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300">

          <Section title="1. Aceitação dos Termos">
            <p>
              Ao criar uma conta ou utilizar a plataforma PsicoRank AI (&quot;Plataforma&quot;), você
              concorda com estes Termos de Uso. Se não concordar com alguma das condições, não
              utilize a Plataforma.
            </p>
            <p>
              A Plataforma é operada pela DigitalBurn (CNPJ a informar), com sede no Brasil.
            </p>
          </Section>

          <Section title="2. Descrição dos Serviços">
            <p>
              O PsicoRank AI é uma plataforma SaaS que oferece ferramentas de inteligência artificial
              para psicólogos, incluindo:
            </p>
            <ul>
              <li>Geração de conteúdo para Instagram e redes sociais;</li>
              <li>Otimização de perfil no Google Meu Negócio (SEO local);</li>
              <li>Geração de respostas a avaliações de clientes;</li>
              <li>Calendário editorial e relatórios de reputação.</li>
            </ul>
            <p>
              Os serviços são fornecidos conforme o plano contratado (Starter, Pro ou Clínica).
            </p>
          </Section>

          <Section title="3. Conta de Usuário">
            <p>
              Para utilizar a Plataforma, você deve criar uma conta com informações verdadeiras e
              manter seus dados atualizados. Você é responsável pela confidencialidade da sua senha e
              por todas as atividades realizadas em sua conta.
            </p>
            <p>
              Reservamo-nos o direito de suspender contas com informações falsas ou em caso de uso
              indevido da Plataforma.
            </p>
          </Section>

          <Section title="4. Planos, Pagamento e Cancelamento">
            <p>
              A Plataforma oferece os seguintes planos pagos, processados via Asaas:
            </p>
            <ul>
              <li>
                <strong>Pro Mensal:</strong> R$147/mês por usuário;
              </li>
              <li>
                <strong>Pro Anual:</strong> R$117/mês (cobrado anualmente);
              </li>
              <li>
                <strong>Clínica Mensal:</strong> R$347/mês;
              </li>
              <li>
                <strong>Clínica Anual:</strong> R$277/mês (cobrado anualmente).
              </li>
            </ul>
            <p>
              O plano <strong>Starter</strong> é gratuito com recursos limitados.
            </p>
            <p>
              As cobranças são recorrentes. Você pode cancelar a assinatura a qualquer momento pelo
              suporte via WhatsApp. Ao cancelar, você mantém acesso ao plano até o fim do período já
              pago.
            </p>
            <p>
              Oferecemos garantia de reembolso integral de <strong>14 dias</strong> a contar da
              primeira cobrança, sem perguntas.
            </p>
          </Section>

          <Section title="5. Uso Aceitável">
            <p>Você concorda em não utilizar a Plataforma para:</p>
            <ul>
              <li>Gerar conteúdo enganoso, difamatório ou que viole normas do CFP;</li>
              <li>Fazer engenharia reversa, copiar ou redistribuir o software;</li>
              <li>Tentar acessar sistemas ou dados de outros usuários;</li>
              <li>Sobrecarregar os servidores com requisições automatizadas abusivas.</li>
            </ul>
            <p>
              O conteúdo gerado pela IA é uma sugestão editorial. Você é o único responsável pela
              revisão e publicação do conteúdo, garantindo conformidade com o Código de Ética do
              Psicólogo e as resoluções do CFP.
            </p>
          </Section>

          <Section title="6. Propriedade Intelectual">
            <p>
              Todo o código, design, marca e tecnologia da Plataforma são de propriedade exclusiva
              da DigitalBurn. O conteúdo gerado pela IA com base nos dados que você fornece pertence
              a você.
            </p>
          </Section>

          <Section title="7. Limitação de Responsabilidade">
            <p>
              A Plataforma é fornecida &quot;como está&quot;. Não garantimos resultados específicos de
              SEO, aumento de clientes ou posicionamento no Google. Não nos responsabilizamos por
              perdas indiretas, lucros cessantes ou danos decorrentes do uso ou impossibilidade de
              uso da Plataforma.
            </p>
            <p>
              Nossa responsabilidade máxima em qualquer caso é limitada ao valor pago nos últimos
              3 meses de assinatura.
            </p>
          </Section>

          <Section title="8. Privacidade">
            <p>
              O tratamento dos seus dados pessoais é descrito em nossa{" "}
              <Link href="/privacidade" className="text-mint hover:underline">
                Política de Privacidade
              </Link>
              , em conformidade com a LGPD (Lei 13.709/2018).
            </p>
          </Section>

          <Section title="9. Alterações nos Termos">
            <p>
              Podemos atualizar estes Termos periodicamente. Notificaremos por email com 15 dias de
              antecedência em caso de mudanças materiais. O uso continuado da Plataforma após a
              vigência das alterações constitui aceitação dos novos Termos.
            </p>
          </Section>

          <Section title="10. Rescisão">
            <p>
              Podemos suspender ou encerrar sua conta em caso de violação grave destes Termos, com
              ou sem aviso prévio. Você pode encerrar sua conta a qualquer momento pelo suporte.
            </p>
          </Section>

          <Section title="11. Foro e Legislação Aplicável">
            <p>
              Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de
              São Paulo, SP, para dirimir quaisquer controvérsias.
            </p>
          </Section>

          <Section title="12. Contato">
            <p>
              Para dúvidas sobre estes Termos, entre em contato:{" "}
              <a href="mailto:agdigitalburn@gmail.com" className="text-mint hover:underline">
                agdigitalburn@gmail.com
              </a>{" "}
              ou via{" "}
              <a
                href="https://wa.me/5511982113231"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mint hover:underline"
              >
                WhatsApp
              </a>
              .
            </p>
          </Section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="space-y-3 text-base leading-7">{children}</div>
    </section>
  );
}
