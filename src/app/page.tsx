"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Warning,
  SignOut,
  ClockCounterClockwise,
  Notepad,
  Gear,
  ArrowRight,
  ArrowLeft,
} from "@phosphor-icons/react";
import { TURNOS, SUPERVISORES } from "@/lib/constants";

type View = "menu" | "nuevo-reporte";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [view, setView] = useState<View>("menu");
  const [supervisor, setSupervisor] = useState("");
  const [turno, setTurno] = useState("TURNO MAÑANA");
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]);
  const [error, setError] = useState(false);

  const handleStart = () => {
    if (!supervisor) {
      setError(true);
      return;
    }
    setError(false);
    const draft = { encabezado: { fecha, turno, supervisor } };
    localStorage.setItem("fdt-draft", JSON.stringify(draft));
    router.push("/fdt");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] min-h-[100dvh]">

      {/* Left — Dark branded panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 relative overflow-hidden">
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

      {/* Right — Content panel */}
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

        {/* ── MENU VIEW ── */}
        {view === "menu" && (
          <div className="w-full max-w-sm">
            <p className="text-[11px] font-semibold text-zinc-400 tracking-[0.18em] uppercase mb-8">
              ¿Qué querés hacer?
            </p>

            {/* Primary: Reporte */}
            <button
              onClick={() => setView("nuevo-reporte")}
              className="group w-full flex items-center justify-between px-6 py-5 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] active:scale-[0.99] active:translate-y-[1px] mb-3"
              style={{ transition: "all 0.2s var(--ease-spring)" }}
            >
              <div className="flex items-center gap-3">
                <Notepad size={20} weight="duotone" />
                <div className="text-left">
                  <p className="font-semibold text-sm leading-tight">Reporte</p>
                  <p className="text-orange-200 text-xs mt-0.5 font-light">
                    Nuevo reporte de turno
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5"
                style={{ transition: "all 0.2s var(--ease-spring)" }}
              />
            </button>

            {/* Secondary: Historial */}
            <button
              onClick={() => router.push("/historial")}
              className="group w-full flex items-center justify-between px-6 py-4 bg-white border border-zinc-200 text-zinc-700 rounded-lg hover:border-zinc-400 hover:text-zinc-900 active:scale-[0.99] active:translate-y-[1px] mb-2"
              style={{ transition: "all 0.2s var(--ease-spring)" }}
            >
              <div className="flex items-center gap-3">
                <ClockCounterClockwise size={17} className="text-zinc-400 group-hover:text-zinc-600" style={{ transition: "color 0.2s var(--ease-spring)" }} />
                <div className="text-left">
                  <p className="font-medium text-sm leading-tight">Historial</p>
                  <p className="text-zinc-400 text-xs mt-0.5 font-light">
                    Reportes anteriores
                  </p>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5"
                style={{ transition: "all 0.2s var(--ease-spring)" }}
              />
            </button>

            {/* Secondary: Configuración */}
            <button
              onClick={() => router.push("/configuracion")}
              className="group w-full flex items-center justify-between px-6 py-4 bg-white border border-zinc-200 text-zinc-700 rounded-lg hover:border-zinc-400 hover:text-zinc-900 active:scale-[0.99] active:translate-y-[1px]"
              style={{ transition: "all 0.2s var(--ease-spring)" }}
            >
              <div className="flex items-center gap-3">
                <Gear size={17} className="text-zinc-400 group-hover:text-zinc-600" style={{ transition: "color 0.2s var(--ease-spring)" }} />
                <div className="text-left">
                  <p className="font-medium text-sm leading-tight">Configuración</p>
                  <p className="text-zinc-400 text-xs mt-0.5 font-light">
                    SMTP, destinatarios, ajustes
                  </p>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5"
                style={{ transition: "all 0.2s var(--ease-spring)" }}
              />
            </button>
          </div>
        )}

        {/* ── NUEVO REPORTE VIEW ── */}
        {view === "nuevo-reporte" && (
          <div className="w-full max-w-sm">
            <button
              onClick={() => { setView("menu"); setError(false); }}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 tracking-[0.18em] uppercase mb-8 hover:text-zinc-600"
              style={{ transition: "color 0.2s var(--ease-spring)" }}
            >
              <ArrowLeft size={11} weight="bold" />
              Nuevo reporte
            </button>

            {/* Fecha */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.1em] mb-1.5">
                Fecha del reporte
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full"
              />
            </div>

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
        )}
      </div>
    </div>
  );
}
