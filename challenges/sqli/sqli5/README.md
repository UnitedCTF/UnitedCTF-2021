# SQL injection 5

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce cinquième défi d'injection SQL est identique au défi précédent, cependant le mot `UNION` se fait filtrer. Le code PHP utilise la ligne de code suivante pour supprimer ce mot clé de la requête SQL: `$reqstr = str_ireplace("union", "", $reqstr);`. Il existe tout de même moyen de parvenir au même résultat qu'au défi précédent et afficher le flag. 

## Setup

Requirements:
- BurpSuite

# Writeup

Référez-vous à la solution du défi précédent. 

L'injection `" union select 1,2,flag from flag--` résulte en une requête invalide. Toutes les occurences du mot "union" sont supprimées. On ne peut donc pas non plus faire `" unionunion select 1,2,flag from flag--`. On peut cependant faire `" ununionion select 1,2,flag from flag--`. Le mot clé "union" est supprimé, cependent le nouveau mot "union" qui a été formé n'est pas filtré car la fonction ne réeffectue pas un scan du début pour trouver le nouveau mot clé qui vient d'être formé en supprimant l'autre.

Le flag obtenu est `FLAG-b2b38394a280fc1315644e6ad3879f7bfiltersdontwork`.
