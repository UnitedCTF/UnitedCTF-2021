# codedump

Tags : `reverse`
Level : `Medium`

## Description 
**Visible** : En analysant un logiciel, j'ai réussi à extraire des données depuis la mémoire. Il semblerait que ce soit un Shellcode Windows, pouvez-vous m'aider à l'analyser ?

**Non visible** : ce challenge a pour but de montrer aux participants comment un Shellcode Windows peut utiliser le Process Environment Block (PEB) pour avoir accès aux DLLs chargées en mémoire et appeler des exports de ces dernières. Les participants n'auront accès qu'au fichier codedump.bin situé dans le dossier */binaries*.

## Hints

- Le débogage est une meilleure approche pour ce challenge, nous vous conseillons x32dbg.
- Vous pouvez utiliser l'outil [BlobRunner](https://github.com/OALabs/BlobRunner) pour mettre le shellcode en mémoire et faciliter le débogage de ce dernier.

## Setup

Requis:
- Une VM windows

## Writeup

Voir [Writeup.md](Writeup.md)


## Author

 Edouard Bochin
