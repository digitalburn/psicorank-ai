import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens, listAccounts, listLocations } from "@/lib/gmb-api";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(`${origin}/dashboard?gmb=error`);
  }

  const savedState = request.cookies.get("gmb_oauth_state")?.value;
  if (state !== savedState) {
    return NextResponse.redirect(`${origin}/dashboard?gmb=error`);
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/gmb/callback`;
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    await supabase.from("gmb_tokens").upsert({
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
    }, { onConflict: "user_id" });

    const accounts = await listAccounts(tokens.access_token);

    for (const account of accounts) {
      const locations = await listLocations(tokens.access_token, account.name);
      for (const loc of locations) {
        await supabase.from("gmb_locations").upsert({
          user_id: user.id,
          account_id: loc.accountId,
          location_id: loc.locationId,
          location_name: loc.locationName,
          address: loc.address,
        }, { onConflict: "user_id, location_id" });
      }
    }

    const response = NextResponse.redirect(`${origin}/dashboard?gmb=connected`);
    response.cookies.delete("gmb_oauth_state");
    return response;
  } catch (err) {
    console.error("[gmb/callback] erro:", err);
    return NextResponse.redirect(`${origin}/dashboard?gmb=error`);
  }
}
