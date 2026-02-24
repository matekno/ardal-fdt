# FDT - Fin de Turno (POC B)

## Qué es
App web interna de reporte de producción por turno para la fábrica de ladrillos HCCA Ardal/Retak.
Los supervisores completan un formulario de 17 secciones y se genera un email HTML con el reporte.

## Stack
- Next.js 16 (App Router, TypeScript)
- React 19, React Hook Form 7, Zod 4
- Tailwind CSS 4
- Auth.js v5 (next-auth) — Google SSO con allowlist de emails

## Comandos
```bash
npm run dev      # Dev server en localhost:3000
npm run build    # Build de producción
npm run lint     # ESLint
```

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

## Convenciones
- **Idioma**: español (UI, labels, textos)
- **Color principal**: `#ea580c` (naranja Ardal), dark: `#c2410c`
- **CSS**: Tailwind CSS 4 para la app, inline CSS para el email HTML
- **Forms**: react-hook-form + zodResolver, auto-save a localStorage cada 30s
- **Listas dinámicas**: componente DynamicList con useFieldArray
- **Secciones vacías**: se omiten en el email (hasAnyField pattern)
- **Resumen mantenimiento**: se compila automáticamente al generar email
