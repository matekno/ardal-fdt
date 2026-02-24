# POC B — App Web FDT (Fin de Turno)

## Objetivo

Reemplazar Google Sheets con una app web propia. Formulario por secciones, validación, historial en DB, y envío de email HTML idéntico al de POC A.

## Stack

- **Next.js 14+** (App Router, TypeScript)
- **React Hook Form + Zod** (validación)
- **SQLite** via better-sqlite3 (persistencia e historial)
- **Nodemailer** (envío SMTP)
- **Tailwind CSS** (UI)

## Estructura objetivo

```
poc-b/
  app/
    page.tsx                    -- Inicio: selección de supervisor/turno
    fdt/
      page.tsx                  -- Formulario principal con tabs por sección
      [id]/page.tsx             -- Ver reporte histórico
    historial/page.tsx          -- Lista/búsqueda de reportes
    api/
      fdt/route.ts              -- POST: guardar + enviar email
      fdt/[id]/route.ts         -- GET: obtener reporte
  components/
    fdt-form/
      FDTFormWrapper.tsx        -- Estado global, tabs, progreso
      SeccionEncabezado.tsx
      SeccionGeneral.tsx
      SeccionPersonal.tsx       -- La más compleja (listas dinámicas)
      SeccionMolino.tsx         -- Reutilizable para molino 2 y 3
      SeccionSalaControl.tsx
      SeccionMaduracion.tsx
      SeccionCorte.tsx
      SeccionRotador.tsx
      SeccionPrecurado.tsx
      SeccionCaldera.tsx
      SeccionDesmolde.tsx
      SeccionGranallado.tsx
      SeccionScrap.tsx
      SeccionTransformacion.tsx
      SeccionAutoelevadores.tsx
    ui/
      DynamicList.tsx           -- Componente genérico para listas de N items
      NumericInput.tsx          -- Input numérico con unidad
      SectionHeader.tsx         -- Headers de sección con color
      ProgressIndicator.tsx     -- Indicador de progreso/completitud
  lib/
    schema.ts                   -- Zod schema (espejo de poc-a/schema.js)
    email.ts                    -- Generación HTML + envío SMTP
    db.ts                       -- Queries SQLite
```

## Qué reutilizar de POC A

| Archivo POC A | Uso en POC B |
|---|---|
| `poc-a/schema.js` | Convertir a `lib/schema.ts` con tipos Zod. Es la fuente de verdad de la estructura de datos. |
| `poc-a/html-generator.js` | Adaptar a `lib/email.ts`. La generación HTML debe producir el **mismo email** que POC A. |

> **No se necesita `parser.js`** — ese parsea el JSON plano de Google Sheets. En POC B los datos ya vienen estructurados del formulario.

## Las 19 secciones del formulario

1. Encabezado (fecha, turno, supervisor)
2. General (explicación no cumplimiento, comentarios)
3. Personal — Ausentes (lista dinámica, max 8, par: nombre + motivo)
4. Personal — Cambios de puesto (lista dinámica, max 8, par: personal + puesto)
5. Personal — Cambios de horario (lista dinámica, max 5, trio: ausente + presente + comentario)
6. Personal — Horas extras (lista dinámica, max 5, trio: personal + desde + hasta)
7. Personal — Permisos, devolución horas, personal nuevo, vacaciones, capacitación
8. Molino 3 (dosificación, horas marcha, rendimiento, cuerpos molienda, agua, mantenimiento)
9. Molino 2 (ídem sin dosificación)
10. Stock de Barro
11. Sala de Control
12. Maduración
13. Corte / Desmantelado
14. Rotador
15. Precurado / Autoclaves
16. Caldera
17. Desmolde
18. Granallado
19. Scrap
20. Transformación (3 sub-tamaños: 15, 17.5, 20)
21. Autoelevadores

> El "Resumen de Mantenimiento" no es una sección del form: se **compila automáticamente** al generar el email, recolectando todos los campos `mantenimiento` de cada sección.

## Listas dinámicas — patrón clave

Muchas secciones tienen listas de items repetidos. El componente `DynamicList.tsx` debe manejar:

- **Par**: nombre + motivo (ausentes), personal + puesto (cambios puesto)
- **Trio**: personal + desde + hasta (horas extras), ausente + presente + comentario (cambios horario)
- **Simple**: un solo campo por item (permisos, capacitación)
- Botones agregar/quitar item
- Límite máximo configurable por lista

## Validación

- Encabezado obligatorio (fecha, turno, supervisor)
- Campos numéricos: solo números, con unidades (HS, CM, KG, UN, PLL, MT, %)
- Campos texto: textarea libre
- Listas dinámicas: validar cada campo del item si el item tiene algún dato
- No es necesario que todas las secciones tengan datos — el reporte puede tener secciones vacías

## Base de datos (SQLite)

```sql
CREATE TABLE reportes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,          -- YYYY-MM-DD
  turno TEXT NOT NULL,          -- "Mañana", "Tarde", "Noche"
  supervisor TEXT NOT NULL,
  data TEXT NOT NULL,           -- JSON completo del reporte
  email_enviado INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## Email

- Destino: `fdt@ardal.com.ar`
- Subject: `FDT [fecha] — [turno] — [supervisor]`
- Body: HTML generado con misma lógica que POC A (inline CSS, secciones condicionales, resumen mantenimiento auto-compilado)
- SMTP config via variables de entorno (.env)

## Diseño UI

- Tabs laterales o superiores para navegar secciones
- Indicador de progreso (cuántas secciones tienen datos)
- Mobile-friendly pero priorizando desktop (supervisores usan PC)
- Estilo limpio y profesional con Tailwind
- Colores Ardal/Retak: naranja (#ea580c) como acento

## Para arrancar

```bash
cd D:\Ardal\fdt\poc-b
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
npm install react-hook-form @hookform/resolvers zod better-sqlite3 nodemailer
npm install -D @types/better-sqlite3 @types/nodemailer
```
