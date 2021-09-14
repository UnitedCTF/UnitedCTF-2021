# File upload vulnerability 3

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour ce troisième défi, la sécurité de l'application a été solidifiée (un peu). L'application effectue une vérification de plus afin de se protéger.

## Setup

Requirements:
- BurpSuite

# Writeup

Vous devez téléverser un fichier avec la même procédure que dans `File upload vulnerability 2`, cependant, l'application vérifie l'extension du fichier. Par contre, l'extension peut être n'importe où dans le nom du fichier. On peut donc téléverser un fichier `index.jpg.php`.

Flag: `flag-80643872d1740e1544606nevertrusttheuser`
