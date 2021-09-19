# SQL injection 2

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour ce deuxième défi d'injection SQL, il y a plusieurs utilisateurs dans la table `users` et le code vérifie maintenant que la requête retourne qu'un seul résultat. Donc, l'injection utilisée précédemment ne fonctionne plus. Cependant, l'utilisateur `admin` est le premier dans la table.

## Setup

Requirements:
- BurpSuite

# Writeup

L'injection précédente `" or 1=1--` ne fonctionne plus, car elle retourne plusieurs résultats et le code s'assure que ce n'est pas le cas. 

La description du défi nous indique que l'utilisateur `admin` est le premier dans la table. On devrait penser à faire l'injection `" or 1=1 limit 1--` afin de limiter la quantité de résultats retournée. On obtiendra le flag `FLAG-4acceacedaf77ae3c3ecc5fec82ff1fflimitit`. 

On peut aussi faire `admin" and 1=1--` dans le champs Username afin de s'assurer qu'il y ait qu'un seul match avec l'utilisateur `admin` sans entrer de mot de passe. 
