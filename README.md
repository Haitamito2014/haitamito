# Northfare

Site vitrine et identité visuelle de **Northfare**, société de technologie du voyage (Travel Tech) au Maroc.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Site web (français / anglais, bouton FR·EN) |
| `brand.html` | Charte graphique : logo, couleurs, typographie |
| `assets/css/style.css` | Styles du site (thème sombre cinématique) |
| `assets/js/main.js` | Traductions anglaises, animations, menu mobile, formulaire |
| `assets/js/vendor/` | GSAP 3.12.5 + ScrollTrigger (animations au défilement), hébergés en local |
| `assets/media/` | Vidéos de fond (MP4 sans son, 1280 px) et leurs images d'attente |
| `assets/img/` | Photos (WebP) |
| `assets/logo/*.svg` | Logos vectoriels (principal, blanc, empilé, icône, monochrome, logotype) |
| `assets/logo/png/` | Logos en PNG haute résolution, fond transparent |
| `favicon.svg` | Icône d'onglet |

## Voir le site

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur local :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Pour le mettre en ligne, il suffit d'héberger ces fichiers statiques : GitHub Pages, Netlify, Vercel ou n'importe quel hébergeur.

## À remplacer avant la mise en ligne

Les coordonnées sont **fictives** :

- E-mail `contact@northfare.ma` : dans `index.html` et dans la constante `CONTACT_EMAIL` de `assets/js/main.js`
- Téléphone `+212 5 00 00 00 00` et adresse `Casablanca, Maroc` : dans `index.html`

Le formulaire de contact n'a pas de serveur : il ouvre la messagerie du visiteur avec un e-mail pré-rempli. On peut le brancher plus tard sur un service comme Formspree ou un CRM.

## Modifier les textes

- Français : directement dans `index.html`
- Anglais : dans l'objet `EN` de `assets/js/main.js`, avec la même clé que l'attribut `data-i18n` du texte français

## Crédits des médias

Toutes les photos et vidéos proviennent de banques gratuites dont la licence autorise l'usage commercial sans attribution obligatoire :

- **Vidéos** : Pexels (licence Pexels) — identifiants 2099568 (accueil), 3015510 (méthode), 3129671 (solutions), 3571264 (pourquoi Northfare). Page d'origine : `https://www.pexels.com/video/<identifiant>/`
- **Photos** : Unsplash (licence Unsplash) — `marrakech`, `kasbah`, `airport`, `wing`, `team`, `office`, `laptop`, `hiker`, `takeoff`. L'identifiant de chaque photo figure dans l'URL d'origine `https://unsplash.com/photos/<identifiant>` ; les identifiants complets sont listés dans l'historique du dépôt.

GSAP est utilisé sous sa licence standard gratuite (gsap.com/standard-license), qui couvre les sites commerciaux.
