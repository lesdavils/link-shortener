<div align="center">

<br />

```
  _     _       _    ____  _                _   
 | |   (_)_ __ | | _/ ___|| |__   ___  _ __| |_ 
 | |   | | '_ \| |/ /\___ \| '_ \ / _ \| '__| __|
 | |___| | | | |   <  ___) | | | | (_) | |  | |_ 
 |_____|_|_| |_|_|\_\|____/|_| |_|\___/|_|   \__|
```

**URL shortener minimaliste avec analytics temps réel.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

</div>

---

## Présentation

LinkShort transforme vos URLs longues en liens courts partageables et enregistre chaque interaction — date, referrer, user-agent — dans un dashboard centralisé.

Pas de compte utilisateur, pas de tracking tiers. Votre base de données Supabase, vos données.

---

## Fonctionnalités

| | |
|---|---|
| **Raccourcissement instantané** | Générez un lien court en moins d'une seconde |
| **Slug personnalisé** | Choisissez votre propre identifiant `/mon-lien` |
| **Analytics par lien** | Clics, dates, referrers, user-agents |
| **Dashboard** | Vue d'ensemble de tous vos liens et statistiques |
| **Limite de liens** | Protection intégrée contre la surcharge (500 max) |
| **Redirection propre** | HTTP 302, aucun délai côté client |

---

## Stack

```
Next.js 16 (App Router)   →  Framework full-stack
TypeScript                →  Typage statique
Supabase                  →  Base de données PostgreSQL + API
Tailwind CSS v4           →  Styles utilitaires
Framer Motion             →  Animations
```

---

## Installation

### Prérequis

- Node.js 18+
- Un projet [Supabase](https://supabase.com) (plan gratuit suffisant)

### 1. Cloner le projet

```bash
git clone https://github.com/lesdavils/link-shortener.git
cd link-shortener
npm install
```

### 2. Créer les tables Supabase

Dans **SQL Editor** de votre projet Supabase, exécutez :

```sql
create table links (
  id uuid primary key default gen_random_uuid(),
  original_url text not null,
  short_code text not null unique,
  created_at timestamptz default now()
);

create table clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references links(id) on delete cascade,
  clicked_at timestamptz default now(),
  user_agent text,
  referrer text
);

-- Politiques RLS (accès public)
alter table links enable row level security;
alter table clicks enable row level security;

create policy "allow all" on links for all using (true) with check (true);
create policy "allow all" on clicks for all using (true) with check (true);
```

### 3. Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Ces valeurs se trouvent dans **Supabase → Settings → API**.

### 4. Lancer

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Structure du projet

```
link-shortener/
├── app/
│   ├── [code]/
│   │   └── route.ts        # Redirection + tracking du clic
│   ├── api/shorten/
│   │   └── route.ts        # API de création de lien
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard analytics
│   └── page.tsx            # Landing page
├── lib/
│   └── supabase.ts         # Client Supabase
└── .env.local              # Variables d'environnement (non commité)
```

---

## Déploiement

Le plus simple est de déployer sur [Vercel](https://vercel.com) :

1. Importez le repo GitHub sur Vercel
2. Ajoutez les variables d'environnement Supabase dans les settings
3. Deploy

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.
