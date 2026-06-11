export type Plan = "starter" | "pro" | "clinic";

export type Subscription = {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  plan: Plan;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type GmbToken = {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GmbLocation = {
  id: string;
  user_id: string;
  account_id: string;
  location_id: string;
  location_name: string;
  address: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  specialty: string | null;
  city: string | null;
  clinic_name: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
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
