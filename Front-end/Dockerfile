
# ÉTAPE 1 : Compiler Angular
# ════════════════════════════════════════
FROM node:20-slim AS build
# Node 20 car ton projet Angular 20 nécessite Node 20.9+
# node:20-slim prendra la dernière version de Node 20
# donc supérieure à 20.9 ✅

WORKDIR /app

# Ce qui change rarement → mis en cache par Docker
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Le code source Angular
COPY . .

# Compilation Angular → génère dist/Front-end/browser/
RUN npm run build

# ════════════════════════════════════════
# ÉTAPE 2 : Servir avec Nginx
# ════════════════════════════════════════
FROM nginx:alpine
# Nginx ultra léger ~25Mo
# Node.js abandonné, on n'en a plus besoin

# On récupère UNIQUEMENT les fichiers compilés
# depuis l'étape 1
COPY --from=build /app/dist/Front-end/browser /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf
#                              ↑
#                    Le nom exact confirmé
#                    par ton dir dist\Front-end

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]