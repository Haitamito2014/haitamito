# Northfare

Site vitrine et identité visuelle de **Northfare**, société de technologie du voyage (Travel Tech) au Maroc : plateforme groupes & corporate pour les transporteurs, les agences et les entreprises.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Site web (français / anglais, bouton FR·EN) |
| `brand.html` | Charte graphique : logo, couleurs, typographie |
| `assets/css/style.css` | Styles du site (thème sombre « technique » : monospace, grilles fines, angles droits) |
| `assets/js/main.js` | Traductions anglaises, menu mobile, animation terminal, étapes animées, formulaire |
| `assets/img/` | Photos (WebP) |
| `assets/media/` | Vidéo de la section API et son image d'attente |
| `assets/logo/` | Logos vectoriels (SVG) et PNG haute résolution |
| `favicon.svg` | Icône d'onglet |
| `nsm/` | **NSM Messenger** : messagerie avec comptes utilisateurs (voir `nsm/README.md` pour la mise en service Firebase) |

Typographies : IBM Plex Mono (étiquettes, navigation) et Inter (textes), via Google Fonts.

## Voir le site

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Pour le mettre en ligne : héberger ces fichiers statiques (GitHub Pages, Netlify, Vercel, Cloudflare Pages…).

## À vérifier avant la mise en ligne

- L'adresse `contact@northfaretech.com` (dans `index.html` et `CONTACT_EMAIL` de `assets/js/main.js`) doit exister dans Microsoft 365, par exemple en boîte aux lettres partagée.
- Aucune adresse postale ni téléphone n'est affiché : à ajouter quand l'adresse du siège est connue.
- Le formulaire de contact n'a pas de serveur : il ouvre la messagerie du visiteur avec un e-mail pré-rempli.

## Modifier les textes

- Français : directement dans `index.html`
- Anglais : dans l'objet `EN` de `assets/js/main.js`, avec la même clé que l'attribut `data-i18n`

## Crédits des médias

Tous les visuels sont neutres : aucune compagnie, aucun logo, aucun opérateur reconnaissable. Ils viennent de banques d'images dont la licence autorise l'usage commercial **sans attribution obligatoire** :

| Fichier | Sujet | Source |
|---|---|---|
| `assets/media/train-window.mp4` | Paysage vu depuis la fenêtre d'un train (accueil) | Pexels, vidéo 3044098 |
| `assets/media/tech.mp4` | Réseau abstrait (section API) | Pexels, vidéo 3129671 |
| `assets/img/hublot.webp` | Aile d'avion vue d'un hublot (section Corporate) | Unsplash, photo 1488085061387-422e29b40080 |
| `assets/img/aile-nuages.webp` | Aile d'avion au-dessus des nuages (fond Contact) | Unsplash, photo 1517479149777-5f3b1511d5ad |
