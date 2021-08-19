# Encodage

> crypto

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Il y a une différence entre [l'encodage et l'encryption](https://danielmiessler.com/study/encoding-encryption-hashing-obfuscation/). Pour l'encodage, on n'a pas besoin de clé pour obtenir le message original. Ce n'est qu'un moyen différent de représenter des données. On ne fait que décoder le message avec le bon algorithme. Pour l'encryption, il faut déchiffrer le message avec une clé secrète. L'encryption vise à ce que les données restent confidentielles.

Ce défi n'est pas un défi de cryptographie, cependant, encore aujourd'hui, certaines personnes utilisent l'encodage comme si c'était un moyen sécuritaire d'échanger des informations secrètes. Il s'agit d'une très mauvaise pratique. 

Pour résoudre ce défi, vous devez convertir les données suivantes jusqu'à obtenir un flag. Pour ce faire, vous devrez apprendre à reconnaître l'apparence de certains encodages. Il s'agit de nombres décimaux, base64, rot13 et hexadécimal.

Utilisez l'outil [Cyberchef](https://gchq.github.io/CyberChef/) pour résoudre ce défi. 

Le message est le suivant: 

```
78 122 77 51 79 84 90 108 78 122 81
121 90 68 89 50 78 122 73 51 77 68
89 49 78 122 73 50 78 122 81 122 78
109 85 50 78 106 82 109 78 122 89 51
77 106 89 120 78 84 81 50 90 84 89
49 78 122 70 108 79 81 61 61
```

## Setup

Requirements:
- Une distribution basée sur Linux

# Writeup

Pour chaque étape, on détermine le type d'encodage utilisé. On remarque que le message original est en nombre décimaux. Après l'avoir décodé, on remarque une chaine de caractères qui correspond à l'encodage Base64. Ensuite, on voit une chaine de caractère hexadécimaux qui, une fois décodée, donne un alphabet "shifté". Il faut faire un ROT13 (rotation par 13) afin d'obtenir le flag. 

![image](https://user-images.githubusercontent.com/6194072/129854739-6beace2d-787a-4343-8af5-d55bca435323.png)

Le flag: `flag-secretPasBienGardé`

