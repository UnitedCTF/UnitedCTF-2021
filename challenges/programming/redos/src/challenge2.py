import re

regex = r'^(?P<firstWord>\w+)(?P<followingWords>\.\w+)*(?P<extention>\+\w+)?@(?P<subdomain>\w+)(?P<higherLevelDomains>.\w+)+$'

# firstWord: Match un premier "mot" [A-z0-9]
# followingWords: Comme beaucoup de monde mettent plusieurs mots séparés par un ., on tente d'en matcher plusieurs.
# extention: Dans notre dataset, j'ai vu des addresse qui ressemblaient à ça: addresse+unMot@exemple.com aucune idée de ce que ça fait, mais faut le supporter.
# subdomain: On doit avoir un domaine initial
# higherLevelDomains: Et avoir au moins 1 domaine de plus haut niveau (séparé par un . à chaque fois)

msg = input()
re.match(regex, msg)