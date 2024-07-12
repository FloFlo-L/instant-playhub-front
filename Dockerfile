# Utiliser une image Node de base pour la construction
FROM node:20 as build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . ./

# Construire l'application pour la production
RUN npm run build

# Utiliser une image Node pour servir l'application
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de build générés par React
COPY --from=build /app/dist ./dist

# Installer un serveur HTTP pour servir les fichiers
RUN npm install -g serve

# Commande pour exécuter le serveur
CMD ["serve", "-s", "dist"]

# Exposer le port sur lequel le serveur s'exécute
EXPOSE 5000
