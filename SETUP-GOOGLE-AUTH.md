# Setup de Google OAuth para FDT

## 1. Crear proyecto en Google Cloud Console

1. Ir a https://console.cloud.google.com/
2. Click en el selector de proyecto (arriba a la izquierda) → **Nuevo proyecto**
3. Nombre: `Ardal FDT` → **Crear**

## 2. Configurar pantalla de consentimiento OAuth

1. En el menú lateral: **APIs & Services → OAuth consent screen**
2. User type:
   - **Internal** si tienen Google Workspace (solo usuarios del dominio)
   - **External** si usan cuentas Gmail comunes
3. Completar:
   - App name: `FDT - Fin de Turno`
   - User support email: tu email
   - Developer contact email: tu email
4. Scopes: agregar `email` y `profile`
5. Guardar

## 3. Crear credenciales OAuth

1. En el menú lateral: **APIs & Services → Credentials**
2. Click **+ Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `FDT Local`
5. **Authorized JavaScript origins**: `http://localhost:3000`
6. **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Click **Create**
8. Copiar el **Client ID** y **Client Secret**

## 4. Configurar variables de entorno

1. Generar el secret de Auth.js:
   ```bash
   npx auth secret
   ```
   Copiar el valor que genera.

2. Editar el archivo `.env.local` en la raíz de poc-b:
   ```
   AUTH_SECRET=<el valor generado>
   AUTH_GOOGLE_ID=<tu Client ID>
   AUTH_GOOGLE_SECRET=<tu Client Secret>
   AUTH_ALLOWED_EMAILS=email1@ardal.com.ar,email2@ardal.com.ar
   ```

3. Agregar los emails de los supervisores y managers autorizados (separados por coma, sin espacios).

## 5. Probar

```bash
npm run dev
```

1. Abrir http://localhost:3000 → debería redirigir a /login
2. Click "Ingresar con Google" → flujo OAuth
3. Si el email está en la allowlist → vuelve al homepage
4. Si no está → muestra "Tu cuenta no tiene acceso"

## Para producción

Agregar el dominio de producción en Google Cloud Console:
- Authorized JavaScript origins: `https://tu-dominio.com`
- Authorized redirect URIs: `https://tu-dominio.com/api/auth/callback/google`
