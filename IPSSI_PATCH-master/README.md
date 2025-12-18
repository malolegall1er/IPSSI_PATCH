# IPSSI_PATCH — Déploiement Docker + Refactor (SoC) + Sécurisation

Ce dépôt correspond à une version **refactorisée et sécurisée** du projet :
- **Frontend** : React (build) servi par **nginx**
- **Backend** : Node/Express (API REST)
- **Base de données SQL** : **PostgreSQL** (conteneur)

## Objectifs couverts (consignes)
- **Docker** : tous les services sont conteneurisés via `docker-compose`
- **Séparation des couches (SoC)** : `routes/` → `controllers/` → `services/`
- **Sécurisation**
  - Suppression des endpoints qui exécutaient du SQL fourni par le client (mitigation SQLi)
  - **Prisma ORM** (requêtes paramétrées) + validation d’entrées côté API
  - **bcrypt** : hash des mots de passe lors de la création d’un user
  - Hardening API : `helmet`, limitation taille body, rate limiting
  - Front : nginx sert la SPA + proxy **/api** → backend (pas de CORS côté navigateur)

---

## Prérequis
- Docker Engine
- `docker-compose` (standalone) **ou** Docker Compose v2 (`docker compose`)

---

## Démarrage rapide

### 1) Lancer
À la racine (là où se trouvent `docker-compose.yml` et `.env`) :

```bash
docker-compose --env-file .env up --build
```

### 2) Accès
- Frontend : http://localhost:3000
- API (via nginx) : http://localhost:3000/api/health

> La base PostgreSQL n’est **pas exposée** au host (réseau interne), uniquement accessible depuis le backend.

### 3) Initialiser des données de démo (seed)
Le backend crée le schéma automatiquement au démarrage (`prisma db push`).
Pour insérer des données de test :

```bash
docker exec -it ipssi_patch-backend-1 node src/seed-run.js
```

---

## Endpoints API

- `GET /health`
- `GET /users` → liste (id, name)
- `GET /users/:id` → détail (id, name)
- `POST /users` → crée un user (hash du password)  
  Body JSON : `{ "name": "Alice", "password": "password123" }`
- `GET /comments`
- `POST /comments` → crée un commentaire  
  Body JSON : `{ "content": "Bonjour" }`

> Les routes sont consommées par le frontend via **`/api/...`** (proxy nginx).  
> Exemple : `GET http://localhost:3000/api/users`

---

## Architecture backend (SoC)

```
backend/src/
  routes/        # mapping HTTP -> contrôleurs
  controllers/   # validation + gestion HTTP
  services/      # logique métier + accès DB via Prisma
  prisma/        # client Prisma
```

### Pourquoi Prisma + services ?
- Prisma utilise des requêtes paramétrées : évite la concaténation SQL côté API.
- Les services encapsulent l’accès DB (testable, lisible, maintenable).

---

## Sécurité : points clés

### 1) SQLi (injection SQL)
- **Supprimé** : plus de “POST /user” qui exécute du SQL envoyé par le client.
- Remplacé par des endpoints métiers (`/users/:id`, `/comments`, etc.).

### 2) Mots de passe
- Les mots de passe ne sont **jamais stockés en clair** : `bcrypt.hash(...)`.
- L’API ne renvoie pas le champ `password` (sélection Prisma limitée).

### 3) XSS (commentaires)
- Le frontend affiche les commentaires en **texte** (React échappe par défaut).
- Ne pas utiliser `dangerouslySetInnerHTML` pour afficher du contenu utilisateur.

### 4) Réseau / DB
- DB sur réseau `backend_net` **interne** (non accessible depuis l’extérieur).
- Accès DB uniquement via le backend.

---

## Commandes utiles

### Voir les conteneurs
```bash
docker ps
```

### Stopper
```bash
docker-compose down
```

### Reset complet (supprime la DB)
```bash
docker-compose down -v
```

### Logs backend
```bash
docker logs -f ipssi_patch-backend-1
```

---

## Dépannage

### “port already allocated”
Change `FRONTEND_PORT` / `BACKEND_PORT` dans `.env` puis relance.

### La DB est vide / pas de users
Lance le seed :
```bash
docker exec -it ipssi_patch-backend-1 node src/seed-run.js
```

---

## Notes
- Pour une “connexion SQL sécurisée” **chiffrée (TLS)** côté Postgres, on peut ajouter des certificats et activer `ssl=on`.
  (Non activé par défaut pour garder un démarrage simple en environnement de TP.)
