import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o PsicoRank AI coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <div className="landing-bg min-h-screen text-slate-950 dark:text-white">
      <LandingNavbar />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-mint">Legal</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Última atualização: 24 de junho de 2026
          </p>
        </div>

        <div className="space-y-8 text-base leading-7 text-slate-700 dark:text-slate-300">

          <Section title="1. Controlador dos Dados">
            <p>
              O PsicoRank AI é operado pela <strong>DigitalBurn</strong> (CNPJ a informar), responsável
              pelo tratamento dos dados pessoais coletados na Plataforma, em conformidade com a{" "}
              <strong>Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</strong>.
            </p>
          </Section>

          <Section title="2. Dados que Coletamos">
            <p>Coletamos os seguintes dados ao utilizar a Plataforma:</p>
            <ul>
              <li>
                <strong>Dados de conta:</strong> nome, endereço de e-mail, senha (armazenada com
                hash seguro via Supabase Auth);
              </li>
              <li>
                <strong>Dados de perfil profissional:</strong> especialidade, cidade, nome do
                consultório — fornecidos voluntariamente no onboarding;
              </li>
              <li>
                <strong>Dados de pagamento:</strong> CPF ou CNPJ (enviado à Asaas para criação do
                cliente); dados de cartão são processados exclusivamente pela Asaas e nunca
                armazenados em nossos servidores;
              </li>
              <li>
                <strong>Dados de uso:</strong> conteúdos gerados, histórico de gerações, plano
                ativo;
              </li>
              <li>
                <strong>Dados técnicos:</strong> endereço IP, tipo de navegador, logs de acesso —
                coletados automaticamente para segurança e desempenho.
              </li>
            </ul>
          </Section>

          <Section title="3. Como Usamos os Dados">
            <p>Utilizamos seus dados para:</p>
            <ul>
              <li>Criar e gerenciar sua conta;</li>
              <li>Processar pagamentos e controlar seu plano de assinatura;</li>
              <li>Personalizar os conteúdos gerados pela IA com seu perfil profissional;</li>
              <li>Enviar emails transacionais (confirmação de conta, recibos de pagamento);</li>
              <li>Melhorar a Plataforma com base em dados de uso agregados e anonimizados;</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
            <p>
              <strong>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros</strong>{" "}
              para fins de marketing.
            </p>
          </Section>

          <Section title="4. Compartilhamento com Terceiros">
            <p>
              Seus dados podem ser compartilhados com os seguintes prestadores de serviço, apenas
              na medida necessária para operar a Plataforma:
            </p>
            <ul>
              <li>
                <strong>Supabase</strong> — banco de dados e autenticação (servidores na AWS
                us-east-1);
              </li>
              <li>
                <strong>Asaas</strong> — processamento de pagamentos no Brasil;
              </li>
              <li>
                <strong>Anthropic (Claude AI)</strong> — geração de conteúdo via API; os textos
                enviados à API não são usados para treinar modelos;
              </li>
              <li>
                <strong>Resend</strong> — envio de emails transacionais;
              </li>
              <li>
                <strong>Vercel</strong> — hospedagem da aplicação.
              </li>
            </ul>
            <p>
              Todos os prestadores estão sujeitos a acordos de tratamento de dados adequados e
              adotam medidas de segurança compatíveis com padrões de mercado.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>Utilizamos cookies e tecnologias similares para:</p>
            <ul>
              <li>Manter sua sessão autenticada (cookie de sessão HTTP-only via Supabase);</li>
              <li>Salvar preferências de tema (armazenamento local do navegador).</li>
            </ul>
            <p>
              Não utilizamos cookies de rastreamento publicitário. Você pode desativar cookies nas
              configurações do seu navegador, mas isso pode impedir o funcionamento correto da
              autenticação.
            </p>
          </Section>

          <Section title="6. Segurança dos Dados">
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul>
              <li>Transmissão de dados sempre via HTTPS/TLS;</li>
              <li>Senhas armazenadas com hash bcrypt (nunca em texto plano);</li>
              <li>Chaves de API e tokens de autenticação mantidos em variáveis de ambiente seguras;</li>
              <li>Acesso ao banco de dados restrito por Row Level Security (RLS) do Supabase.</li>
            </ul>
          </Section>

          <Section title="7. Seus Direitos (LGPD)">
            <p>Como titular dos dados, você tem o direito de:</p>
            <ul>
              <li>Confirmar a existência de tratamento dos seus dados;</li>
              <li>Acessar os dados que mantemos sobre você;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Solicitar a portabilidade dos seus dados;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Solicitar a exclusão completa da sua conta e dados associados.</li>
            </ul>
            <p>
              Para exercer qualquer desses direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:agdigitalburn@gmail.com" className="text-mint hover:underline">
                agdigitalburn@gmail.com
              </a>
              . Responderemos em até 15 dias úteis.
            </p>
          </Section>

          <Section title="8. Retenção de Dados">
            <p>
              Mantemos seus dados pessoais enquanto sua conta estiver ativa. Ao solicitar a
              exclusão da conta, removeremos seus dados em até 30 dias, exceto onde houver
              obrigação legal de retenção (ex.: registros fiscais por 5 anos).
            </p>
          </Section>

          <Section title="9. Transferência Internacional">
            <p>
              Alguns dados podem ser processados em servidores fora do Brasil (Supabase/AWS
              us-east-1, Vercel/AWS, Anthropic/EUA). Garantimos que essas transferências ocorrem
              com salvaguardas adequadas, conforme o art. 33 da LGPD.
            </p>
          </Section>

          <Section title="10. Alterações nesta Política">
            <p>
              Podemos atualizar esta Política periodicamente. Notificaremos por e-mail com 15 dias
              de antecedência em caso de mudanças materiais. A versão vigente estará sempre
              disponível nesta página.
            </p>
          </Section>

          <Section title="11. Contato e DPO">
            <p>
              Para questões de privacidade ou para exercer seus direitos, entre em contato:
            </p>
            <ul>
              <li>
                <strong>E-mail:</strong>{" "}
                <a href="mailto:agdigitalburn@gmail.com" className="text-mint hover:underline">
                  agdigitalburn@gmail.com
                </a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/5511982113231"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint hover:underline"
                >
                  (11) 98211-3231
                </a>
              </li>
            </ul>
            <p className="mt-4">
              Consulte também nossos{" "}
              <Link href="/termos" className="text-mint hover:underline">
                Termos de Uso
              </Link>
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
      <div className="space-y-3">{children}</div>
    </section>
  );
}
