export type Plan = "starter" | "pro" | "clinic";

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  specialty: string | null;
  city: string | null;
  clinic_name: string | null;
  plan: Plan;
  created_at: string;
  updated_at: string;
};

export type GeneratedPostRow = {
  id: string;
  user_id: string;
  topic: string;
  clinic_name: string | null;
  specialty: string | null;
  audience: string | null;
  tone: string | null;
  legenda: string;
  cta: string;
  hashtags: string[];
  ideia_visual: string;
  created_at: string;
};

export type GeneratedSeoRow = {
  id: string;
  user_id: string;
  city: string;
  specialty: string;
  therapeutic_focus: string;
  descricao_otimizada: string;
  servicos: string[];
  perguntas_respostas: Array<{ pergunta: string; resposta: string }>;
  titulos_locais_seo: string[];
  posts_estrategicos: Array<{ titulo: string; texto: string; objetivo: string }>;
  created_at: string;
};
