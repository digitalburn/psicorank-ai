import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "PsicoRank <noreply@psicorank.com.br>";

export async function sendWelcomeEmail(to: string, name?: string | null) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = name?.split(" ")[0] ?? "Psicólogo(a)";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Bem-vindo(a) ao PsicoRank AI 🎉",
    html: welcomeHtml(firstName),
  });
}

export async function sendPaymentReceiptEmail(
  to: string,
  name: string | null | undefined,
  plan: string,
  amount: string,
) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = name?.split(" ")[0] ?? "Psicólogo(a)";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmação de assinatura — Plano ${plan}`,
    html: receiptHtml(firstName, plan, amount),
  });
}

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:40px 16px">
<table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08)">
<tr><td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px 40px;text-align:center">
  <span style="display:inline-block;background:#18b88f;color:#fff;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:6px 16px;border-radius:999px">PsicoRank AI</span>
</td></tr>
<tr><td style="padding:40px">${content}</td></tr>
<tr><td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0">
  <p style="margin:0;font-size:12px;color:#94a3b8">© 2026 PsicoRank AI · Todos os direitos reservados</p>
  <p style="margin:6px 0 0;font-size:12px;color:#94a3b8"><a href="https://psicorank.com.br" style="color:#18b88f;text-decoration:none">psicorank.com.br</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function welcomeHtml(firstName: string) {
  return base(`
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a">Olá, ${firstName}! 👋</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.6">Sua conta no <strong>PsicoRank AI</strong> foi criada com sucesso. Você já pode gerar posts para Instagram, otimizar seu perfil no Google e monitorar sua reputação digital.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0">
      <tr>
        <td style="background:#f0fdf4;border-radius:12px;padding:20px">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#15803d">O que você pode fazer agora:</p>
          <ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:2">
            <li>Gerar posts com IA para o Instagram</li>
            <li>Criar pacotes de SEO local para o Google</li>
            <li>Conectar o Google Meu Negócio</li>
            <li>Acompanhar avaliações e métricas</li>
          </ul>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin-top:32px">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicorank.com.br"}/dashboard"
         style="display:inline-block;background:#18b88f;color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;box-shadow:0 8px 20px rgba(24,184,143,.35)">
        Acessar meu painel →
      </a>
    </div>
  `);
}

function receiptHtml(firstName: string, plan: string, amount: string) {
  return base(`
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a">Assinatura confirmada! 🎉</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:1.6">Obrigado, <strong>${firstName}</strong>! Sua assinatura do plano <strong>${plan}</strong> está ativa.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0">
      <tr>
        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:#166534">Plano</td>
              <td align="right" style="font-size:14px;font-weight:700;color:#15803d">${plan}</td>
            </tr>
            <tr><td colspan="2" style="padding:8px 0"><hr style="border:none;border-top:1px solid #bbf7d0"></td></tr>
            <tr>
              <td style="font-size:14px;color:#166534">Valor cobrado</td>
              <td align="right" style="font-size:16px;font-weight:700;color:#0f172a">${amount}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="font-size:14px;color:#64748b;line-height:1.6">Você pode gerenciar ou cancelar sua assinatura a qualquer momento pelo painel.</p>
    <div style="text-align:center;margin-top:32px">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicorank.com.br"}/dashboard"
         style="display:inline-block;background:#18b88f;color:#fff;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;box-shadow:0 8px 20px rgba(24,184,143,.35)">
        Ir para o painel →
      </a>
    </div>
  `);
}
