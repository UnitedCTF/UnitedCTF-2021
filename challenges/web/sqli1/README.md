# SQL injection 1

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Bienvenue au premier défi d'injections SQL! Une injection SQL peut se produire lorsqu'un logiciel effectuant une requête SQL utilise directement l'input de l'utilisateur pour créer une requête. Contrairement aux requêtes paramétrées, le logiciel ne connait pas la différence entre un paramètre ou une partie de la requête. 

Un utilisateur peut donc modifier la requête SQL effectuée par l'application. Par exemple, pour la requête SQL suivante qui réflète une page de connexion (utilisée dans ce défi et les défis suivants): 

`SELECT * FROM users WHERE username="$user" AND password="$pass"`

Un utilisateur peut entrer le caractère `"` pour fermer la guillemet dans la requête. Cependant, cela crée une requête invalide à cause de la guillemet qui suit. Il peut cependant faire `"--` au lieu de `"` pour commenter le reste de la requête, ce qui crée une requête valide. 

La page de connexion de ce défi est vulnérable aux injections SQL. Vous devez vous connecter avec l'utilisateur `admin` sans connaître le mot de passe. Le mot de passe est le flag du challenge et il sera affiché si vous vous connectez avec succès. 

Pouvoir se connecter n'est pas aussi simple que dans l'exemple ci-dessus, car vous devez trouver un moyen de rendre la requête toujours vraie sachant que vous ne connaissez pas le mot de passe valide. 

Pour ce défi et les défis suivants, il est important de se souvenir que le moteur de base de données est SQLite3. La requête SQL ci-dessus est utilisé dans tous les défis. 

Utilisez l'outil [BurpSuite](https://portswigger.net/burp/communitydownload) afin de vous aider. Cet outil permet de rejouer des requêtes HTTP et de voir exactement le payload envoyé au site web.

## Setup

Requirements:
- BurpSuite

# Writeup

Vous devez faire `" or 1=1--` pour que la requête soit toujours vraie malgré le mot de passe invalide. 

Ceci est basé sur: https://www.w3schools.com/sql/sql_injection.asp

Lors de l'injection la requête sera `SELECT * FROM users WHERE username="admin" AND password="" or 1=1-- "`, ce qui affiche le flag `FLAG-2e2a330165e881a8adbf6b56ec724a34makeittrue`.

Si on mettais seulement un `"`, la requête serait `SELECT * FROM users WHERE username="admin" AND password="""` ce qui est invalide. 

Avec `"--` la requête donne `SELECT * FROM users WHERE username="admin" AND password=""--"` ce qui est valide mais le mot de passe est invalide donc l'authentification ne valide pas. 

