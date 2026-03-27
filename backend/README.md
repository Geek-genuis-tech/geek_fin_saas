geek-fin-backend/
├── src/
│   ├── config/                 # Config globale (env, db, etc.)
│   │   ├── db.ts
│   │   └── env.ts
│
│   ├── modules/                # Architecture par domaine métier
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.model.ts
│   │   │
│   │   ├── users/
│   │   ├── budget/
│   │   ├── caisse/
│   │   ├── facturation/
│   │   ├── operations/
│   │   ├── analyse/
│   │   └── rh/
│
│   ├── middlewares/            # Middlewares globaux
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│
│   ├── utils/                  # Fonctions utilitaires
│   │   ├── logger.ts
│   │   └── helpers.ts
│
│   ├── types/                  # Types globaux TS
│   │   └── index.ts
│
│   ├── routes.ts               # Regroupement de toutes les routes
│   ├── app.ts                  # Config Express
│   └── server.ts               # Point d’entrée
│
├── prisma/ OR database/        # ORM (Prisma recommandé)
│   └── schema.prisma
│
├── .env
├── package.json
└── tsconfig.json