# PsicoRank AI

SaaS para psicólogos criarem conteúdos e melhorarem o Google Meu Negócio usando IA.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- OpenAI API via rota server-side

## Funcionalidades do MVP

- Login e cadastro com Supabase
- Dashboard responsivo em estilo startup SaaS
- Gerador de posts para Instagram
- Gerador de descrições para Google Meu Negócio
- Gerador de respostas para avaliações
- Estrutura preparada para módulos futuros como calendário, relatórios e integrações locais

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env.local` com base no `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
```

3. Rode o projeto:

```bash
npm run dev
```

4. Acesse:

```bash
http://localhost:3000/dashboard
```

## Estrutura

```text
src/
  app/
    api/generate/route.ts
    dashboard/page.tsx
    (auth)/login/page.tsx
  components/
  lib/
```

## Próximas expansões recomendadas

- Middleware de sessão para proteger `/dashboard`
- Persistência de gerações no Supabase
- Integração com Google Business Profile
- Calendário editorial com agendamento
- Planos e billing com Stripe
- Relatórios de ranking local
