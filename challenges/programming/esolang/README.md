# CTFLang

> Programming

Author: @alexandre-lavoie

## Overview

Esoteric Programming Languages (Esolangs) are programming languages that are designed to be weird, hard, and/or a joke. Often included in CTFs are `BrainFuck` and `JSFuck`. To introduce more challenge, a custom esolang `CTFLang` was created for this CTF.

## Specification

A `SPECIFICATION.md` is provided to describe `CTFLang`. The interpreters were designed around this document. 

## Challenges

Given the scale of the repo, challenges were split off into `./challenges`. The challenges should be prefaced by the previous overview, provide the specification document, and a link to the website. Additionally, a comment needs to be added regarding the irregular flag format that is `[A-Z_]*`. The base format is provided as `./challenges/FORMAT.md`.

## Resources

- Befunge: https://esolangs.org/wiki/Befunge

- BrainFuck: https://esolangs.org/wiki/Brainfuck

- JSFuck: https://esolangs.org/wiki/JSFuck

# Setup

Requirements:

- `docker`
- `docker-compose`

Start:

```
Development: docker-compose -f docker-compose.dev.yml up
Production: docker-compose up
```

(The challenge will be locally hosted at http://localhost:1337/).
