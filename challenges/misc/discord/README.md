# Discord

> Misc

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Pour obtenir ce flag, vous devez résoudre l'énigme qui se trouve dans le canal #flag du serveur Discord du UnitedCTF.

## Setup

Requirements:
- Accès à Discord

# Writeup

À 18h30, ce message a été posté dans #flag au lancement du CTF:

```
"bb315cb69bc74ace7a8155cd63a50ee6" + "c94456d225d310aaa19aa25931277a6463aad602" + "3db1a73a245aa55c61204c56c8d99f6d" + "a8db1d82db78ed452ba0882fb9554fc9"
```

Il s'agit d'un défi sur les hash. On peut déduire que ce sont des hash à cause que les strings ont la même longueur que ceux générés par des fonctions de hachage connues. Ils ont la longueur de hash MD5 et un seul a la longueur d'un hash SHA1. On peut trouver certains sur Google, mais il y en a au moins un qui n'est pas trouvable par Google. Il faut alors utiliser un outil spécialisé. Le site le plus connu est CrackStation. Il contient des bases de données de strings d'origine pour plus d'une dizaine de millions de hash. On peut tous les mettre dedans pour obtenir: 

![image](https://user-images.githubusercontent.com/6194072/134349659-4b85ccc4-f332-4030-8c0e-b6d3d67cb595.png)

Il ne reste plus qu'à assembler le flag: 

Cela donne: flag-discordunitedctf

