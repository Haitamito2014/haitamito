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

Les photos de trains viennent de Wikimedia Commons sous licence Creative Commons BY-SA : **l'attribution (auteur + licence) est obligatoire** et figure dans le pied de page du site. Ne pas la retirer. Les logos des compagnies ont été **retirés par retouche** ; la licence exige d'indiquer cette modification, ce que fait le pied de page.

| Fichier | Sujet | Auteur | Licence | Source |
|---|---|---|---|---|
| `assets/img/alboraq-tanger.webp` | Train à grande vitesse au terminus de Tanger (accueil), retouché | إيان | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:ONCF_Al_Boraq_at_Tangier_Terminus.jpg) |
| `assets/img/alboraq-arrivee.webp` | Train à grande vitesse en gare de Tanger-Ville, retouché | Phil Richards | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:22.11.24_Tanger-Ville_1208_(54166318289).jpg) |
| `assets/img/oncf-train.webp` | Locomotive E-1474 à Tanger-Ville, retouchée | Phil Richards | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:25.11.24_Tanger_Ville_E-1474_(54166482504).jpg) |
| `assets/img/gare-kenitra.webp` | Gare TGV de Kénitra (non utilisée pour l'instant) | Bertrand Soubeyrand | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Gare_TGV_Kenitra.jpg) |

Les autres médias viennent de banques gratuites dont la licence autorise l'usage commercial sans attribution :

- **Pexels** (licence Pexels) — photos `rabat-agdal` (10151135), `autocar` (3608967) ; vidéos 3044098 (vue depuis le train), 3129671 (réseau, solutions). Page d'origine : `https://www.pexels.com/photo/<id>/` ou `/video/<id>/`
- **Unsplash** (licence Unsplash) — `marrakech` (1597212618440-806262de4f6b), `cloudplane` (1570710891163-6d3b5c47248b). Page d'origine `https://unsplash.com/photos/<identifiant>`.

GSAP est utilisé sous sa licence standard gratuite (gsap.com/standard-license), qui couvre les sites commerciaux.
