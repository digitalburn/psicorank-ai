# PsicoRank AI — Documento Técnico de Arquitetura

> Preparado por: DigitalBurn | Data: 11/06/2026

---

## VISÃO GERAL

### Nome do projeto
**PsicoRank AI**

### Objetivo principal
SaaS de marketing digital com inteligência artificial voltado exclusivamente para psicólogos e clínicas de psicologia. A plataforma gera automaticamente conteúdo para Instagram e pacotes de SEO local para o Google Meu Negócio, usando o modelo Claude (Anthropic) como motor de geração.

### Problema que resolve
Psicólogos não têm tempo, verba ou expertise para produzir conteúdo de marketing consistente. Contratar uma agência custa caro e o resultado raramente é especializado o suficiente para a área da saúde mental. O PsicoRank resolve isso em minutos: o profissional informa seu nicho, cidade e especialidade — a IA faz o resto.

### Público-alvo
- Psicólogos autônomos (principal)
- Clínicas de psicologia (plano Clinic)
- Profissionais de saúde mental em geral (expansão futura)

---

## FUNCIONAMENTO

### Fluxo completo do sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        USUÁRIO                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    Acessa psicorank-ai.vercel.app
                           │
          ┌────────────────▼────────────────┐
          │         Landing Page (/)         │
          │   Hero · Features · Preços · FAQ │
          └────────────────┬────────────────┘
                           │ CTA "Começar grátis"
          ┌────────────────▼────────────────┐
          │          /login                  │
          │  Email/Senha  ─── Google OAuth   │
          └────────────────┬────────────────┘
                           │ Supabase Auth
          ┌────────────────▼────────────────┐
          │         /onboarding              │
          │  Nome · Especialidade · Cidade   │
          │  (obrigatório no 1º acesso)      │
          └────────────────┬────────────────┘
                           │
          ┌────────────────▼────────────────┐
          │          /dashboard              │
          │                                  │
          │  ┌──────────┐  ┌──────────────┐  │
          │  │ Gerador   │  │ Google SEO   │  │
          │  │ Instagram │  │ Generator    │  │
          │  └────┬──────┘  └──────┬───────┘  │
          │       │                │           │
          │  POST /api/generate    │           │
          │       │                │           │
          │  ┌────▼────────────────▼────────┐  │
          │  │   Claude (Anthropic API)      │  │
          │  │   Modelo: haiku / sonnet      │  │
          │  └────────────┬─────────────────┘  │
          │               │ JSON estruturado    │
          │  ┌────────────▼─────────────────┐  │
          │  │  Supabase PostgreSQL          │  │
          │  │  generated_posts / seo        │  │
          │  └──────────────────────────────┘  │
          │                                  │
          │  ┌──────────────────────────────┐  │
          │  │  Histórico · GMB · Métricas  │  │
          │  └──────────────────────────────┘  │
          └─────────────────────────────────────┘
                           │
              Usuário quer upgrade (Starter → Pro)
                           │
          ┌────────────────▼────────────────┐
          │     POST /api/stripe/checkout    │
          │     Stripe Checkout (iframe)     │
          │     Webhook → atualiza plano     │
          │     Email de recibo (Resend)     │
          └────────────────┬────────────────┘
                           │
          Plano Pro: GMB integrado
          ┌────────────────▼────────────────┐
          │     GET /api/gmb/connect         │
          │     OAuth2 Google                │
          │     Tokens salvos no Supabase    │
          │     Reviews exibidas no painel   │
          └─────────────────────────────────┘
```

---

## ARQUITETURA

### Estrutura de pastas

```
psicorank-ai/
├── supabase/
│   └── migrations/
│       ├── 001_initial.sql        ← Schema base (profiles, posts, seo)
│       ├── 002_gmb.sql            ← Tabelas Google Meu Negócio
│       └── 003_stripe.sql         ← Tabelas assinatura Stripe
├── src/
│   ├── app/
│   │   ├── (auth)/login/          ← Rota de login/signup
│   │   ├── api/
│   │   │   ├── generate/          ← POST: gera conteúdo via Claude
│   │   │   ├── dashboard/metrics/ ← GET: métricas do painel
│   │   │   ├── gmb/               ← OAuth Google + reviews
│   │   │   └── stripe/            ← Checkout, portal, webhook
│   │   ├── auth/callback/         ← Callback OAuth Supabase
│   │   ├── dashboard/             ← Painel principal
│   │   ├── onboarding/            ← Setup inicial do perfil
│   │   └── page.tsx               ← Landing page
│   ├── components/
│   │   ├── landing/               ← 7 componentes da landing
│   │   ├── ui/                    ← Design system (Button)
│   │   └── *.tsx                  ← Auth, Dashboard, Generator, GMB, Histórico
│   └── lib/
│       ├── supabase/              ← client, server, admin, queries
│       ├── generation.ts          ← Prompts e tipos Claude
│       ├── stripe.ts              ← Instância Stripe + priceIds
│       ├── gmb-api.ts             ← Funções Google My Business
│       ├── email.ts               ← Templates Resend
│       └── database.types.ts      ← TypeScript types completos
├── middleware.ts                  ← Proteção de rotas autenticadas
├── next.config.ts                 ← Headers segurança + cache
└── .env.example                   ← Template variáveis de ambiente
```

### Tecnologias utilizadas

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | Next.js (App Router) | ^15.1.3 |
| Linguagem | TypeScript | ^5.7.2 |
| UI | React | ^19.0.0 |
| Styling | Tailwind CSS | ^3.4.17 |
| Animações | Framer Motion | ^12.39.0 |
| Ícones | Lucide React | ^0.468.0 |
| IA | Anthropic SDK (Claude) | ^0.97.1 |
| Database | Supabase (PostgreSQL) | ^2.49.1 |
| Auth | Supabase Auth | ^0.10.3 |
| Pagamentos | Stripe | ^22.1.1 |
| Email | Resend | ^6.12.4 |
| Testing | Playwright | ^1.60.0 |
| Deploy | Vercel | — |

### Backend
API Routes do Next.js com execução serverless no Vercel. Sem servidor dedicado. Cada rota é uma Edge Function que inicializa o cliente Supabase com cookies para autenticação server-side. A lógica de negócio é centralizada em `src/lib/`.

### Frontend
Next.js App Router com React Server Components onde possível e Client Components nos geradores (interatividade). Dark mode toggleável, salvo em localStorage. Animações via Framer Motion com stagger no dashboard.

### Banco de dados
PostgreSQL gerenciado pelo Supabase com Row-Level Security (RLS) ativo em todas as tabelas. Usuário só acessa seus próprios dados (`auth.uid() = user_id`). Triggers PL/pgSQL automáticos para criar profile no signup e atualizar `updated_at`.

### APIs externas

| Serviço | Uso |
|---------|-----|
| **Anthropic Claude** | Motor de geração de posts e SEO |
| **Google OAuth2** | Autenticação para Google Meu Negócio |
| **Google My Business API** | Listar localizações e reviews |
| **Stripe** | Checkout, assinaturas recorrentes, webhook |
| **Resend** | Emails transacionais (boas-vindas, recibo) |

---

## FUNCIONALIDADES

### Concluído

- [x] Landing page completa (hero, features, pricing, FAQ, footer)
- [x] Autenticação via Email/Senha (Supabase Auth)
- [x] Autenticação via Google OAuth
- [x] Onboarding: coleta nome, especialidade, cidade, clínica
- [x] Dashboard principal com sidebar e dark mode
- [x] Gerador de posts Instagram via Claude (5 tópicos)
- [x] Gerador de SEO local para Google Meu Negócio via Claude
- [x] Histórico de posts e SEO gerados (com copy e delete)
- [x] Planos Starter / Pro / Clinic com limites por plano
- [x] Checkout Stripe com redirect para session
- [x] Webhook Stripe: atualiza plano após pagamento
- [x] Portal Stripe: cancelamento e gestão de assinatura
- [x] Email de boas-vindas e recibo de pagamento (Resend)
- [x] Integração Google Meu Negócio (OAuth + salvar tokens)
- [x] Listagem de reviews do GMB no dashboard
- [x] Métricas de uso no dashboard (posts gerados, SEO, plano)
- [x] Headers de segurança HTTP (X-Frame-Options, nosniff, etc.)
- [x] Middleware de proteção de rotas autenticadas
- [x] Row-Level Security no Supabase
- [x] TypeScript strict com types completos
- [x] OG image, sitemap.xml e robots.txt dinâmicos

### Parcialmente concluído

- [~] Renovação automática de token OAuth Google (código existe, não testado em produção)
- [~] Limite mensal de uso no plano Starter (lógica existe, falta UI de feedback claro)
- [~] Plano Clinic (existe no Stripe e banco, mas sem features exclusivas além do Pro)
- [~] Playwright (dependência instalada, sem testes escritos)
- [~] Múltiplos tópicos no gerador de posts (só 5 fixos: ansiedade, autoestima, casal, TDAH, terapia infantil)

### Não implementado

- [ ] Resposta a reviews do Google diretamente pelo painel
- [ ] Agendamento e publicação de posts no Instagram
- [ ] Dashboard multiusuário para plano Clinic
- [ ] Histórico de SEO com versionamento
- [ ] Analytics de engajamento (cliques, alcance)
- [ ] Notificações por email de novos reviews
- [ ] Onboarding guiado (tour interativo)
- [ ] White-label / multi-tenant

---

## BANCO DE DADOS

### Tabelas e campos principais

#### `profiles` — Perfil do usuário
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | Espelho de auth.users.id |
| `email` | text | Email do usuário |
| `name` | text | Nome completo |
| `specialty` | text | Especialidade (ex: Psicologia Clínica) |
| `city` | text | Cidade de atuação |
| `clinic_name` | text | Nome do consultório |
| `stripe_customer_id` | text unique | ID do cliente no Stripe |
| `plan` | enum | `starter` \| `pro` \| `clinic` |

#### `generated_posts` — Posts Instagram
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | — |
| `user_id` | uuid FK | → profiles.id |
| `topic` | text | Tópico gerado (ansiedade, etc.) |
| `legenda` | text | Caption Instagram (~1100 chars) |
| `cta` | text | Call-to-action |
| `hashtags` | text[] | Array 8–12 hashtags |
| `ideia_visual` | text | Descrição da arte para designer |

#### `generated_seo` — Pacotes SEO Local
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | — |
| `user_id` | uuid FK | → profiles.id |
| `city` | text | Cidade alvo |
| `specialty` | text | Especialidade |
| `therapeutic_focus` | text | Foco terapêutico |
| `descricao_otimizada` | text | Descrição GMB até 700 chars |
| `servicos` | text[] | Lista 6–10 serviços |
| `perguntas_respostas` | jsonb | 5 pares Q&A para GMB |
| `titulos_locais_seo` | text[] | 6–10 títulos com keywords locais |
| `posts_estrategicos` | jsonb | 4 posts GMB: titulo, texto, objetivo |

#### `subscriptions` — Assinaturas Stripe
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid PK | — |
| `user_id` | uuid unique FK | → auth.users.id |
| `stripe_subscription_id` | text unique | — |
| `status` | text | active, canceled, past_due, trialing |
| `plan` | enum | starter \| pro \| clinic |
| `current_period_end` | timestamptz | Próxima renovação |
| `cancel_at_period_end` | boolean | Cancelamento agendado |

#### `gmb_tokens` — Tokens OAuth Google
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user_id` | uuid unique FK | — |
| `access_token` | text | Bearer token atual |
| `refresh_token` | text | Token para renovar |
| `expires_at` | timestamptz | Expiração do access token |

#### `gmb_locations` — Localizações GMB
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user_id` | uuid FK | — |
| `account_id` | text | `accounts/123456` |
| `location_id` | text | ID da localização Google |
| `location_name` | text | Nome do negócio |

### Relacionamentos

```
auth.users (Supabase)
    │
    ├──── profiles (1:1, via trigger)
    │         │
    │         ├──── generated_posts (1:N)
    │         ├──── generated_seo (1:N)
    │         ├──── gmb_tokens (1:1)
    │         └──── gmb_locations (1:N)
    │
    └──── subscriptions (1:1)
```

### Triggers PL/pgSQL

| Trigger | Evento | Ação |
|---------|--------|------|
| `on_auth_user_created` | INSERT em auth.users | Cria row em profiles |
| `set_profiles_updated_at` | UPDATE em profiles | Atualiza `updated_at` |
| `set_gmb_tokens_updated_at` | UPDATE em gmb_tokens | Atualiza `updated_at` |
| `subscriptions_updated_at` | UPDATE em subscriptions | Atualiza `updated_at` |

---

## INFRAESTRUTURA

### Como é executado
100% serverless. Não há processo persistente, PM2, Docker ou VPS. O deploy é feito no Vercel com build automático a cada `git push` na branch main.

### Vercel
- **URL produção**: https://psicorank-ai.vercel.app
- **Build**: `next build` (detecção automática Next.js)
- **Runtime**: Edge / Node.js serverless por rota
- **SSL**: Automático (Let's Encrypt)
- **CDN**: Global, assets estáticos com cache 1 ano (immutable)

### VPS
**Não utilizado.** O PsicoRank não tem nenhum componente no VPS `2.24.74.45`.

### Docker
**Não utilizado.**

### PM2
**Não utilizado.**

### Cron
**Não utilizado.** Sem processos em background. Tudo é on-demand via requisição HTTP.

### Dependências externas obrigatórias

| Serviço | Plano mínimo | Custo estimado |
|---------|-------------|----------------|
| Supabase (DB + Auth) | Free tier | R$ 0 |
| Vercel (Deploy) | Free tier | R$ 0 |
| Anthropic Claude | Pay-per-use | ~R$ 0,01–0,05/geração |
| Stripe | 2.9% + R$0,30/tx | Por transação |
| Resend | Free 3k/mês | R$ 0 |
| Google Cloud (OAuth) | Free | R$ 0 |

---

## PONTOS FORTES

**Arquitetura limpa e moderna**
Next.js 15 com App Router, React 19, TypeScript strict — stack atual e bem mantida. Sem dívida técnica de dependências antigas.

**Segurança sólida**
RLS no Supabase garante isolamento total de dados por usuário. Middleware protege todas as rotas autenticadas. CSRF protection no OAuth Google (state parameter). Headers HTTP de segurança configurados. Service role key apenas server-side.

**Modelo de dados bem normalizado**
Separação clara entre dados de perfil, conteúdo gerado, assinatura e OAuth. Triggers automáticos eliminam inconsistência no signup.

**Integração Stripe completa**
Checkout, webhook, portal de gerenciamento e sincronização de plano — o ciclo de vida da assinatura está 100% implementado.

**Geração de conteúdo especializada**
Prompts Claude calibrados para o nicho de psicologia — não é geração genérica. O resultado tem legenda, CTA, hashtags e ideia visual como campos separados e estruturados (JSON), prontos para uso.

**Deploy zero-ops**
Nenhum servidor para gerenciar. Push → build → deploy automático.

**Tipos TypeScript completos**
`database.types.ts` cobre todas as entidades. Sem `any`. Refatoração segura.

---

## GARGALOS

**Renovação de token Google não testada em produção**
O `refresh_token` é salvo, mas a lógica de renovação automática (quando `expires_at` passa) não tem evidência de ter sido validada com tokens reais expirados. Risco: usuário conectado ao GMB perde acesso silenciosamente.

**Plano Clinic sem diferencial real**
Custa R$ 347/mês mas entrega o mesmo que o Pro. Não há multiusuário, permissões por clínica, nem relatório consolidado. Difícil de vender sem feature exclusiva.

**Sem testes automatizados**
Playwright instalado mas sem um único teste escrito. Regressões manuais são o único controle de qualidade.

**Limite de 5 posts/mês no Starter sem feedback visual claro**
A lógica de bloqueio existe no backend mas o frontend não tem um contador visível de "você usou X de 5". O usuário descobre o limite ao tentar gerar.

**Sem retry/idempotência no webhook Stripe**
Se o webhook falhar (timeout, erro Supabase), o plano não é atualizado. Stripe tenta novamente, mas sem idempotência garantida pode gerar duplicatas.

**Tópicos de post fixos**
Só 5 tópicos hardcoded (ansiedade, autoestima, casal, TDAH, terapia infantil). Qualquer ampliação exige mudança de código — não há CMS ou configuração.

**Sem logging/observabilidade**
Sem Sentry, LogRocket ou similar. Erros em produção são invisíveis a menos que o usuário reporte.

---

## ROADMAP (próximos 30 dias)

### Semana 1 — Estabilidade
1. **Testar renovação de token Google** — simular token expirado, validar refresh automático
2. **Idempotência no webhook Stripe** — checar `stripe_subscription_id` antes de upsert
3. **Contador visual de uso no Starter** — componente "3/5 posts usados este mês"
4. **Configurar Sentry** — capturar erros de produção silenciosos

### Semana 2 — Crescimento do produto
5. **Expandir tópicos de post** — de 5 para 15+ (TEPT, fobias, luto, burnout, etc.)
6. **Feature exclusiva Clinic** — relatório consolidado de posts por profissional da clínica
7. **Escrever testes Playwright** — cobrir fluxo de geração e checkout

### Semana 3 — Retenção e upsell
8. **Email semanal de digest** — "Você gerou X posts, veja seus melhores resultados"
9. **Onboarding guiado** — tour interativo para novos usuários (reduz churn early)
10. **Notificação de novo review Google** — email quando chega review, incentiva resposta

### Semana 4 — Receita
11. **Resposta a reviews pelo painel** — usar Google My Business API para postar resposta
12. **Trial de 7 dias no Pro** — aumentar conversão
13. **Página de preços independente** — `/precos` para campanhas de tráfego

---

## ENTREGA FINAL

### Para o segundo arquiteto de software

O PsicoRank AI é um SaaS vertical de geração de conteúdo com IA, construído exclusivamente para psicólogos. O diferencial de nicho é proposital: os prompts Claude são calibrados para saúde mental, o vocabulário é específico, e os resultados (posts de Instagram e pacotes SEO local) são prontos para uso sem edição.

**Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase (PostgreSQL + Auth) + Claude (Anthropic) + Stripe + Resend + Vercel. Sem servidor próprio — 100% serverless.

**Fluxo de negócio**: Usuário assina (Starter grátis, Pro R$147/mês, Clinic R$347/mês). Entra no dashboard, preenche parâmetros do gerador, Claude retorna JSON estruturado com legenda/CTA/hashtags/ideiaVisual para posts ou descrição GMB/serviços/Q&A/títulos SEO para local. O conteúdo é salvo no banco e fica disponível no histórico. Plano Pro desbloqueia integração com Google Meu Negócio via OAuth — o usuário vê suas reviews em tempo real no painel.

**Segurança**: RLS no Supabase (cada user só acessa seus dados), middleware Next.js para proteção de rotas, CSRF via state param no OAuth, headers HTTP anti-clickjacking/MIME-sniffing. Service role key só server-side.

**O que está pronto**: landing, auth, onboarding, dashboard, geração IA, histórico, Stripe completo (checkout + webhook + portal), email transacional, integração GMB com OAuth e reviews.

**O que precisa de atenção**: renovação de token Google não validada em produção, plano Clinic sem feature exclusiva real, zero testes automatizados, sem observabilidade (Sentry). Esses são os débitos técnicos prioritários antes de escalar aquisição.

**Oportunidade imediata**: o produto resolve um problema real e tem um fluxo de checkout funcional. O próximo passo de produto de maior impacto é resposta a reviews pelo painel (feature muito solicitada por psicólogos que usam GMB) e expandir os tópicos do gerador para capturar mais nichos dentro da psicologia.

---

*Documento gerado em 11/06/2026 | PsicoRank AI v1.0 | psicorank-ai.vercel.app*
