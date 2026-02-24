"use client";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  color?: "orange" | "red" | "dark";
  children: React.ReactNode;
}

const colorMap = {
  orange: "bg-[#ea580c]",
  red: "bg-red-600",
  dark: "bg-slate-800",
};

export function SectionCard({
  title,
  subtitle,
  color = "orange",
  children,
}: SectionCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className={`${colorMap[color]} px-4 py-3`}>
        <h3 className="font-bold text-sm uppercase tracking-wide text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-white/80 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}
