# Raycaster

> reverse

Ce challenge contient 5 flags.

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

I found this game on the Internet and it does weird things sometimes. I don't know... it's strange. Seems like there are no game objectives, but I can't stop spending hours going through the maze. I've spent hours playing and I'm running late with my school assignments.

Control keys:
* `Arrows`: Moving and turning
* `Page up` and `Page down`: Look up and down
* `Escape`: Exit the game

--------------

Challenge 1 (first encounter): There's a command line parameter that's parsed right at the top of the `main_main` function (Go's `main()` function if it were Java or C code). 

You should use IDA Free 7.6, which has a cloud decompiler. It does a mostly good job at decompiling Go binaries. For sure, you could also try other tools if it helps you. I'm thinking about GDB (GNU debugger), which has great plugins like Pwndbg, GEF and Peda). IDA also has its own debugger too. The nice thing with IDA is that you can edit the assembly code to change the program's behavior and save it to a new binary via the "patch" functionality.

You need Linux to run this challenge. This challenge was tested on Ubuntu 20.04.3 LTS. You must install SDL2 (`apt install libsdl2-2.0-0`). Let the challenge designer know if you have trouble running it. If you need help using IDA, there are plenty of tutorials online on websites such as Youtube.

--------------

Challenge 2 (missing texture): There's a texture that's never rendered anywhere in the maze, although it's in the game's binary. Can you extract it? Maybe you could even get the game to render it.

The binary file for this challenge is the same as the previous. 

--------------

Challenge 3 (cheat code): There's a cheat code in this game. It's something you type on the keyboard. Can you find what it is? What does it do?

This flag doesn't start with `flag-`. You must enter the cheat code on CTFd as the flag.

The binary file for this challenge is the same as the previous. 

--------------

Challenge 4 (backdoor): It seems this game is backdoored. It doesn't seem activated by default. Can you find what the purpose of this backdoor is? What does it do?

The binary file for this challenge is the same as the previous. 

--------------

Challenge 5 (the room): There's an inaccessible room on the map. Can you get inside? Maybe you need to create your own noclipping hacks. 

Make sure you're running the game binary from inside your terminal. It may print something there once you get in.

The binary file for this challenge is the same as the previous. 

## Setup

Requirements:
- Une distribution basée sur Linux

# Writeup

Challenge 1:

Dans le haut de la fonction `main_main`, on voit `os_Args`. Le code indique une comparaison avec `0x6C6965766E752D2DLL`. On peut convertir cela en `char`, on obtient `lievnu--` qui est une string à l'envers. On peut voir deux arrays qui se XOR une et l'autre puis un appel à `fmt_Fprintln`. Si on exécute le binaire avec `--unveil`, un flag apparaîtra au terminal. `flag-notsosecret`

Challenge 2:

Dans la fonction `main_main`, on peut voir le quatrième appel à `main_textureDecoder`. Celui-ci reçoit une grosse string Base64. Si on la décode, on obtient une image PNG. Elle contient le texte `flag-mi55ingt3xtur3`. 

Challenge 3:

Dans la fonction `main_main`, on peut voir `main_circular_buffer` à partir duquel on crée une slice comparée à `ykoops` avec `runtime_memequal`. Les strings sont à l'envers, donc en fait c'est le mot `spooky`. Si on l'entre dans le jeu, cela donne bien un résultat. C'est bien cela le flag. 

Challenge 4:

En fouillant dans le code, on trouve une fonction `main_updateSpecials` qui effectue une commande `os_exec_Command`. Cela correspond à une backdoor. Au début de la fonction, on voit la string ``jvvrq8--rcqvg`kl,amo-pcu-z3wdvpae``. On voit un XOR avec le nombre 2. Cela donne un URL pastebin qu'on peut accéder à `https://pastebin.com/raw/x1uftrcg`. La page contient ``oehn$jfdy{fd`zlm``. Si on continue à regarder le code, on voit plus loin un XOR avec le nombre 9. On fait donc le XOR sur le contenu de la page. Cela donne `flag-compromised`. 

Challenge 5:

Il y a une salle innassessible sur la carte du jeu qu'on voit en haut à gauche lorsqu'on joue. Il faut aller dedans. La fonction qui vérifie si on est à l'intérieur s'appelle `main_updateTics`. Dedans, on peut voir la variable `main__stmp_5` qui contient `D4DACCC2E0EECAE856567CEEE8E0E0D8` suivi de `F8C6FC6CCAAACE56E6CAEC56D2D6CE54`. Si on concatène les deux ensemble pour obtenir `F8C6FC6CCAAACE56E6CAEC56D2D6CE54D4DACCC2E0EECAE856567CEEE8E0E0D8`, il faut ensuite rotate les bits vers la droite par 1 pour obtenir l'inverse de l'opération `v23[i] = __ROL8__((unsigned __int8)v21[i + 7], 63);` vue dans le code. Ensuite, le caractère `B` (66) est ajouté. On a donc `lpptw>++tewpafmj*gki+ves+gUe6~c|B`. Juste après, on XOR par le nombre 4 pour obtenir une string renversée. Il s'agit de l'URL d'où est téléchargé le flag `flag-haveYouSeenTheMovie?` pour être affiché. 

Si on voulait le faire sans reverse la fonction `main_updateTics`, il faudrait modifier les quatre `if` qui commencent par `if ( !main_worldmap` pour que le code sous leur scope s'exécute toujours. Dans le code assembleur, on peut les voir sous la forme suivante: 

```
.text:00000000006850D5 84 DB                                   test    bl, bl
.text:00000000006850D7 75 09                                   jnz     short loc_6850E2
.text:00000000006850D9 F2 0F 11 84 24 48 01 00+                movsd   [rsp+2B8h+var_170], xmm0
.text:00000000006850D9 00
.text:00000000006850E2
.text:00000000006850E2                         loc_6850E2:                             ; CODE XREF: main_main+A47↑j



.text:0000000000685134 84 DB                                   test    bl, bl
.text:0000000000685136 75 09                                   jnz     short loc_685141
.text:0000000000685138 F2 0F 11 84 24 50 01 00+                movsd   qword ptr [rsp+2B8h+var_168], xmm0
.text:0000000000685138 00
.text:0000000000685141
.text:0000000000685141                         loc_685141:                             ; CODE XREF: main_main+AA6↑j
```

Il y en a quatre, les deux montrés ci-dessus sont seulement pour la flèche pour "avancer". La collision marchera quand même quand on recule. Il faut patcher les instructions `jnz` (0x75 0x09) et les écraser avec des instructions `nop` (0x90). Le tour est joué! On peut passer à travers les murs.


