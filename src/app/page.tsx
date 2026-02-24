"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { TURNOS, SUPERVISORES } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [supervisor, setSupervisor] = useState("");
  const [turno, setTurno] = useState("TURNO MAÑANA");

  const handleStart = () => {
    if (!supervisor) {
      alert("Seleccione un supervisor");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const draft = {
      encabezado: {
        fecha: today,
        turno,
        supervisor,
      },
    };
    localStorage.setItem("fdt-draft", JSON.stringify(draft));
    router.push("/fdt");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        {session?.user && (
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <span>{session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="hover:text-red-500 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#ea580c] mb-1">FDT</h1>
          <p className="text-gray-500 text-sm">
            Fin de Turno — Ardal / Retak
          </p>
        </div>

        <div className="space-y-5">
          {/* Supervisor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Supervisor
            </label>
            <select
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
            >
              <option value="">Seleccionar supervisor...</option>
              {SUPERVISORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Turno
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TURNOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTurno(t)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    turno === t
                      ? "bg-[#ea580c] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t.replace("TURNO ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={handleStart}
            className="w-full py-3 px-4 font-medium bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition-colors mt-4"
          >
            Iniciar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}
