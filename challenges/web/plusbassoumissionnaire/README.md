# Retour vers le futur

Challenge en 2 parties (2 flags)

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Dans un futur lointain, le futur gouvernement de ce qui était anciennement connu sous le nom de "Province de Québec" fait toujours appel au plus bas soumissionnaire afin de réaliser ses site web dépourvus de personnalité.

Leur tâche cette fois-ci était de créer un système de forums bilingue pour les CHSDL, cependant le contracteur n'a pas encore terminé son développement malgré que le site soit déjà en ligne.

Un nouveau contracteur a créé un site pour notre CHSDL local. Gros problème: Il ne respecte pas la loi 101 et il n'est pas bien solide côté sécurité. Le gouvernement a même dû leur demander de faire des changements pour éviter une prise de contrôle du site par des pirates informatiques. 

On fait maintenant appel à toi. Peux-tu prouver que leur site est de vraiment mauvaise qualité? On aimerait bien résilier le contrat pour ce citron. 

> hints disponibles

Partie 1:

1: Il faut faire un peu de reconnaissance pour trouver une manière facile de s'authentifier sur le site. 

2: La première chose à regarder sur un site, c'est un fichier qui contient de l'information pour les web crawlers. Parfois, celui-ci peut fuiter de l'info sur les chemins vers des répertoires secrets. 

Partie 2:

1: Le flag se cache dans `/etc/passwd`.

2: Plusieurs caractères sont interdits. Vous pouvez utiliser les wildcards de Bash pour bypasser ça. Notez aussi que les espaces sont bloquées, donc vous devez trouver le moyen de générer des espaces dans votre commande lorsqu'elle sera interprétée par Bash.

# Writeup

Étape 1: Accéder à `robots.txt`. Celui-ci leak de l'info sur le répertoire `backups_rpy4qplxikzb3lld46m2v9prw5mm91cqwgkcvw`. En le visitant, on trouve une lettre d'audit qui montre une vulnérabilité de code dans un document fax scanné. La base de données contient des mots de passes qu'on peut essayer pour s'authentifier. 

Étape 2: Il faut exploiter la faille. La faiblesse du code est de faire un `trim()` sur mot de passe à stocker dans la variable `$password`, mais d'utiliser un regex qui empêche l'utilisation du mot de passe `password` sur `$_POST['psw']`. Le regex a un `^` au début, indiquant que le mot de passe doit commencer par la string indiquée. On peut donc bypass la sureté de mot de passe faibles en mettant un espace devant le mot de passe qu'on entre. Donc, avec l'utilisateur `jeff` et le mot de passe dans la base de données SQLite3 qu'on a trouvé, on peut s'authentifier avec ` password` (espace devant). 

Le premier flag est trouvé: `flag-cb6bc02b3bb0c4eaa8583b0e069f6657c0b0f99d`

Étape 3: Il faut modifier le paramètre GET dans l'URL afin d'accéder au profil de d'autres usagers. Lorsqu'on mets `0`, on a accès au profil administrateur. 

Étape 4: Celui-ci permet d'exécuter des commandes. Il y a une boite avec les commandes dedans, mais on peut les modifier dans le HTML ou la requête pour exécuter n'importe quoi. Les commandes sont bloquées par un regex inconnu qui bloque certains caractères. Il faut donc y aller par essaie et erreur afin de contourner la protection.

Après plusieurs tests, on détermine qu'on peut obtenir le flag avec: `top&&/bin/c?t$IFS/etc/p?sswd`, en utilisant `$IFS` pour générer des espaces. Une autre solution possible serait `top&&/?sr/bin/b?se64$IFS/etc/p?sswd`. Les trucs avec `{}` pour créer des espaces ne fonctionnent pas, donc impossible de faire `{free&&/?sr/bin/b?se64,/etc/p?sswd}`.

Le flag est: `flag-a4c73faf76b6db78c1921b32dfbe4b23de0ce255`.

