"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { TURNOS, SUPERVISORES } from "@/lib/constants";
import { Warning, SignOut } from "@phosphor-icons/react";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [supervisor, setSupervisor] = useState("");
  const [turno, setTurno] = useState("TURNO MAÑANA");
  const [error, setError] = useState(false);

  const handleStart = () => {
    if (!supervisor) {
      setError(true);
      return;
    }
    setError(false);
    const today = new Date().toISOString().split("T")[0];
    const draft = { encabezado: { fecha: today, turno, supervisor } };
    localStorage.setItem("fdt-draft", JSON.stringify(draft));
    router.push("/fdt");
  };

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

        {/* Top content */}
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

        {/* Bottom — user session */}
        {session?.user && (
          <div className="relative z-10 border-t border-zinc-800 pt-5">
            <p className="text-zinc-500 text-xs">{session.user.email}</p>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-zinc-600 text-xs mt-2 hover:text-red-400"
              style={{ transition: "color 0.2s var(--ease-spring)" }}
            >
              <SignOut size={12} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Right — Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-20 bg-zinc-50">

        {/* Mobile branding */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
            <span className="text-zinc-400 text-xs tracking-[0.18em] uppercase font-medium">
              Ardal / Retak
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">FDT</h1>
          <p className="text-zinc-500 text-sm">Fin de Turno</p>
        </div>

        {/* Mobile session info */}
        {session?.user && (
          <div className="lg:hidden flex items-center justify-between text-xs text-zinc-400 mb-6 pb-4 border-b border-zinc-200">
            <span>{session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 hover:text-red-500"
              style={{ transition: "color 0.2s var(--ease-spring)" }}
            >
              <SignOut size={11} />
              Salir
            </button>
          </div>
        )}

        <div className="w-full max-w-sm">
          <p className="text-[11px] font-semibold text-zinc-400 tracking-[0.18em] uppercase mb-8">
            Nuevo reporte
          </p>

          {/* Supervisor */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.1em] mb-1.5">
              Supervisor
            </label>
            <select
              value={supervisor}
              onChange={(e) => {
                setSupervisor(e.target.value);
                if (e.target.value) setError(false);
              }}
            >
              <option value="">Seleccionar...</option>
              {SUPERVISORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {error && (
              <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5">
                <Warning size={11} weight="bold" />
                Seleccioná un supervisor para continuar
              </p>
            )}
          </div>

          {/* Turno */}
          <div className="mb-8">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.1em] mb-1.5">
              Turno
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TURNOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTurno(t)}
                  className={`py-2.5 text-[13px] font-medium rounded-md border active:scale-[0.97] active:translate-y-[1px] ${
                    turno === t
                      ? "bg-[#ea580c] border-[#ea580c] text-white"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800"
                  }`}
                  style={{ transition: "all 0.2s var(--ease-spring)" }}
                >
                  {t.replace("TURNO ", "")}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 px-6 bg-[#ea580c] text-white font-medium text-sm rounded-md hover:bg-[#c2410c] active:scale-[0.99] active:translate-y-[1px]"
            style={{ transition: "all 0.2s var(--ease-spring)" }}
          >
            Iniciar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}
