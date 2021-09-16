# HackerTools

> Pwn

Author: @alexandre-lavoie

## Overview

We found a public facing toolkit by the notorious hacking group `PWNK1DD135`. The group installs ransomwares on government/company systems; over 2M$ in damages already. Can you help us take them down?

## Challenges

Given the scale of the repo, challenges were split off into ./challenges. The challenges should be prefaced by the previous overview and a link to the website.

## Resources

- Enumeration: https://github.com/OJ/gobuster
- Login: https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection
- Foothold: https://pwnisher.gitlab.io/nodejs/sandbox/2019/02/21/sandboxing-nodejs-is-hard.html
- PrivEsc: https://alexandre-lavoie.github.io/2021/08/22/file-move-privesc.html

# Setup

Requirements:

```
docker
docker-compose
```

Start:

```
Development: docker-compose -f docker-compose.dev.yml up
Production: docker-compose up
```

(The challenge will be locally hosted at http://localhost:1337/).