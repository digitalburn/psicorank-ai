const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMB_ACCOUNTS_URL = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts";
const GMB_REVIEWS_BASE = "https://mybusiness.googleapis.com/v4";

export type GmbReview = {
  reviewId: string;
  reviewer: { displayName: string; profilePhotoUrl?: string };
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: { comment: string; updateTime: string };
};

export type GmbLocation = {
  name: string;
  locationId: string;
  locationName: string;
  address?: string;
  accountId: string;
};

export type TokenSet = {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
};

const STAR_MAP: Record<GmbReview["starRating"], number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export function starToNumber(rating: GmbReview["starRating"]): number {
  return STAR_MAP[rating] ?? 0;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenSet> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error("Falha ao renovar token Google.");

  const data = await res.json() as { access_token: string; expires_in: number };
  const expires_at = new Date(Date.now() + data.expires_in * 1000).toISOString();

  return { access_token: data.access_token, refresh_token: refreshToken, expires_at };
}

export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenSet> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Falha ao trocar código Google: ${err}`);
  }

  const data = await res.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const expires_at = new Date(Date.now() + data.expires_in * 1000).toISOString();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at,
  };
}

export async function listAccounts(accessToken: string): Promise<Array<{ name: string; accountName: string }>> {
  const res = await fetch(GMB_ACCOUNTS_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Falha ao listar contas GMB.");

  const data = await res.json() as { accounts?: Array<{ name: string; accountName: string }> };
  return data.accounts ?? [];
}

export async function listLocations(accessToken: string, accountId: string): Promise<GmbLocation[]> {
  const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations?readMask=name,title,storefrontAddress`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Falha ao listar locations GMB.");

  const data = await res.json() as {
    locations?: Array<{ name: string; title: string; storefrontAddress?: { addressLines: string[] } }>;
  };

  return (data.locations ?? []).map((loc) => {
    const locationId = loc.name.split("/").pop() ?? loc.name;
    return {
      name: loc.name,
      locationId,
      locationName: loc.title,
      address: loc.storefrontAddress?.addressLines?.join(", "),
      accountId,
    };
  });
}

export async function listReviews(
  accessToken: string,
  accountId: string,
  locationId: string,
  pageSize = 10,
): Promise<GmbReview[]> {
  const accountNum = accountId.split("/").pop();
  const url = `${GMB_REVIEWS_BASE}/accounts/${accountNum}/locations/${locationId}/reviews?pageSize=${pageSize}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Falha ao buscar avaliações GMB.");

  const data = await res.json() as { reviews?: GmbReview[] };
  return data.reviews ?? [];
}
