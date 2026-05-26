# context.md — Contexto Acumulado del Proyecto

> Este archivo registra las decisiones tomadas, el progreso y el estado actual del proyecto. Se actualiza en cada sesión de desarrollo.

---

## Estado Actual

**Fase:** Código 100% completado — fase de pruebas locales  
**Última actualización:** 2026-05-23

### Progreso por módulo

| Módulo | Estado |
|--------|--------|
| Setup inicial (Next.js 16 + Supabase + Tailwind v4) | ✅ Completado |
| Layout raíz + fuentes + globals.css | ✅ Completado |
| Estructura de carpetas y páginas stub | ✅ Completado |
| Auth guard (`src/proxy.ts` — Next.js 16) | ✅ Completado |
| Rutas API — Stripe checkout + webhook | ✅ Completado |
| Rutas API — Presigned URL para R2 (`/api/upload/presign`) | ✅ Completado |
| Esquema SQL + RLS policies (Supabase) | ✅ Completado |
| Configuración Cloudflare R2 (`src/lib/r2.ts`) | ✅ Completado |
| Admin — Login (`/admin/login`) | ✅ Completado |
| Admin — Layout con sidebar y nav activo | ✅ Completado |
| Admin — Gestor de Proyectos (CRUD + toggle destacado) | ✅ Completado |
| Admin — Gestor de Marcas (upload R2 + CRUD) | ✅ Completado |
| Admin — Gestor de Fotos (drag & drop múltiple) | ✅ Completado |
| Home — HeroSection | ✅ Completado |
| Home — FeaturedProjects | ✅ Completado |
| Home — BrandsCarousel (Framer Motion loop) | ✅ Completado |
| Portfolio — Grid de proyectos | ✅ Completado |
| Portfolio — Galería con lightbox | ✅ Completado |
| Shop — Grid de productos | ✅ Completado |
| Shop — Stripe Checkout integrado | ✅ Completado |
| Deploy en Vercel | ⏳ Pendiente |

---

## Decisiones de Arquitectura

### 2026-05-23 — Sesión 6: Home pública (Hero + FeaturedProjects + BrandsCarousel)

**Completado:**
- `src/components/home/Hero.tsx` — Server Component. Full-screen, tipografía `clamp`, gradiente radial, scroll indicator animado, botón CTA "Ver Portfolio"
- `src/components/home/FeaturedProjects.tsx` — Server Component. Fetch de `is_featured = true`, grid adaptativo (1/2/3 cols según cantidad), hover overlay con título, placeholder sin imagen
- `src/components/home/BrandsCarousel.tsx` — Client Component. Framer Motion `animate x: 0%→-50%` sobre array duplicado, gradientes en bordes, logos con `invert` para fondo oscuro
- `src/app/(public)/layout.tsx` — Actualizado a `async`, fetch de brands en servidor, BrandsCarousel en footer con label "Con la confianza de"
- `src/app/(public)/page.tsx` — Actualizado con `<Hero>` y `<FeaturedProjects>`
- Build: 15 rutas, todo limpio

**Patrón BrandsCarousel:** El layout (Server) hace el fetch y pasa los brands como prop al Client Component. Esto evita tener el cliente haciendo fetch propio y mantiene el SSR. La duración del carrusel es `max(n*4, 20)` segundos para ajustarse al número de logos.

### 2026-05-23 — Sesión 5: Admin — Gestor de Fotos

**Completado:**
- `src/app/admin/photos/actions.ts` — Server Actions: `savePhoto`, `deletePhoto`, `updatePhotoOrder`
- `src/components/admin/PhotoUploader.tsx` — Drag & drop múltiple con react-dropzone, upload paralelo a R2, estados visuales por foto (pending/uploading/done/error)
- `src/components/admin/DeletePhotoButton.tsx` — Botón eliminar con confirmación
- `src/app/admin/photos/page.tsx` — Selector de proyecto por slug, uploader, galería de fotos existentes
- Build: 15 rutas compiladas sin errores

**Patrón del uploader:** Drag & drop → acumula items en estado local → al pulsar "Subir" hace Promise.all de todos los pending → cada uno: presign → PUT a R2 → savePhoto(projectId, publicUrl). Los errores se muestran por imagen sin bloquear el resto.

**Selector de proyecto:** Implementado con query param `?project=slug` (Server Component, sin estado cliente). Cada proyecto es un `<a>` que recarga la página con el slug seleccionado. Las fotos del proyecto se cargan en el servidor.

### 2026-05-23 — Sesión 4: Admin Panel (Proyectos + Marcas)

**Completado:**
- `src/lib/supabase/admin.ts` — cliente con `service_role` que bypasea RLS
- `src/app/admin/projects/actions.ts` — Server Actions: `createProject`, `toggleFeatured`, `deleteProject`
- `src/app/admin/brands/actions.ts` — Server Actions: `createBrand`, `deleteBrand`
- `src/app/api/upload/presign/route.ts` — endpoint genérico de presigned URLs (reutilizable para fotos, logos, productos)
- Componentes: `AdminNav`, `CreateProjectForm`, `FeaturedToggle`, `DeleteButton`, `CreateBrandForm`, `DeleteBrandButton`
- Build: 16 rutas compiladas, todo limpio

**Patrón de operaciones admin:** Se usa siempre el `createAdminClient()` (service_role) para CRUD en Server Actions, nunca el cliente normal. Esto evita problemas con RLS en escrituras.

**CORS en R2:** Obligatorio configurar en Cloudflare Dashboard → R2 → bucket → Settings → CORS para que los PUT desde el navegador funcionen. Orígenes permitidos: `http://localhost:3000` y el dominio de producción.

### 2026-05-23 — Sesión 3: Cambio a Cloudflare R2 + Fase 2 Base de Datos

**CAMBIO DE ARQUITECTURA — Storage:** Se abandona Supabase Storage a favor de **Cloudflare R2**.
- **Razón:** Menor coste, mayor ancho de banda, y necesidad de saltarse el límite de 4.5 MB de Vercel en uploads.
- **Impacto:** La tabla `photos` ya no tiene `storage_path`. Solo guarda la `url` pública de R2.
- **Flujo de upload:** Presigned URL vía `@aws-sdk/s3-request-presigner` → el navegador sube directamente a R2 → la URL pública se guarda en Supabase.
- **Archivos nuevos/modificados:** `src/lib/r2.ts`, `next.config.ts`, `src/types/index.ts`, `.env.local`, migration SQL.
- **Nuevas env vars:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `NEXT_PUBLIC_R2_PUBLIC_URL`.

### 2026-05-23 — Sesión 2: Inicialización del proyecto (Fase 1)

**Versiones reales instaladas:**
- Next.js: 16.2.6 (no 14 como se planificó — usar siempre latest)
- Tailwind CSS: v4 (sintaxis `@import "tailwindcss"`, config en CSS, no tailwind.config.js)
- Stripe API version: `2026-04-22.dahlia`
- Node.js requerido: >=20.9.0 (usar nvm con v23.6.1)

**CAMBIO CRÍTICO — Next.js 16:** El archivo `middleware.ts` pasa a llamarse `proxy.ts`. La función exportada pasa de `middleware()` a `proxy()`, y el config pasa de `config` a `proxyConfig`. Migrar con `npx @next/codemod@latest upgrade`.

**Build verificado:** 15 rutas compiladas sin errores. Ver salida:
- `/` y páginas de shop/portfolio → Static ○
- `/admin/*` y `/api/*` → Dynamic ƒ (server-rendered)
- Proxy de auth reconocido por Next.js

### 2026-05-23 — Sesión 1: Definición del proyecto

**Decisión:** Stack confirmado: Next.js 16 App Router, Supabase, Stripe, Vercel.

**Motivación del diseño:**
- El cliente es fotógrafo/creador audiovisual → las fotos son el protagonista absoluto.
- Diseño minimalista para no competir visualmente con el contenido.
- Una sola vista de grid para portfolio (sin subcategorías) para simplificar la navegación.

**Decisión sobre Admin:**
- Ruta `/admin` protegida con Supabase Auth (magic link o email/password, un solo usuario).
- No se usa un CMS externo para mantener el control total y reducir costes.

**Decisión sobre Stripe:**
- Stripe Checkout (hosted) en lugar de Elements custom para minimizar la complejidad y cumplir PCI DSS sin esfuerzo adicional.

**Decisión sobre imágenes:**
- Supabase Storage para todas las imágenes (proyectos, logos, productos).
- `next/image` con dominio de Supabase configurado en `next.config.ts`.
- Se almacena la URL pública en la tabla `photos`/`products` para evitar queries extra al storage.

---

## Patrones Establecidos

### Fetching de datos
```typescript
// Server Components: fetch directo desde Supabase
// NO usar useEffect para datos iniciales
// Usar Promise.all para evitar waterfalls
const [projects, brands] = await Promise.all([
  getProjects(),
  getBrands()
])
```

### Protección de rutas admin (Next.js 16)
```typescript
// src/proxy.ts — intercepta todas las rutas /admin/*
// Exporta proxy() y proxyConfig (no middleware/config)
// Redirige a /admin/login si no hay sesión activa
```

### Componentes cliente
```typescript
// 'use client' solo para:
// - Framer Motion animations
// - Formularios con estado
// - Upload de archivos (drag & drop)
// - Carrusel de logos
```

---

## Dependencias del Proyecto (versiones reales instaladas)

```json
{
  "dependencies": {
    "next": "16.2.6",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "framer-motion": "^11.x",
    "stripe": "^18.x",
    "@stripe/stripe-js": "^5.x",
    "@aws-sdk/client-s3": "^3.x",
    "@aws-sdk/s3-request-presigner": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x",
    "react-dropzone": "^14.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x"
  }
}
```

**Nota:** Tailwind v4 — sin `tailwind.config.js`. Toda la configuración de tema va en `globals.css` con directiva `@theme inline`.

---

## Próximos Pasos

**Infraestructura pendiente antes de deploy:**
1. ✅ Código completo — build limpio
2. ⏳ Ejecutar SQL migration en Supabase Dashboard
3. ⏳ Configurar CORS en R2 (imprescindible para uploads del navegador)
4. ⏳ Crear usuario admin en Supabase Authentication
5. ⏳ Deploy en Vercel con variables de entorno

## Guía de Pruebas Locales

### Prerequisitos para probar

**1. Ejecutar SQL migration** (una sola vez)
- Supabase Dashboard → SQL Editor → pegar contenido de `supabase/migrations/20260523000000_initial_schema.sql` → Run

**2. Crear usuario admin** (una sola vez)
- Supabase Dashboard → Authentication → Users → Add user
- Introduce email y contraseña → Create user
- Ese email/contraseña es el que uses en `/admin/login`

**3. Configurar CORS en R2** (solo necesario para subir archivos)
- Cloudflare Dashboard → R2 → `portafolio-bucket` → Settings → CORS
- Añadir regla:
  ```json
  [{"AllowedOrigins":["http://localhost:3000"],"AllowedMethods":["PUT","GET"],"AllowedHeaders":["*"]}]
  ```

### Iniciar el servidor

```bash
source ~/.nvm/nvm.sh && nvm use 23.6.1
cd /home/nuevo/iñakiPortafolios/portafolio
npm run dev
# → http://localhost:3000
```

### Rutas principales para probar

| Ruta | Qué probar |
|------|-----------|
| `http://localhost:3000` | Home: Hero + proyectos destacados + carrusel marcas |
| `http://localhost:3000/portfolio` | Grid masonry de proyectos |
| `http://localhost:3000/portfolio/[slug]` | Galería + lightbox (click foto → flechas + ESC) |
| `http://localhost:3000/shop` | Grid productos por categoría |
| `http://localhost:3000/admin/login` | Login admin — usa el usuario creado en Supabase |
| `http://localhost:3000/admin/projects` | Crear/editar/borrar proyectos, toggle destacado |
| `http://localhost:3000/admin/brands` | Subir logos a R2, gestionar marcas |
| `http://localhost:3000/admin/photos` | Seleccionar proyecto → drag & drop fotos → subir a R2 |

### Flujo de prueba recomendado

1. Ir a `/admin/login` → iniciar sesión
2. En `/admin/projects` → crear un proyecto, marcar como destacado
3. En `/admin/brands` → subir 2-3 logos (necesita CORS en R2)
4. En `/admin/photos` → seleccionar el proyecto → subir fotos
5. Ir a `/` → ver Hero, proyectos destacados, carrusel de logos
6. Ir a `/portfolio` → ver grid → clic en proyecto → galería → clic en foto → lightbox

---

## Notas de Diseño Visual

- **Paleta:** Fondo negro o blanco puro, tipografía neutra (sans-serif), acentos mínimos
- **Grid de proyectos:** Masonry o grid responsivo con aspect-ratio fijo por decisión del cliente
- **Transiciones:** Fade suave entre páginas con Framer Motion `AnimatePresence`
- **Carrusel de logos:** Loop infinito con Framer Motion, sin pausas abruptas
- **Hero:** Imagen/vídeo a pantalla completa con overlay mínimo de texto

---

## Historial de Sesiones

| Fecha | Descripción |
|-------|-------------|
| 2026-05-23 | Sesión 1 — Definición de arquitectura y requerimientos. Creación de CLAUDE.md y context.md. |
| 2026-05-23 | Sesión 2 — Fase 1 completada. Next.js 16 + todas las dependencias + 26 archivos creados + build limpio. |
| 2026-05-23 | Sesión 3 — Cambio a Cloudflare R2. SQL migration actualizado. `src/lib/r2.ts`, `next.config.ts`, tipos actualizados. |
| 2026-05-23 | Sesión 4 — Admin panel: Login funcional, gestor de proyectos completo (CRUD+toggle), gestor de marcas completo (upload R2). 16 rutas, build limpio. |
| 2026-05-23 | Sesión 5 — Gestor de fotos completo: drag & drop múltiple, upload paralelo a R2, selector de proyecto por query param, galería con delete. 15 rutas, build limpio. |
| 2026-05-23 | Sesión 6 — Home pública: Hero full-screen, FeaturedProjects grid, BrandsCarousel Framer Motion loop. Build limpio. |
| 2026-05-23 | Sesión 7 — Shop completo: ProductCard, BuyButton (Stripe Checkout), grid por categoría (camisetas/prints), info de envío. Build limpio. |
| 2026-05-23 | Sesión 8 — Portfolio completo: ProjectsGrid masonry, PhotoGallery + Lightbox (teclado, flechas, contador). Build limpio. |
| 2026-05-23 | Sesión 9 — Actualización docs: CLAUDE.md y context.md al estado real. Guía de pruebas locales añadida. |
