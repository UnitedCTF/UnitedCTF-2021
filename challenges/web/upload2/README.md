# File upload vulnerability 2

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour ce second défi, la sécurité de l'application a été solidifiée. L'application empêche de téléverser n'importe quel type de fichier, mais cette vérification dépend de l'information qui lui est donnée par le navigateur web de l'utilisateur...

## Setup

Requirements:
- BurpSuite

# Writeup

Vous devez téléverser un fichier comme dans `File upload vulnerability 1`, cependant, l'application vérifie le champ `Content-Type` du téléversement. 

Donc, `Content-Type: application/x-php` ne fonctionnera pas, car l'application détermine que ce n'est pas une image. Par contre, on peut utiliser `Content-Type: image/jpeg` afin que le fichier se téléverse avec succès. 

Flag: `flag-b425938e434797462192relyingontheclientside`
