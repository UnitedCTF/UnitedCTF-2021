# File upload vulnerability 5

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour ce cinquième défi, la sécurité de l'application a été solidifiée afin de vérifier le type MIME du fichier sauvegardé sur le disque pour s'assurer que ce soit bien un image. Cependant, leur serveur laisserait téléverser un certain fichier qui pourrait changer la signification de certains type de fichiers...

## Setup

Requirements:
- BurpSuite

# Writeup

Vous devez téléverser un fichier avec la même procédure que dans dans `File upload vulnerability 2`, cependant, l'application vérifie l'extension du fichier. Cependant, l'extension peut être n'importe où dans le nom du fichier. On peut donc téléverser un fichier `index.jpg.php`.

Flag: `flag-80643872d1740e1544606nevertrusttheuser`
