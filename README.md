# Bajo Cauca Conecta — Starter (Next.js + Tailwind)

Starter listo para desplegar un **marketplace local** con filtros por municipio y categoría, buscador, paginación, SEO básico, `sitemap.xml` y `robots.txt`.

## Prueba en local

```
bash
npm install
npm run dev
# http://localhost:3000
```

## Estructura

app/
  contacto/page.tsx
  layout.tsx
  page.tsx                  # Home
  listings/
    page.tsx                # Listado con filtros (cliente)
    [id]/page.tsx           # Detalle
  robots.ts
  sitemap.ts
components/
  FilterBar.tsx
  ListingCard.tsx
  Pagination.tsx
data/
  items.ts                  # 20 ítems de ejemplo
styles/
  globals.css
next.config.mjs
tailwind.config.js
postcss.config.js
tsconfig.json
package.json

## Variables de entorno

- NEXT_PUBLIC_SITE_URL — define la URL pública para el sitemap/robots (ej: https://tudominio.com).

## Despliegue en Vercel

1. Sube este repo a GitHub (nuevo repositorio).
2. Entra a https://vercel.com, Import Project → elige tu repo.
3. Acepta los defaults. (Framework detectado: Next.js)
4. Opcional: en Environment Variables añade NEXT_PUBLIC_SITE_URL.
5. Pulsa Deploy y comparte la URL pública.

## Personaliza rápido

- Cambia colores en tailwind.config.js y estilos en styles/globals.css.
- Edita el hero de la portada en app/page.tsx.
- Ajusta ítems en data/items.ts o conecta tu API.
