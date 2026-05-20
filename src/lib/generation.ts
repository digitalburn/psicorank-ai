export const postTopics = [
  "ansiedade",
  "autoestima",
  "casal",
  "TDAH",
  "terapia infantil",
] as const;

export type PostTopic = (typeof postTopics)[number];

export type PostGeneratorPayload = {
  kind: "post";
  topic: PostTopic;
  clinicName: string;
  specialty: string;
  audience: string;
  tone: string;
  extraContext?: string;
};

export type GeneratedPost = {
  legenda: string;
  cta: string;
  hashtags: string[];
  ideiaVisual: string;
};

export type GoogleSeoGeneratorPayload = {
  kind: "google-seo";
  city: string;
  specialty: string;
  therapeuticFocus: string;
  extraContext?: string;
};

export type GeneratedGoogleSeo = {
  descricaoOtimizada: string;
  servicos: string[];
  perguntasRespostas: Array<{
    pergunta: string;
    resposta: string;
  }>;
  titulosLocaisSeo: string[];
  postsEstrategicos: Array<{
    titulo: string;
    texto: string;
    objetivo: string;
  }>;
};

export type GeneratorRequest = PostGeneratorPayload | GoogleSeoGeneratorPayload;

export function isPostTopic(value: unknown): value is PostTopic {
  return typeof value === "string" && postTopics.includes(value as PostTopic);
}

export function buildPostPrompt(payload: PostGeneratorPayload) {
  return `
Crie um post de Instagram para psicologos no Brasil.

Tema selecionado: ${payload.topic}
Clinica/profissional: ${payload.clinicName}
Especialidade: ${payload.specialty}
Publico-alvo: ${payload.audience}
Tom de voz: ${payload.tone}
Contexto adicional: ${payload.extraContext || "Nao informado"}

Regras:
- Linguagem acolhedora, clara e profissional.
- Nao prometa cura, diagnostico, resultado garantido ou atendimento emergencial.
- Nao use termos que exponham dados sensiveis de pacientes.
- Evite sensacionalismo e medo como gatilho.
- A legenda deve ter ate 1.100 caracteres, com paragrafos curtos.
- O CTA deve ser etico e convidar para uma acao leve.
- Gere de 8 a 12 hashtags relevantes em portugues.
- A ideia visual deve orientar uma arte ou carrossel sem depender de foto de paciente.

Responda somente em JSON valido, sem markdown, neste formato:
{
  "legenda": "texto da legenda",
  "cta": "texto do CTA",
  "hashtags": ["#hashtag"],
  "ideiaVisual": "descricao da ideia visual"
}
`;
}

export const postGeneratorSystemPrompt =
  "Voce e um estrategista de conteudo para psicologos no Brasil. Crie conteudos eticos, acolhedores e alinhados a comunicacao profissional em saude mental.";

export function buildGoogleSeoPrompt(payload: GoogleSeoGeneratorPayload) {
  return `
Crie um pacote de SEO local para Google Meu Negocio de um psicologo ou clinica de psicologia no Brasil.

Cidade: ${payload.city}
Especialidade: ${payload.specialty}
Foco terapeutico: ${payload.therapeuticFocus}
Contexto adicional: ${payload.extraContext || "Nao informado"}

Regras:
- Use linguagem profissional, acolhedora e local.
- Nao prometa cura, diagnostico, resultado garantido ou atendimento emergencial.
- Nao use chamadas sensacionalistas ou apelativas.
- Inclua termos de busca locais de forma natural.
- A descricao otimizada deve ter ate 700 caracteres.
- Gere de 6 a 10 servicos.
- Gere 5 perguntas e respostas objetivas para o perfil.
- Gere de 6 a 10 titulos locais SEO.
- Gere 4 posts estrategicos para Google Meu Negocio, cada um com titulo, texto curto e objetivo.

Responda somente em JSON valido, sem markdown, neste formato:
{
  "descricaoOtimizada": "descricao do perfil",
  "servicos": ["servico"],
  "perguntasRespostas": [
    {
      "pergunta": "pergunta",
      "resposta": "resposta"
    }
  ],
  "titulosLocaisSeo": ["titulo"],
  "postsEstrategicos": [
    {
      "titulo": "titulo do post",
      "texto": "texto curto do post",
      "objetivo": "objetivo estrategico"
    }
  ]
}
`;
}

export const googleSeoSystemPrompt =
  "Voce e um especialista em SEO local para Google Meu Negocio de psicologos no Brasil. Crie textos eticos, claros, localizados e alinhados a comunicacao profissional em saude mental.";
