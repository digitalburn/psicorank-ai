import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { listReviews, refreshAccessToken } from "@/lib/gmb-api";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { data: tokenRow } = await supabase
    .from("gmb_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", user.id)
    .single();

  if (!tokenRow) return NextResponse.json({ reviews: [], connected: false });

  let accessToken = tokenRow.access_token;

  if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
    if (!tokenRow.refresh_token) {
      return NextResponse.json({ error: "Token expirado. Reconecte o GMB." }, { status: 401 });
    }
    const newTokens = await refreshAccessToken(tokenRow.refresh_token);
    accessToken = newTokens.access_token;
    await supabase.from("gmb_tokens").update({
      access_token: newTokens.access_token,
      expires_at: newTokens.expires_at,
    }).eq("user_id", user.id);
  }

  const { data: locations } = await supabase
    .from("gmb_locations")
    .select("account_id, location_id, location_name")
    .eq("user_id", user.id);

  if (!locations || locations.length === 0) {
    return NextResponse.json({ reviews: [], connected: true });
  }

  const allReviews = await Promise.all(
    locations.map((loc) =>
      listReviews(accessToken, loc.account_id, loc.location_id, 5).catch(() => []),
    ),
  );

  return NextResponse.json({
    connected: true,
    reviews: allReviews.flat(),
    locations,
  });
}
