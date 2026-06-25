# Phase 0 — Fondations techniques : étapes restantes

Le scaffold Next.js 15 (design system inclus) est déjà dans ce dossier. Voici les étapes à faire de ton côté (comptes/connecteurs que je ne peux pas créer depuis le sandbox).

## 1. GitHub

Dans un terminal, à la racine de ce dossier :

```bash
git init
git add -A
git commit -m "Initial scaffold: Next.js 15 + design system"
```

Si `git init` se plaint d'un dossier `.git` déjà présent ou corrompu, supprime-le (`rmdir /s .git` sous Windows ou via l'explorateur en activant les fichiers cachés) puis relance les 3 commandes.

Puis sur github.com : crée un repo vide "montmartre-moi" (sans README/gitignore), et :

```bash
git remote add origin https://github.com/<ton-user>/montmartre-moi.git
git branch -M main
git push -u origin main
```

Vérifie ensuite que tout compile chez toi :

```bash
npm install
npm run dev
```

## 2. Vercel

Pas d'API de création directe disponible — passe par le dashboard :
1. vercel.com → équipe **white0asis-projects** → Add New → Project
2. Importe le repo GitHub `montmartre-moi`
3. Next.js est auto-détecté (build command `next build` déjà configuré)
4. Ajoute les variables d'environnement (section 3 et 4 ci-dessous) **avant** le premier déploiement
5. Deploy

## 3. Sanity

Le connecteur Sanity apparaît connecté mais ses outils ne sont pas exposés dans cette session — création manuelle :
1. sanity.io/manage → Create new project → nom "Montmartre Moi", plan Free
2. Dataset : `production`
3. Note le **Project ID** et le **Dataset name**
4. Ajoute dans `.env.local` (local) et dans Vercel (env vars) :
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET=production`

## 4. Algolia

1. algolia.com → Sign up (free tier "Build", sans CB)
2. Create Application → Create Index (ex: `montmartre_moi_articles`)
3. Note **Application ID**, **Search-Only API Key** (publique), **Admin API Key** (privée, jamais côté client)
4. Variables d'env : `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`, `ALGOLIA_ADMIN_KEY`

## 5. Google Analytics 4

1. analytics.google.com → Créer un compte → Propriété "Montmartre Moi"
2. Flux de données Web → URL = domaine Vercel du projet
3. Note le **Measurement ID** (`G-XXXXXXX`)
4. Variable d'env : `NEXT_PUBLIC_GA_ID`

---

Une fois ces 5 étapes faites, la Phase 0 est complète et on peut attaquer la Phase 1 (Design).
