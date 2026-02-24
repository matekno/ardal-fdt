"use client";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  color?: "orange" | "red" | "dark";
  children: React.ReactNode;
}

const accentMap = {
  orange: "border-[#ea580c]",
  red: "border-red-500",
  dark: "border-zinc-600",
};

export function SectionCard({
  title,
  subtitle,
  color = "orange",
  children,
}: SectionCardProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div
        className={`flex items-baseline gap-3 border-l-[3px] ${accentMap[color]} pl-3 mb-4`}
      >
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
          {title}
        </h3>
        {subtitle && (
          <span className="text-[10px] text-zinc-400">{subtitle}</span>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
