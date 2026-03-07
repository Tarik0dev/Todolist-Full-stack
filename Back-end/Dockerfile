FROM node:22-alpine3.23

WORKDIR /app

# On copie la liste des dépendances

COPY package*.json ./

# On installe (Docker mettra cette étape en cache tant que package.json ne change pas)

RUN npm install

COPY . .
# ENSUITE, on copie le code source qui changera souvent en mode dév
EXPOSE 3000

CMD ["node", "index.js"]