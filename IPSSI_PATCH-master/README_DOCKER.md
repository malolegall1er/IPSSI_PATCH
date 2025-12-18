# IPSSI_PATCH — Version refactorisée (SoC + Prisma + Docker)

## Objectifs couverts
- **Docker** : frontend + backend + serveur SQL (PostgreSQL) conteneurisés via `docker-compose`
- **Séparation des couches** : `routes/` → `controllers/` → `services/`
- **Sécurité**
  - Suppression des endpoints qui exécutaient du SQL fourni par le client (SQLi)
  - **Prisma ORM** (requêtes paramétrées) + validation d'entrées
  - **bcrypt** pour le hash des mots de passe lors de la création d'un user
  - Headers de sécurité (backend: `helmet`, frontend nginx: CSP + nosniff…)

## Lancer avec Docker
```bash
docker-compose --env-file .env up --build
```

- Frontend : http://localhost:3000
- Backend (debug local) : http://127.0.0.1:8000/health

> L'API est aussi accessible via le frontend en **reverse proxy** : `/api/*`  
> Exemple : http://localhost:3000/api/users

## Endpoints API
- `GET /health`
- `GET /users`
- `GET /users/:id`
- `POST /users` → `{ "name": "...", "password": "..." }`
- `GET /comments`
- `POST /comments` → `{ "content": "..." }`

## Structure backend (SoC)
```
backend/src
  routes/
  controllers/
  services/
  prisma/
```

## Note sur la "connexion sécurisée SQL"
Dans ce setup :
- la base **n'est pas exposée** sur le host (pas de `ports:` sur `db`)
- le réseau DB est **interne** (`backend_net: internal: true`)
- identifiants via `.env`

Pour aller plus loin (TLS Postgres), il faut ajouter une configuration SSL côté Postgres + paramètres SSL côté client.
