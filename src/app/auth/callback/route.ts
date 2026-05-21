import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", errorDescription ?? error);
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const cookieStore = await cookies();
  const pendingCookies: Array<Parameters<typeof cookieStore.set>> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            pendingCookies.push([name, value, options]);
          });
        },
      },
    },
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "Link inválido ou expirado. Tente entrar novamente.");
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("specialty, clinic_name")
    .maybeSingle();

  const needsOnboarding = !profile?.specialty || !profile?.clinic_name;

  const redirectUrl = new URL(needsOnboarding ? "/onboarding" : "/dashboard", origin);
  const response = NextResponse.redirect(redirectUrl);

  pendingCookies.forEach(([name, value, options]) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
