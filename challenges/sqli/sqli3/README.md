# SQL injection 3

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Ce troisième défi d'injection SQL est similaire au défi précédent. Il y a plusieurs utilisateurs dans la table `users` et le code vérifie que la requête retourne qu'un seul résultat. Cependant, l'utilisateur `admin` n'est plus le premier dans la table. Donc, l'injection utilsiée précédemment ne fonctionne plus car vous obtiendrez le mauvais résultat.

## Setup

Requirements:
- BurpSuite

# Writeup

Si on fait la requête précédent `" or 1=1 limit 1--`, on obtient le mauvais mot de passe même si la connexion a réussie. Le code ne vérifie pas que la base de donnée a bien retournée la ligne de l'admin comme premier résultat du dataset. 

Afin de réussir, on peut créer une requête qui va trier les utilisateurs par ordre alphabétique. On fera donc `" or 1=1 order by username limit 1--` (`asc` étant optionnel comme l'ordre croissante est par défaut, mais on aurait pu utiliser `desc` pour trier par l'inverse si `admin` était le dernier utilisateur de la table).

Le flag obtenu est `FLAG-a5ff034660bff8ce89637ece84e0cff1sortit`.
