# ============================
# Stage 1: base (deps)
# ============================
FROM node:20-slim AS base
WORKDIR /app

# Copiamos SOLO manifests para cache fino
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/

# Instala dependencias de todos los workspaces con lockfile
RUN npm ci --workspaces --legacy-peer-deps


# ============================
# Stage 2: build (src + prisma + tsc + web)
# ============================
FROM base AS build
WORKDIR /app

# Ahora sí copiamos el código fuente
COPY apps/ apps/
COPY packages/ packages/

# Generar Prisma Client ANTES de compilar TS (lo escribe en /app/node_modules/.prisma)
WORKDIR /app/apps/api
RUN npx prisma generate

# Compilar contratos y API
WORKDIR /app
RUN npx tsc -b packages/contracts apps/api

# (Opcional) build del frontend
WORKDIR /app/apps/web
RUN npm run build || true


# ============================
# Stage 3: runtime API
# ============================
FROM node:20-slim AS api-prod
WORKDIR /app
ENV NODE_ENV=production

# Copiamos node_modules desde BUILD (ya trae .prisma y cliente generado)
COPY --from=build /app/node_modules ./node_modules

# Copiamos artefactos compilados de la API
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

EXPOSE 3001
WORKDIR /app/apps/api
CMD ["node", "dist/index.js"]


# ============================
# Stage 4: runtime WEB (opcional)
# ============================
FROM node:20-slim AS web-prod
WORKDIR /app
ENV NODE_ENV=production

# Copiamos el build estático de Vite
COPY --from=build /app/apps/web/dist ./dist

# Server estático simple (podés cambiar a nginx si querés)
RUN npm i -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
