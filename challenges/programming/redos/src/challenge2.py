import re

# Mise en contexte: On a demandé au stagiaire de nous pomper un regex qui match des addresses courriel.
# Après 3 semaines, y nous a sorti ça
# Y'a même pris la peine d'écrire de la doc
regex = r'^(?P<firstWord>\w+)(?P<followingWords>\.\w+)*(?P<extention>\+\w+)?@(?P<subdomain>\w+)(?P<higherLevelDomains>.\w+)+$'

#Doc: firstWord: Match un premier "mot" [A-z0-9]
# followingWords: Comme beaucoup de monde mettent plusieurs mots séparés par un ., on tente d'en matcher plusieurs.
# extention: Dans notre dataset, j'ai vu des addresse qui ressemblaient à ça: addresse+unMot@exemple.com aucune idée de ce que ça fait, mais faut le supporter.
# subdomain: On doit avoir un domaine initial
# higherLevelDomains: Et avoir au moins 1 domaine de plus haut niveau (séparé par un . à chaque fois)

# Faille: dans higherLevelDomains, le . est pas escaped donc il match n'importe quel caractère, ce qui permet d'abuser un redos.
# Indice implicite: followingWords existe juste pour montrer comment actually excape un .
# Indice explicite: Un outil de debug (tel que regex101.com) peut être très pratique pour décortiquer un regex complexe.
# Best possible: ~8m itérations

msg = input()
re.match(regex, msg)