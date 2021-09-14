# File upload vulnerability 4

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour ce quatrième défi, la faille de l'application précédante a été corrigée. Cependant, le développeur au commit une petite erreur dans son pipeline CI/CD et la version de PHP a été rétrogradée.

## Setup

Requirements:
- BurpSuite

# Writeup

Vous devez téléverser un fichier avec la même procédure que dans dans `File upload vulnerability 3`, cependant, l'application vérifie correctement que l'extension est à la fin. Cependant, la version de PHP a été rétrogradée. Sur la page d'erreur, on découvre le numéro de la version. On peut ensuite trouver que cette version est vulnérable à des null-byte injections. Donc, on insère un null-byte dans l'extension du fichier malveillant afin de le téléverser. 

Flag: `flag-a6ca1b1cf72b8617699d1nullinjection`
