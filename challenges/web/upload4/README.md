# File upload vulnerability 4

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour ce quatrième défi, le concepteur du site web a remplacé son mécanisme de validation des extensions afin d'interdire tout fichier qui a une extension ".php" et les extensions similaires qui sont des scripts qui peuvent s'exécuter. Il pense que cela est plus efficace.

## Setup

Requirements:
- BurpSuite

# Writeup

En faisant des tests, on découvre que le site permet tous les types de fichiers. Il ne prévient que le téléversement de fichiers PHP, templates PHP, etc.

On peut donc forcer l'exécution d'autres fichiers comme du PHP. Voici un exemple avec les fichiers .png: 

Dans un fichier `.htaccess`, téléverser: 
```
AddHandler application/x-httpd-php .png
```

On pourra ensuite téléverser des fichiers "PNG" qui, lorsque accédés, seront exécutés comme du PHP. 

On peut obtenir le flag:

Flag: `flag-08dfacc89843e423blacklistsaredangerous`
