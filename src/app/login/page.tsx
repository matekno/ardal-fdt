import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/LoginCard";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  const isUnauthorized = params.error === "unauthorized";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] min-h-[100dvh]">

      {/* Left — Dark branded panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 relative overflow-hidden">
        {/* Decorative watermark */}
        <div
          className="absolute -bottom-6 -left-2 text-[13rem] font-black tracking-tighter leading-none text-zinc-900 select-none pointer-events-none"
          aria-hidden="true"
        >
          FDT
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
            <span className="text-zinc-400 text-xs font-medium tracking-[0.18em] uppercase">
              Ardal / Retak
            </span>
          </div>

          <h1 className="text-[5.5rem] font-black tracking-tighter leading-none text-white mb-3">
            FDT
          </h1>
          <p className="text-zinc-400 text-lg font-light">Fin de Turno</p>
          <p className="text-zinc-600 text-xs mt-1.5 leading-relaxed max-w-[28ch]">
            Sistema de reportes de producción por turno
          </p>
        </div>

        <div className="relative z-10 border-t border-zinc-800 pt-5">
          <p className="text-zinc-600 text-xs">
            Acceso exclusivo para supervisores autorizados
          </p>
        </div>
      </div>

      {/* Right — Login panel */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-20 bg-zinc-50">
        <LoginCard isUnauthorized={isUnauthorized} />
      </div>
    </div>
  );
}
