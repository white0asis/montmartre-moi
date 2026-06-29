# Guide — Comment me transmettre du contenu

Un seul principe : tu m'écris un bloc de texte simple (genre "fiche"), avec une ligne `Champ : valeur` par information, et tu attaches les photos dans le même message. Je m'occupe de tout transformer et publier dans Sanity.

Pas besoin de connaître les noms techniques des champs, juste suivre les modèles ci-dessous. Les champs marqués **(obligatoire)** sont le minimum pour publier ; les autres améliorent la fiche mais peuvent être ajoutés plus tard.

Convention pour le texte long (description, corps d'article) :
- une ligne vide = nouveau paragraphe
- `## Titre` = sous-titre
- `- texte` = liste à puces
- `> texte` = citation
- pour une liste courte (tags, horaires, ambiance...) : un élément par ligne précédé d'un tiret, ou séparés par `;`

Pour les photos : attache-les au message et donne-leur un nom clair (`facade.jpg`, `interieur-1.jpg`...) ; référence ce nom dans la fiche. Pour la galerie, donne l'ordre souhaité.

---

## 1. Article

```
TYPE : Article
Titre :                         (obligatoire)
Catégorie :                     (obligatoire — nom d'une catégorie existante, ou nom de la nouvelle si elle n'existe pas encore)
Image principale :              (obligatoire — nom du fichier joint)
Résumé (1-2 phrases, ~160 car.) : (recommandé — sinon j'en génère un à partir du corps)
Auteur :                        (optionnel — par défaut j'utilise l'auteur déjà créé)
Tags :                          (optionnel — ex: street-art, histoire, gratuit)
Mis en avant sur l'accueil :    oui / non (optionnel, défaut non)
Date de publication :           (optionnel — défaut aujourd'hui)
Meta description SEO :          (optionnel — sinon je reprends le résumé)
---
[corps de l'article ici, en paragraphes, avec ## pour les sous-titres
et ![légende](nom-image.jpg) à l'endroit où une image du corps doit apparaître]
```

**Exemple rempli :**

```
TYPE : Article
Titre : Le Mur des Je t'aime, le coin le plus photographié de Montmartre
Catégorie : Street art
Image principale : mur-je-taime-facade.jpg
Résumé : Un mur de 40 m² où "je t'aime" est écrit en 250 langues, en plein cœur du Square Jehan-Rictus.
Tags : street-art, gratuit, romantique
Mis en avant sur l'accueil : oui
---
Niché dans le square Jehan-Rictus, juste derrière la place des Abbesses, le Mur des Je t'aime
passe souvent inaperçu des touristes qui filent vers le Sacré-Cœur.

## Une œuvre collective

Créée en 2000 par Frédéric Baron et Claire Kito, l'œuvre rassemble "je t'aime" écrit en 250
langues sur des plaques de lave émaillée bleues, éclatées de taches rouges.

![Le mur vu depuis l'entrée du square](mur-je-taime-vue-large.jpg)

> "On vient y chercher sa langue, comme un jeu."

- Accès libre, toute la journée
- Idéal en fin d'après-midi, lumière rasante sur le bleu
```

---

## 2. Lieu (musée, monument, parc, point de vue, street art à grande échelle...)

```
TYPE : Lieu
Nom :                       (obligatoire)
Type :                      (obligatoire — museum / monument / park / viewpoint / street-art)
Adresse :                   (obligatoire)
Coordonnées GPS :           (recommandé — lat, lng. Sur Google Maps : clic droit sur le point exact → les coordonnées sont en haut du menu)
Description :               (obligatoire — paragraphes)
Tagline (1 phrase d'accroche) :  (recommandé)
Ce qu'on aime (jusqu'à 4) :  emoji / titre / texte court — un par ligne (recommandé)
Note Google :                ex: 4.4 (optionnel)
Nombre d'avis Google :        ex: 3200 (optionnel)
Coup de cœur Montmartre Moi : oui / non (optionnel)
Horaires :                   soit un texte simple ("Tous les jours 9h-19h"), soit le détail jour par jour (recommandé)
Tarifs :                     une ligne par tarif, ex: "Adultes 15€" / "Gratuit -18 ans" (recommandé)
Pour y aller :                une ligne par info, ex: "Métro Abbesses (ligne 12)" / "8 min à pied du Sacré-Cœur" (recommandé)
Site officiel :               (optionnel)
Lien réservation/billetterie : (optionnel)
Astuce d'initié :             1-2 phrases (recommandé)
Légende courte (pour les cartes "à proximité") : ex: "Le dernier vignoble de Paris" (recommandé)
Légende sous la carte :        ex: "12 Rue Cortot · Métro Lamarck-Caulaincourt · 8 min du Sacré-Cœur" (optionnel)
Galerie photo :                liste des fichiers joints, dans l'ordre souhaité (recommandé)
```

**Exemple rempli :**

```
TYPE : Lieu
Nom : Musée de Montmartre
Type : museum
Adresse : 12 Rue Cortot, 75018 Paris
Coordonnées GPS : 48.8875, 2.3402
Tagline : La plus ancienne maison de Montmartre, où vécurent Renoir et Utrillo.
Ce qu'on aime :
🎨 / Un vrai jardin / Le jardin Renoir, calme absolu à deux pas du Sacré-Cœur
🖼️ / Collection permanente / Affiches originales du Chat Noir et du Moulin Rouge
Note Google : 4.4
Nombre d'avis Google : 3200
Coup de cœur Montmartre Moi : oui
Horaires : Tous les jours 10h-18h, dernier accès 17h15
Tarifs :
Adultes 15€
Réduit 9.50€
Gratuit -10 ans
Pour y aller :
Métro Lamarck-Caulaincourt (ligne 12)
8 min à pied du Sacré-Cœur
Site officiel : https://museedemontmartre.fr
Astuce d'initié : Viens en semaine à l'ouverture, le jardin est désert avant 11h.
Légende courte : La maison où vécurent Renoir et Utrillo
Galerie photo : musee-facade.jpg, musee-jardin.jpg, musee-interieur.jpg
Description :
Caché derrière une façade discrète de la rue Cortot, le Musée de Montmartre occupe la plus
ancienne maison du quartier, construite au XVIIe siècle.

Renoir y a eu son atelier, Utrillo y a vécu avec sa mère Suzanne Valadon.
```

---

## 3. Restaurant

```
TYPE : Restaurant
Nom :                  (obligatoire)
Adresse :               (obligatoire)
Coordonnées GPS :       (recommandé)
Type de cuisine :       ex: Bistrot français, Italien... (obligatoire)
Gamme de prix :         € / €€ / €€€ (obligatoire)
Description :           paragraphes (obligatoire)
Tagline courte (cartes "à proximité") : (recommandé)
Horaires :               texte simple, ex: "Mar-Dim 12h-14h30, 19h-22h30, fermé le lundi" (recommandé)
Services :                déjeuner / dîner (l'un, l'autre ou les deux) (optionnel)
Budget moyen par personne : en euros, ex: 35 (optionnel)
Réservation :             obligatoire / recommandée / pas nécessaire (optionnel)
Ambiance :                 mots-clés, ex: romantique, terrasse, vue (optionnel)
À ne pas manquer :         le plat signature (optionnel)
Lien réservation :         TheFork, site... (optionnel)
Astuce d'initié :          (recommandé)
Galerie photo :            liste des fichiers joints, dans l'ordre (recommandé)
```

**Exemple rempli :**

```
TYPE : Restaurant
Nom : Le Relais Gascon
Adresse : 6 Rue des Abbesses, 75018 Paris
Type de cuisine : Bistrot du Sud-Ouest
Gamme de prix : €€
Tagline courte : Salades géantes et confit de canard, à deux pas de la place des Abbesses
Horaires : Tous les jours 12h-00h
Services : déjeuner; dîner
Budget moyen par personne : 28
Réservation : recommandée
Ambiance : convivial; terrasse; populaire
À ne pas manquer : La salade gésiers-magret-foie gras
Astuce d'initié : Demande une table en terrasse côté place, vue parfaite sur le passage des Abbesses.
Galerie photo : relais-gascon-salle.jpg, relais-gascon-salade.jpg
Description :
Une institution du quartier depuis les années 90, connue pour ses salades composées servies
dans des assiettes géantes.

L'ambiance est animée, surtout le soir — pense à réserver le week-end.
```

---

## 4. Catégorie (pour ranger les articles)

```
TYPE : Catégorie
Nom :                  (obligatoire)
Description courte :    1 phrase, affichée sur la page catégorie (recommandé)
Intro éditoriale :       3-4 phrases — si tu ne la donnes pas, je peux la rédiger (optionnel)
```

**Exemple :**

```
TYPE : Catégorie
Nom : Street art
Description courte : Les murs, fresques et œuvres urbaines qui font la réputation de la Butte.
```

---

## 5. Page statique (About, Contact...)

```
TYPE : Page statique
Titre :     (obligatoire)
---
[texte de la page, mêmes règles que pour le corps d'article]
```

---

## 6. Auteur (à ne faire qu'une fois, ou pour ajouter un nouveau rédacteur)

```
TYPE : Auteur
Nom :        (obligatoire)
Photo :      nom du fichier joint (optionnel)
Bio courte : 1-2 phrases (optionnel)
Réseaux :    plateforme + lien, un par ligne (optionnel)
```

---

## Pour aller vite

- Tu peux m'envoyer plusieurs fiches dans le même message (une après l'autre, séparées par `---`).
- Si un champ "obligatoire" manque, je te le redemande avant de publier — tout le reste, je publie avec ce que tu as donné et tu complètes plus tard si besoin.
- Une fois la fiche envoyée, je te montre un aperçu avant de publier en ligne (rien n'est visible publiquement sans ta validation).
