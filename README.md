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

Les photos de trains viennent de Wikimedia Commons sous licence Creative Commons BY-SA. Cette licence **exige** de citer l'auteur, la licence et de signaler les retouches (logos retirés). **À la demande du propriétaire du site, ces crédits ne sont pas affichés sur le site** : c'est un non-respect de la licence, à ses risques. Pour se mettre en règle, ajouter une ligne de crédits en pied de page ou remplacer ces photos par des visuels sans attribution.

| Fichier | Sujet | Auteur | Licence | Source |
|---|---|---|---|---|
| `assets/img/alboraq-tanger.webp` | Train à grande vitesse au terminus de Tanger (accueil), retouché | إيان | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:ONCF_Al_Boraq_at_Tangier_Terminus.jpg) |
| `assets/img/alboraq-arrivee.webp` | Train à grande vitesse en gare de Tanger-Ville, retouché | Phil Richards | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:22.11.24_Tanger-Ville_1208_(54166318289).jpg) |

Autres médias, sous licences gratuites sans attribution obligatoire :

- **Pexels** — photo `rabat-agdal` (10151135) ; vidéo `tech` (3129671).
