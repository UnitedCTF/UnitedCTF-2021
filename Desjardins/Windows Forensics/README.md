
# Windows Forensics

## Partie 1: RDP Cache

Voici une machine virtuelle Windows. Plusieurs flags ont été manipulés dans cette machine, mais ils ont tous été supprimés. Pourtant, des traces des flags restent sur ces machines. Dans les quatre prochains exercices, vous serez introduit au monde complexe du *Windows Forensics* et découvrirez divers artifacts utilisés par Windows qui permettent de tirer de l'information sur des actions passées.

Tous les outils nécessaires à la récupération des flags sont inclus dans la machine virtuelle, sur le bureau.

L'utilisateur de la machine s'est connecté en RDP vers une machine externe et a consulté un flag. Récupérez ce flag.

**Nom d'utilisateur: user**
**Mot de passe: toor**

Puisqu'il s'agit d'une machine Windows d'essai, la machine virtuelle va s'éteindre chaque heure, automatiquement. Rien n'est perdu, c'est simplement désagréable. Avant de commencer les défis, il serait préférable de créer une "snapshot" de la machine virtuelle pour y revenir au besoin.

[Lien vers le OVA](https://drive.google.com/file/d/1bCkf312TXr7DgTvZLq9C-tMEtRDBIPFm/view?usp=sharing).

Note: Même si la track de défis est séparée en partie numérotée, elles sont toutes indépendantes et peuvent être complétées dans l'ordre que vous choisissez.

Note 2: Cette track de défis est inspirée de la playlist [Introduction to Windows Forensics par 13Cubed sur Youtube](https://www.youtube.com/playlist?list=PLlv3b9B16ZadqDQH0lTRO4kqn2P1g9Mve). La playlist comprend plein d'autres éléments de forensics Windows si vous voulez approfondir vos connaissances.

## Partie 2: Shellbag

<à venir>

## Partie 3: LNK Files

<à venir>

# Partie 4: NTFS Journal

<à venir>

## Solution

### Part 1

Le défi s'appelle "Windows Forensics - RDP Cache". En cherchant précisément ça, ou en visionnant le vidéo de 13Cubed sur le RDP Cache (de la playlist mentionnée dans la description), on comprend que des bouts d'images de sessions RDP sont persistées sur le disque après avoir terminé la session RDP. C'est situé dans `C:\users\<user qui a fait la connexion RDP>\appdata\local\Microsoft\Terminal Server Client\Cache`.

L'outil "bmc-tools" permet de transformer ce cache en images qu'on peut visionner facilement. C'est disponible sur le bureau. C'est un script python.
1. Ouvrir cmd ou powershell et se déplacer dans le bon répertoire: `cd C:\Users\user\Desktop\bmc-tools-master\bmc-tools-master`
2. `python .\bmc-tools.py --help` pour voir comment utiliser l'outil.
3. Exécuter la commande pour extraire le RDP cache: `python .\bmc-tools.py -d . -s "C:\users\user\appdata\local\Microsoft\Terminal Server Client\Cache"`
4. Les images ont été écrites dans le répertoire courant. Clic droit dans le répertoire --> view --> large icons pour voir les aperçus.
5. En se promenant dans les images, on peut apercevoir des bouts de flags. Avec un peu de patience, on peut recréer le flag: `FLAG-06c078dd3ebf7801575feaa109f73ddc`

### Part 2

<à venir>

### Part 3

<à venir>

### Part 4

<à venir>
