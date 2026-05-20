import Link from "next/link";
import { BrainCircuit, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  Produto: [
    { label: "Benefícios", href: "#beneficios" },
    { label: "Plataforma", href: "#plataforma" },
    { label: "Planos", href: "#planos" },
    { label: "FAQ", href: "#faq" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-[#060816]/80">
      {/* CTA Banner */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#0d1a2a] to-slate-950 dark:from-[#071118] dark:via-[#0a1520] dark:to-[#071118]"
        />
        <div
          aria-hidden
          className="absolute -left-20 top-0 h-[300px] w-[400px] rounded-full bg-mint/15 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute -right-20 bottom-0 h-[250px] w-[350px] rounded-full bg-indigo-500/15 blur-[100px]"
        />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pronto para crescer no digital?
            <span className="block bg-gradient-to-r from-mint to-cyan-400 bg-clip-text text-transparent">
              Comece grátis hoje.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/60">
            Junte-se a mais de 500 psicólogos que já aumentaram sua presença local com o PsicoRank
            AI. Sem cartão de crédito para começar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-mint px-8 py-4 text-base font-bold text-white shadow-[0_14px_32px_rgba(24,184,143,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(24,184,143,0.5)]"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Entrar na plataforma
            </Link>
          </div>
        </div>
      </div>

      {/* Footer body */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)] dark:bg-white dark:text-slate-950">
                <BrainCircuit className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">PsicoRank AI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Para psicólogos</p>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Plataforma de IA para psicólogos crescerem no digital com ética, segurança e
              resultados mensuráveis.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Instagram className="size-4" aria-hidden />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Linkedin className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-950 dark:text-white">
                {group}
              </p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-8 text-sm text-slate-400 dark:border-slate-800/70 sm:flex-row">
          <p>© {new Date().getFullYear()} PsicoRank AI. Todos os direitos reservados.</p>
          <p>Feito com ♥ para psicólogos brasileiros</p>
        </div>
      </div>
    </footer>
  );
}
