# Write WASM

> Web

Author: @alexandre-lavoie

## Overview

WebAssembly (WASM) is a relatively new standard for the web that allows to compile code for the web. This is particularly useful if you want to run languages like C/C++, Rust, Go, etc. WASM has the benifit of being lightweight and fast. It is also has the advantage (depending on the perspective) of being harder to reverse engineer than obfuscated JavaScript.

## Challenge

Now that you can debug WASM, time to write your own. This challenge is to reverse a string. You must submit a compiled WASM file to run your code on the server. 

The server uses two methods to communicate with your code. 

- `put_challenge(char *address)`: Will put the string to reverse at the address you specify.
- `verify_answer(char *address)`: Will verify that the internal key matches the reversed value.

The server also uses a shared `js` memory with the code to put/view data in memory.

You may want to try to compile a high-level language to WASM. A web tool was made for this purpose https://webassembly.studio/. This said, the high-level toolchains tend to have issues with shared memory, so you will probably have to do manual patching.

You may also be interested to write low-level code in `wat`. The code can be written in a basic LISP-like syntax and may be easier to manage. The code can be compiled with `wat2wasm` in https://github.com/WebAssembly/wabt/.

## Resources

- Writting WASM by Hand: https://blog.scottlogic.com/2018/04/26/webassembly-by-hand.html

- WASM Specs: https://webassembly.github.io/spec/core/

- Wat2Wasm Online: https://webassembly.github.io/wabt/demo/wat2wasm/

- WebAssembly Toolkit: https://github.com/WebAssembly/wabt/

- Compile C from Scratch: https://surma.dev/things/c-to-webassembly/

- WASM Studio: https://webassembly.studio/ 

# Setup

Requirements:

- `docker`
- `docker-compose`

Start:

```
Production: docker-compose up
Development: docker-compose -f docker-compose.dev.yml up
```

(The challenge will be locally hosted at http://localhost:9696/).
