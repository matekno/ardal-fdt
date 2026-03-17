# Retrocompatibilidad de datos — Guía para cambios de schema

## Por qué esto importa

La DB almacena reportes como JSON crudo (`data Json` en Prisma). Los reportes ya guardados **nunca se migran automáticamente** — conservan la shape exacta del momento en que fueron creados. Hay que garantizar que el código nuevo pueda leer datos viejos sin crashear.

## Los 3 caminos de lectura de datos

| # | Camino | Pasa por Zod | Migra automáticamente |
|---|--------|:---:|:---:|
| 1 | Formulario (localStorage → form) | Sí (`z.preprocess`) | Sí |
| 2 | API POST (preview/emit) | Sí (`safeParse`) | Sí |
| 3 | Historial / exports (DB → UI directo) | **No** | **No** |

El camino 3 es el problemático. `GET /api/reports/:id` devuelve el JSON crudo y `HistorialView.tsx` lo castea directo como `Report`. Lo mismo aplica a `excel-export.ts` y `report-metrics.ts`.

## Regla general

> Todo código que consuma datos de la DB directamente (sin pasar por Zod) debe tolerar el formato viejo.

## Tipos de cambios y qué hacer

### Agregar un campo string/number opcional nuevo
**Riesgo: bajo.** Los helpers (`txtRow`, `hd`, `hasAnyField`, `compilarResumenMantenimiento`) ya manejan `undefined`.

**Checklist:**
- [ ] Agregar al schema con valor por defecto en `createEmptyReport()`
- [ ] En `email-generator.ts`: usar `txtRow()` que ya maneja undefined
- [ ] En `compilarResumenMantenimiento()`: `a.texto && a.texto.trim()` ya filtra undefined
- [ ] No se necesita `z.preprocess`

### Cambiar la shape de un campo existente (ej: flat → array, string → object)
**Riesgo: alto.** Es el caso que genera crashes.

**Checklist:**
- [ ] Agregar `z.preprocess` en `schema.ts` que detecte el formato viejo y lo convierta al nuevo (cubre caminos 1 y 2)
- [ ] En `email-generator.ts`: usar optional chaining (`?.`) en el campo nuevo Y fallback al formato viejo con `"campoViejo" in obj`
- [ ] En `report-metrics.ts` y `excel-export.ts`: mismo patrón de optional chaining
- [ ] Testear con un reporte viejo de la DB (o simular el JSON viejo)

### Agregar un campo requerido a un schema existente
**Riesgo: medio.** Reportes viejos no lo tendrán.

**Checklist:**
- [ ] Hacerlo opcional en el schema (`z.string()` sin `.min(1)`) o usar `z.preprocess` con default
- [ ] En `createEmptyReport()`: agregar valor por defecto
- [ ] En `email-generator.ts`: verificar existencia antes de renderizar

### Renombrar un campo
**Riesgo: alto.** Equivalente a eliminar + agregar.

**Checklist:**
- [ ] Agregar `z.preprocess` que mapee nombre viejo → nombre nuevo
- [ ] En `email-generator.ts`: chequear ambos nombres
- [ ] Considerar si vale la pena o es mejor mantener el nombre viejo

## Archivos que consumen datos crudos de la DB (camino 3)

Estos son los archivos que hay que revisar siempre:

| Archivo | Qué hace | Cómo accede a los datos |
|---------|----------|------------------------|
| `email-generator.ts` | Renderiza HTML del email | Recibe `Report` (puede ser de DB) |
| `compilarResumenMantenimiento()` en `schema.ts` | Compila resumen | Accede a `.mantenimiento` de cada sección |
| `HistorialView.tsx` | Muestra reporte en drawer | `full.data as Report` sin validar |
| `report-metrics.ts` | Extrae métricas para columnas indexadas | Accede a campos específicos |
| `excel-export.ts` | Exporta a Excel | Accede a todos los campos del reporte |
| `ProductionCharts.tsx` | Gráficos de historial | Usa métricas ya extraídas (menor riesgo) |

## Ejemplo real: migración de ajustadas (F9)

**Formato viejo (flat):**
```json
{ "activo": true, "signo": "+", "cantidad": 5, "medida": "mm" }
```

**Formato nuevo (multi-line):**
```json
{ "activo": true, "lineas": [{ "signo": "+", "cantidad": 5, "medida": "mm" }] }
```

**Cómo se resolvió:**

1. `z.preprocess` en `schema.ts` detecta `"signo" in obj && !("lineas" in obj)` y convierte
2. `email-generator.ts` usa `des.ajustadas1era.lineas?.length > 0` (optional chaining) y tiene fallback: `else if ("signo" in des.ajustadas1era)` para renderizar el formato viejo

## Tip: cómo testear

Para verificar que el código tolera datos viejos sin tener que buscar un reporte viejo:
1. Mirar `createEmptyReport()` para la shape actual
2. Quitar los campos nuevos del JSON manualmente
3. Pasarlo por `generateEmailHTML()` y verificar que no crashea
