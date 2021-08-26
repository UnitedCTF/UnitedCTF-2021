# StringsStrings

> reverse

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Il existe une commande sur Linux qui montre les chaines de caractères ("strings") contenues dans un fichier. Elle est très utile, car parfois les flags sont cachés dans les binaires sans aucun obscurcissement ("obfuscation" en anglais). C'est donc que le texte est sauvegardé tel quel dans le binaire et peut être extrait sans aucune manipulation. C'est une bonne pratique dans les CTFs de vérifier les strings contenus dans les binaires, comme cela on peut avoir une idée de ce qui peut se passer à l'intérieur avant même de l'exécuter. Qui sait? On peut même trouver des secrets!

Cependant, parfois le fichier contient trop de strings, il faut alors utiliser une command qui sert de "global regular expression print". Elle permet de filtrer sur des motifs (patterns) plus spécifiques, par exemple pour chercher le mot "flag" comme dans le cas présent. 

Trouvez le flag caché dans ce binaire en utilisant ces commandes. Le flag mesure 29 caractères de long et est en majuscules.

## Setup

Requirements:
- Une distribution basée sur Linux

# Writeup

Si on exécute la commande `strings`, il y a trop de texte affiché au terminal. On peut utiliser la commande grep tel que `grep -ia flag stringsstrings`, cependant on voit aussi trop de texte être affiché au terminal pour trouver le texte facilement. 

Sur Linux, on peut utiliser les "pipes" pour envoyer la sortie d'une commande dans une autre. De la façon suivante `strings stringsstrings | grep -ia flag`, on obtient moins de lignes. On peut appercevoir `FLAG-9190JA39AN2VMA0221NA99RM` dans la sortie. C'est notre flag. 

On aurait pu être encore plus précis comme la description du challenge dit que le flag est en majuscules. On aurait pu essayer la commande `strings stringsstrings | grep FLAG`, ce qui retourne une seule ligne et c'est la bonne.
