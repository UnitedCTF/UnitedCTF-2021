# Exports

> reverse

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce défi vise à vous familiariser avec Ghidra ou IDA Free qui sont des outils de décompilation de code machine. Si c'est votre premier contact avec cet outil, vous apprendrez à importer un binaire. En fouillant dans l'interface graphique, vous trouverez une section "Exports" qui liste les fonctions du binaire qui peuvent être appelées de l'extérieur par d'autres programmes. Il existe deux fonctions exports suspectes qui ont été ajoutées au programme. 

## Setup

Requirements:
- Une distribution basée sur Linux

# Writeup

Il existe plusieurs façons de voir les symboles dans un fichier exécutable. Par exemple, on aurait pu utiliser la commande `nm --demangle program` afin de trouver les fonctions exportées. Cependant, on peut le faire encore plus facilement en utilisant IDA Free ou Ghidra. Dans l'interface de chacun de ces outils, il y a une section "Exports". 

C'est ainsi qu'on trouve un exports suspect nommé `ROT13TheNextExport`. Celui-ci est suivi de `synt_lbhtbgguvflrnu` en mémoire (on peut se faire prendre par l'ordre alphabétique). En effectuant le ROT13 du string avec un outil comme CyberChef, on trouve `flag_yougotthisyeah`. 

![image](https://user-images.githubusercontent.com/6194072/129850703-5991d8f6-93b6-434d-a728-24bf842cbafc.png)

