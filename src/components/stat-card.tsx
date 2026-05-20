import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<LucideProps>;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink/50">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className="grid size-11 place-items-center rounded-xl bg-mint/10 text-mint">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-ink/58">{detail}</p>
    </div>
  );
}
