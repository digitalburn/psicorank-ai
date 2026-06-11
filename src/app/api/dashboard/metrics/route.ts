import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const now = new Date();
  const twelveWeeksAgo = new Date(now);
  twelveWeeksAgo.setDate(now.getDate() - 84);

  const [postsRes, seoRes, profileRes, gmbRes] = await Promise.all([
    supabase
      .from("generated_posts")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", twelveWeeksAgo.toISOString())
      .order("created_at", { ascending: true }),

    supabase
      .from("generated_seo")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("profiles")
      .select("name, specialty, city, clinic_name, plan")
      .eq("id", user.id)
      .single(),

    supabase
      .from("gmb_locations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const posts = postsRes.data ?? [];
  const seoRows = seoRes.data ?? [];
  const profile = profileRes.data;
  const gmbCount = gmbRes.count ?? 0;

  // Weekly trend — last 12 weeks
  const weekBuckets = Array.from({ length: 12 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (11 - i) * 7);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  });

  const trendSeries = weekBuckets.map((weekStart, i) => {
    const weekEnd = i < 11 ? weekBuckets[i + 1] : new Date(now.getTime() + 86400000);
    const count = posts.filter((p) => {
      const d = new Date(p.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;
    return count;
  });

  // Profile completeness score (0-100)
  const fields = [profile?.name, profile?.specialty, profile?.city, profile?.clinic_name];
  const filled = fields.filter(Boolean).length;
  const completenessScore = Math.round((filled / fields.length) * 100);

  // SEO keyword score — more SEO packs = better keywords
  const seoScore = Math.min(60 + seoRows.length * 8, 98);

  // Authority = GMB connected + posts quantity
  const totalPosts = posts.length;
  const authorityScore = Math.min(40 + (gmbCount > 0 ? 30 : 0) + Math.min(totalPosts * 2, 30), 99);

  const consolidatedScore = Math.round((completenessScore + seoScore + authorityScore) / 3);

  // Recent activity (last 5 events — mix of posts and SEO)
  const recentPosts = await supabase
    .from("generated_posts")
    .select("id, topic, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const recentSeo = await supabase
    .from("generated_seo")
    .select("id, city, specialty, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  const activity = [
    ...(recentPosts.data ?? []).map((p) => ({
      title: `Post sobre ${p.topic} gerado`,
      tag: "Instagram",
      accent: "emerald" as const,
      time: timeAgo(new Date(p.created_at)),
    })),
    ...(recentSeo.data ?? []).map((s) => ({
      title: `SEO local para ${s.city} criado`,
      tag: "Google Meu Negócio",
      accent: "blue" as const,
      time: timeAgo(new Date(s.created_at)),
    })),
  ]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  return NextResponse.json({
    trendSeries,
    completenessScore,
    seoScore,
    authorityScore,
    consolidatedScore,
    activity,
    totalPosts,
    totalSeo: seoRows.length,
    gmbConnected: gmbCount > 0,
    plan: profile?.plan ?? "starter",
  });
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
