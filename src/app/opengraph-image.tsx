import { ImageResponse } from "next/og";

export const alt = "PsicoRank AI — Presença digital premium para psicólogos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "#060816",
        padding: "72px 80px",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orb top-left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(24,184,143,0.18)",
          filter: "blur(80px)",
          display: "flex",
        }}
      />
      {/* Orb bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.15)",
          filter: "blur(80px)",
          display: "flex",
        }}
      />

      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "14px",
            background: "linear-gradient(135deg,#18B88F,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "900",
          }}
        >
          P
        </div>
        <span
          style={{
            color: "white",
            fontSize: "26px",
            fontWeight: "700",
            display: "flex",
          }}
        >
          PsicoRank AI
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          maxWidth: 820,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "64px",
            fontWeight: "800",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          Presença digital premium
        </span>
        <span
          style={{
            color: "#18B88F",
            fontSize: "64px",
            fontWeight: "800",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          para psicólogos com IA.
        </span>
      </div>

      {/* Subtext */}
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "22px",
          marginTop: "28px",
          maxWidth: 680,
          lineHeight: 1.5,
          display: "flex",
        }}
      >
        Posts para Instagram, SEO local e avaliações Google — tudo em uma plataforma.
      </div>

      {/* Badge row */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          marginTop: "40px",
        }}
      >
        {["Claude IA", "+500 psicologos", "4.9 / 5.0"].map((badge) => (
          <div
            key={badge}
            style={{
              background: "rgba(24,184,143,0.12)",
              border: "1px solid rgba(24,184,143,0.35)",
              borderRadius: "100px",
              padding: "8px 22px",
              color: "#18B88F",
              fontSize: "16px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
            }}
          >
            {badge}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
