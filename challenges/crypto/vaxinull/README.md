# VaxiNull

> Crypto

Author: @alexandre-lavoie

## Overview

VaxiNull is a Montreal, QC based startup that aims to improve the QC vaccination verification process. They draw close inspiration to the current QC vaccination passport standard. They claim their solution is unbreakable and offer samples: maybe you can break them?

## Challenges

Given the scale of the repo, challenges were split off into `./challenges`. The challenges should be prefaced by the previous overview and a link to the website.

## Resources

- JWS RFC: https://datatracker.ietf.org/doc/html/rfc7515

- VaxiCode Verif Bypass Writeup: https://blog.oki.moe/2021/08/vaxicode-verif-pas/

- ECDSA Lib (JS): https://www.npmjs.com/package/elliptic

- ECDSA Lib (Python): https://pypi.org/project/pycryptodome/

# Setup

Requirements:

- `docker`
- `docker-compose`

Start:

```
Production: docker-compose up
```

(The challenge will be locally hosted at http://localhost:4200/).
