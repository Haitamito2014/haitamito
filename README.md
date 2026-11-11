# Northfare

Site vitrine et identité visuelle de **Northfare**, société de technologie du voyage (Travel Tech) au Maroc.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Site web (français / anglais, bouton FR·EN) |
| `brand.html` | Charte graphique : logo, couleurs, typographie |
| `assets/css/style.css` | Styles du site |
| `assets/js/main.js` | Traductions anglaises, menu mobile, formulaire |
| `assets/logo/*.svg` | Logos vectoriels (principal, blanc, empilé, icône, monochrome, logotype) |
| `assets/logo/png/` | Logos en PNG haute résolution, fond transparent |
| `favicon.svg` | Icône d'onglet |

## Voir le site

Ouvrir `index.html` dans un navigateur. Aucune installation n'est nécessaire.

Pour le mettre en ligne, il suffit d'héberger ces fichiers statiques : GitHub Pages, Netlify, Vercel ou n'importe quel hébergeur.

## À remplacer avant la mise en ligne

Les coordonnées sont **fictives** :

- E-mail `contact@northfare.ma` : dans `index.html` et dans la constante `CONTACT_EMAIL` de `assets/js/main.js`
- Téléphone `+212 5 00 00 00 00` et adresse `Casablanca, Maroc` : dans `index.html`
- Les prix de la maquette du hero sont volontairement affichés `— MAD`

Le formulaire de contact n'a pas de serveur : il ouvre la messagerie du visiteur avec un e-mail pré-rempli. On peut le brancher plus tard sur un service comme Formspree ou un CRM.

## Modifier les textes

- Français : directement dans `index.html`
- Anglais : dans l'objet `EN` de `assets/js/main.js`, avec la même clé que l'attribut `data-i18n` du texte français
