
# Windows Forensics

## Partie 1: RDP Cache

Voici une machine virtuelle Windows. Plusieurs flags ont été manipulés dans cette machine, mais ils ont tous été supprimés. Pourtant, des traces des flags restent sur ces machines. Dans les quatre prochains exercices, vous serez introduit au monde complexe du *Windows Forensics* et découvrirez divers artifacts utilisés par Windows qui permettent de tirer de l'information sur des actions passées.

Tous les outils nécessaires à la récupération des flags sont inclus dans la machine virtuelle, sur le bureau.

Défi: **L'utilisateur de la machine s'est connecté en RDP vers une machine externe et a consulté un flag. Récupérez ce flag.**

**Nom d'utilisateur: user**
**Mot de passe: toor**

[Lien vers le OVA](https://drive.google.com/file/d/1bCkf312TXr7DgTvZLq9C-tMEtRDBIPFm/view?usp=sharing).

Note 2: Cette track de défis est inspirée de la playlist [Introduction to Windows Forensics par 13Cubed sur Youtube](https://www.youtube.com/playlist?list=PLlv3b9B16ZadqDQH0lTRO4kqn2P1g9Mve). La playlist comprend plein d'autres éléments de forensics Windows si vous voulez approfondir vos connaissances.

Note 3: Puisqu'il s'agit d'une machine Windows d'essai, la machine virtuelle va s'éteindre chaque heure, automatiquement. Rien n'est perdu, c'est simplement désagréable. Avant de commencer les défis, il serait préférable de créer une "snapshot" de la machine virtuelle pour y revenir au besoin.

## Partie 2: Shellbags

Le même utilisateur a supprimé un répertoire qui contenait un flag. Quel était le nom de ce répertoire?

## Partie 3: LNK Files

Dans le répertoire supprimé dans la partie 2, il y avait un fichier. Trouvez le nom de ce fichier.

# Partie 4: NTFS Journal

Trouvez la date de suppression du fichier trouvé dans l’exercice précédent.

Flag format: `FLAG-YYYY-MM-DD_HH:mm:ss`
Exemple: `FLAG-2021-20-08_20:37:06`

Note: Les artifacts nécessaires à la résolution du défi ont déjà été extraits dans la machine virtuelle.

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

Semblable à la partie 1, en googlant "Windows Forensics Shellbags", on trouve de l'information. On remarque qu'on peut utiliser l'outil "ShellBags Explorer" pour trouver notre flag.

Les Shellbags sont des informations sur les répertoires accédés par un utilisateur avec l'explorateur Windows, qui contient quelques métadonnées intéressantes sur les répertoires. Même après la suppression d'un répertoire, les shellbags persistent.

1. Ouvrir `C:\Users\user\Desktop\ShellBagsExplorer\ShellBagsExplorer.exe`
2. File --> Load Active Registry
3. Fouiller un peu les entrées. Il y a une entrée appelée "monflag" qui contient un répertoire "deeper" qui contient le flag: `flag-folderContenantFlag2`.

### Part 3

Les LNK files sont créés lorsqu'on ouvre un fichier ou programme dans Windows. Ils contiennent des métadonnées intéressantes comme le nom du fichier, le dernier temps d'exécution, la taille du fichier et d'autres. Même après la suppression d'un fichier, sa référence .LNK persiste.

Un peu de googling nous apprend que les .LNK se situent dans %appdata\Microsoft\Windows\Recent.

1. Ouvrir un cmd.
2. On lance la commande: `C:\Users\user\Desktop\LECmd\LECmd.exe -d "C:\users\user\appdata\roaming\Microsoft\Windows\Recent" --csv .`
3. Ouvrir le fichier .csv avec un éditeur texte. On fouille un peu, et on trouve le flag: `flag-leDeuxiemeFlag.txt`

### Part 4

Le système de fichier NTFS garde un journal des opérations faites afin d'assurer l'intégrité des données.

Les trois fichiers utiles, $MFT, $J et $LogFile, peuvent être extraits du système avec FTK Imager. Pour *parse* ces données, on peut utiliser ANJP pour trouver le flag.

Pour ce défi, nous cherchons à lire le USNJournal, qui traque les changements faits aux fichiers et répertoires.

1. (déjà fait) Utiliser FTK Imager pour extraire $MFT, $J et $LogFile.
2. Lancer ANJP, mettre les trois fichiers dans leur case respective et faire "Parse". C'est un long processus (30mins-1h)
3. Aller dans reports -> usn -> usn events -> transaction events -> Deletions
4. Filter -> Column = USN Rcd File Name, Condition = LIKE, Value = %flag% --> Add --> Filter
4. On regarde l'entrée qui concerne flag-leDeuxiemeFlag.txt (et non pas le .txt.lnk), on voit dans la colonne USN Rcd Time: 2019-11-17 01:18:36

`FLAG-2019-11-17_01:18:36`
