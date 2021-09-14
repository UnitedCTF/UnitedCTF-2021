# Debug WASM

> Web

Author: @alexandre-lavoie

## Overview

WebAssembly (WASM) is a relatively new standard for the web that allows to compile code for the web. This is particularly useful if you want to run languages like C/C++, Rust, Go, etc. WASM has the benifit of being lightweight and fast. It is also has the advantage (depending on the perspective) of being harder to reverse engineer than obfuscated JavaScript.

## Challenge

For this challenge, you are provided a webpage that fetches `challenge.wasm`. The WebAssembly file exposes a `main` function. The `main` function is envoked automatically when visiting the webpage. To restart the program, you just need to refresh the whole page. The `main` function will write the flag starting at `1337` and erase it. Your goal is to find a way to read and/or decrypt that flag.

The WebAssembly file `challenge.wasm` was written by hand in the `wat` format (aka written in low-level and not compiled from a high-level language). If you are feeling adventurous, you should be able to solve this challenge using only static analysis. More reastically, you should do a quick scan over the code and perform dynamic analysis. You will find your browser's DevTools memory and breakpoint tools very useful. Although most browser should have WebAssembly tools, you may have more support on a Chromium based browser.

## Resources

- WASM guide: https://www.tutorialspoint.com/webassembly/webassembly_quick_guide.htm

- Chrome's WASM DevTools: https://developer.chrome.com/blog/wasm-debugging-2020/ 

- Writting WASM by Hand: https://blog.scottlogic.com/2018/04/26/webassembly-by-hand.html

- WASM Specs: https://webassembly.github.io/spec/core/

- Wat2Wasm Online: https://webassembly.github.io/wabt/demo/wat2wasm/

- WebAssembly Toolkit: https://github.com/WebAssembly/wabt/

# Setup

Requirements:

- `docker`
- `docker-compose`

Start:

```
Production: docker-compose up
Development: docker-compose -f docker-compose.dev.yml up
```

(The challenge will be locally hosted at http://localhost:6969/).
