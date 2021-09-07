# Cookies

> web

Author: [Alexandre-Xavier Labonté-Lamoureux (AXDOOMER)](https://github.com/axdoomer)

Un cookie HTTP est un bloc de données sauvegardé sur un ordinateur lorsque vous allez sur un site web. De cette façon, un site web peut vous authentifier automatiquement de page à page lorsque vous naviguez sans avoir à vous demander de vous reauthentifier à chaque page.

Encore aujourd'hui, plusieurs programmeurs font des erreurs en codant des site web et utilisent les cookies de façon à créer des vulnérabilités. Ce site web contient une vulnérabilité qui permet de vous faire passer pour l'utilisateur "admin" et voler ses messages personnels. 

Pour modifier les cookies, plusieurs options s'offrent à vous: Burp Suite, des extensions pour navigateur web comme "Cookie Editor", les DevTools de Chrome... Si vous avez besoin de modifier des encodages ou des données dans un certain format, vous pouvez utiliser CyberChef. 

## Setup

Requirements:
- Burp Suite
- Extension "Cookie Editor"
- CyberChef

# Writeup

Lorsque l'utilisateur se connecte en tant que Guest, celui-ci reçoit un cookie d'authentification. 

![1](https://user-images.githubusercontent.com/6194072/132261307-690cdd79-00fb-45eb-ba52-63bd2c2d9b64.png)

En l'analysant, on peut trouver son format. 

![2](https://user-images.githubusercontent.com/6194072/132261306-57a87c7d-66dc-4b11-8fa1-0e6df803681a.png)

On peut ensuite le modifier et créer un cookie qui contient les informations qu'on veut, pour ensuite le passer au serveur comme un cookie authentique. 

![3](https://user-images.githubusercontent.com/6194072/132261305-d29bab46-e873-4f55-8ac5-f2a46c64281a.png)

En le donnant au serveur, on aura accès à la page de l'Admin et un message dans son compte qui contient le flag `FLAG-WH9R7GXttUvx2vqXJ4jLMWFywLBAX2`.

![4](https://user-images.githubusercontent.com/6194072/132261304-c2b410a9-d440-432f-b130-963b7f0401ee.png)

