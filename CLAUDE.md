# FDT - Fin de Turno (POC B)

## Qué es
App web interna de reporte de producción por turno para la fábrica de ladrillos HCCA Ardal/Retak.
Los supervisores completan un formulario de 16 secciones y se genera un email HTML con el reporte.

### Objetivo a corto / mediano plazo
Que los supervisores de mantenimiento utilicen esta herramienta para el mail de fin de turno de producción.

### Objetivo a mediano plazo
Que esta aplicación sirva también como repositorio para que los interesados puedan tomar decisiones con datos en el historial de esta aplicación.

### Objetivo a largo plazo
Reemplazar todos los mails de fin de turno del resto de áreas de la empresa con esta aplicación, para compartir información e integrar con otras fuentes de verdad de la empresa. 
Que esta aplicación sea un faro de excelencia y un ejemplo de lo que la mejora continua integrada con IA puede lograr.


## Stack
- Next.js 16 (App Router, TypeScript)
- React 19, React Hook Form 7, Zod 4
- Tailwind CSS 4
- Auth.js v5 (next-auth) — Google SSO con allowlist de emails

## Comandos
```bash
npm run dev      # Dev server en localhost:3000 — LO CORRE EL USUARIO, no Claude
npm run build    # Build de producción
npm run lint     # ESLint
```

## Dev server
**No usar `preview_start` ni arrancar `npm run dev` desde Claude.** El usuario lo corre manualmente. Para verificar cambios, usar `npm run build` (detecta errores de TypeScript). No es necesario un servidor corriendo para validar el trabajo.

## Estructura
```
src/
  app/
    page.tsx                          # Homepage: selector supervisor/turno
    login/page.tsx                    # Login con Google SSO
    fdt/page.tsx                      # Formulario principal (17 tabs)
    api/auth/[...nextauth]/route.ts   # Auth.js API route
    providers.tsx                     # SessionProvider (client)
    layout.tsx                        # Root layout
  components/
    fdt-form/                         # 17 componentes de sección del formulario
      FDTFormWrapper.tsx              # Estado global, tabs, auto-save
      SeccionEncabezado.tsx ... SeccionAutoelevadores.tsx
    ui/                               # Componentes reutilizables
      DynamicList.tsx, FormField.tsx, SelectField.tsx, etc.
    auth/
      LoginCard.tsx                   # UI del botón de login con Google
  lib/
    auth.ts                           # Auth.js config (Google provider, allowlist)
    schema.ts                         # Zod schemas del reporte (fuente de verdad)
    email-generator.ts                # Generador HTML email (inline CSS)
    constants.ts                      # TURNOS, SUPERVISORES, MOTIVOS, PUESTOS, TABS
  proxy.ts                            # Protección de rutas (redirect a /login, Next.js 16 proxy)
```

## Autenticación
- Google SSO via Auth.js v5, estrategia JWT (sin DB para sesiones)
- Allowlist de emails en env var `AUTH_ALLOWED_EMAILS`
- Emails no autorizados ven error en /login
- Todas las rutas protegidas excepto /login y /api/auth/*

## Variables de entorno (.env.local)
```
AUTH_SECRET           # npx auth secret
AUTH_GOOGLE_ID        # Google Cloud Console
AUTH_GOOGLE_SECRET    # Google Cloud Console
AUTH_ALLOWED_EMAILS   # lista@ardal.com.ar,otra@ardal.com.ar
```

## Desarrollo local (modo testeo)

### Requisitos
- PostgreSQL local (17.x)
- DB `fdt_ardal` creada y restaurada desde backup

### Setup inicial
```bash
createdb -U postgres fdt_ardal
psql -U postgres -d fdt_ardal -f "D:/Ardal/backups fdt-ardal/db_dump_2026-03-16.sql"
```

### `.env.development.local`
Next.js carga este archivo solo en `NODE_ENV=development`, con prioridad sobre `.env`:
```
DATABASE_URL="postgresql://postgres@localhost:5432/fdt_ardal"
```
`prisma.config.ts` también lo carga (via dotenv con override).

### Qué hace el modo testeo (automático en `npm run dev`)
- **Colores celestes**: el `@theme` CSS se overridea con `html[data-testmode]` en `globals.css`
- **Banner**: "MODO TESTEO — Entorno local" en la parte superior (`layout.tsx`)
- **Emails bloqueados**: `POST /api/reports/emit` salta el SMTP y loguea en consola
- **DB local**: usa la `DATABASE_URL` de `.env.development.local`

### Sistema de colores
Los colores de la app usan variables CSS del `@theme inline` de Tailwind CSS 4:
- `--color-ardal` → clase `bg-ardal`, `text-ardal`, `border-ardal`
- `--color-ardal-dark` → clase `bg-ardal-dark`, `text-ardal-dark`, etc.
- `--color-ardal-light` → clase `bg-ardal-light`, `text-ardal-light`, etc.

**NO usar colores hex hardcodeados** (`#ea580c`, etc.) en componentes. Usar siempre las clases theme.
Excepción: `email-generator.ts` usa hex inline porque genera HTML para email.

## Convenciones
- **Idioma**: español (UI, labels, textos)
- **Color principal**: `#ea580c` (naranja Ardal), dark: `#c2410c` — definido en `globals.css` `@theme inline`
- **CSS**: Tailwind CSS 4 para la app, inline CSS para el email HTML
- **Forms**: react-hook-form + zodResolver, auto-save a localStorage cada 30s
- **Listas dinámicas**: componente DynamicList con useFieldArray
- **Secciones vacías**: se omiten en el email (hasAnyField pattern)
- **Resumen mantenimiento**: se compila automáticamente al generar email

## Concepto clave
Los supervisores solo registran novedades (lo que fue distinto de lo normal en el turno). La mayoría de las secciones suelen quedar vacías. El formulario debe optimizarse para registrar rápidamente solo las secciones con datos.
