# Writeup

## Notice

This writeup assumes that a Chromium based DevTools is used. The procedure may be similar, but was not tested on other browsers.

## Solution

Open DevTools (Ctrl-Shift-I). Under `Sources`, there should be a `challenge.wasm`. If the file is absent, refresh the page.

Place a breakpoint at the function at `0x006c` (`$main`) and refresh the page to debug the method. Notice how execution is stopped before getting the `Too Late` page.

The assembly code can be stepped through line by line (F11) to examine the behaviour of the code.

The pre-loop section calls the function at `0x0040` (`$func1`). This is a utility function similar to `strlen`, which returns the string length.

The loop starting at `0x0089` is the main decryption loop. If a breakpoint is inserted at that line and the script is resumed (F8), a single byte will be written to `1337`. The byte memory watcher can be found in the right pannel under `Scope > Module > memories > $memory0 > buffer > [[ Int8Array ]] > [0 ... 9999] > [1300 ... 1400]`.

If the loop is executed multiple cycles, the full flag will eventually be written in memory in byte form starting at `1337`. Use a tool like https://gchq.github.io/CyberChef/ to convert from bytes to ascii.

## Shortcut

After careful examination, one may find that the loop performs the following operation (major congrats for the person that can).

```
(ENCRYPTION[i] - 1) XOR (KEY[i % LEN(KEY)])
```

The data can be read at `0x011c`. Everything before `\0` (the string terminator) is the `KEY` and everything after `\0` is the `ENCRYPTION`.

(This shortcut may be clearer if LISP-like notation is used over stack notation).

## Traps

- The method at `0x0040` is not meant to be debugged. The utility is used to allow for varible flag sizes. Notice how the resultant values placed in the return variables is the string length of the data `0x011c`.

- Trying to "cheat" by placing a breakpoint after the loop at `0x00e5` will lead to clearing the memory. The loop was crafted to destroy the flag after it was written. A patient reverse engineer may notice that placing a breakpoint at `0x00b6` will allow to stop the execution right before the delete cycle. 
