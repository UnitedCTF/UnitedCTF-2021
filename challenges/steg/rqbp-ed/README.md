# rqbp-ed

> Steg

Author: [Dylan Bobb (dylanbobb)](https://github.com/dylanbobb)

La stéganographie consiste souvent à trouver des fichiers dans des images.\
Mais, pouvez-vous trouver l'image dans ce fichier?

# Writeup
First, from the description of the challenge, the binary must be converted to an image, which can be done with many online tools (ex: https://www.dcode.fr/binary-image) \
This generates the following QR Code:\
![image](https://user-images.githubusercontent.com/37233412/132622527-910f69ed-6a8b-4d8f-bbee-ade5fc58f849.png) \
\
\
After scanning, we get the message: 0199-133-102 1+ rz yynP \
Next, notice that the title of the challenge is a hint, and is simply the rot-13 of the reverse of "qr-code".\
Taking the rot-13 and reverse of the message, we get: Call me +1 201-331-9910 \
After calling the number, there is a weird audio recording played: [Audio](https://vocaroo.com/16c8q2Q2wLsJ) \
Reversing the audio results in a more understandable message: [Audio](https://voca.ro/16LzF8fDHmMH) \
Transcript:
> All caps. The flag is: FLAG-RINGRING. Good job, good-bye! 

flag: `FLAG-RINGRING`
