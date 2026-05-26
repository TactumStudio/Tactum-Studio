# 📸 Portfolio Fotográfico & Tienda Online

Un portfolio web minimalista y moderno diseñado para fotógrafos y creadores audiovisuales. Construido con una arquitectura robusta que pone el foco en el contenido visual, incluye un panel de administración personalizado para una gestión total y una tienda integrada para venta de prints y merchandising.

## 🚀 Tecnologías

* **Frontend:** Next.js 14 (App Router), React, TypeScript.
* **Estilos & Animaciones:** Tailwind CSS, Framer Motion, Lucide Icons.
* **Base de Datos & Autenticación:** Supabase (PostgreSQL, Supabase Auth).
* **Almacenamiento de Imágenes:** Cloudflare R2 (Buckets S3-compatible).
* **Pagos & E-commerce:** Stripe Checkout.
* **Despliegue:** Vercel.

---

## ✨ Características Principales

### 🌍 Web Pública
* **Diseño Minimalista:** Estilo "agencia", limpio y fluido.
* **Home Page:** Hero impactante, galería de "Proyectos Destacados" y footer dinámico con marcas/clientes.
* **Portfolio Mixto:** Cuadrícula tipo *masonry* donde convergen todos los proyectos sin subcategorías rígidas. Vistas en detalle de alta calidad.
* **Tienda Online:** Integración fluida con enlaces de pago de Stripe para la venta de prints y camisetas.

### 🔒 Panel de Administración (Privado)
* **Acceso Seguro:** Ruta `/admin` protegida mediante middleware y Supabase Auth.
* **Gestor de Proyectos:** CRUD completo. Opción de marcar proyectos como "Destacados" para la Home.
* **Gestor de Fotos:** Subida intuitiva (drag & drop) directamente a Cloudflare R2.
* **Gestor de Marcas:** Control dinámico de los logos de empresas que aparecen en el footer de la web.

---

## 🛠️ Instalación y Configuración Local

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone [https://github.com/tu-usuario/tu-repo.git](https://github.com/tu-usuario/tu-repo.git)
cd tu-repo
npm install
