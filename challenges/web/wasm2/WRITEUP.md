# Writeup

## Exploration

Visiting `/src` will output the website TypeScript source code. 

The flag is is stored in `./challenge/FLAG`, therefore cannot be read from source.

This is a typical express backend. The only interesting endpoint is `POST /`, which is the main challenge.

## Challenge

The best approach is starting from the end. The goal is to get to `send_success`. This only occurs if `solve = true`. The variable is only set in `verify_answer`. The method is never called directly, but is exposed to the WASM instance. The only method called from the WASM instance is `main`. The `verify_answer` also appears to rely on the output of `put_challenge` and the `challenge` variable. The challenge therefore is to create a WASM `main` function that:

1) Use `put_challenge` to get the `challenge` variable.
2) Modify the `challenge` (later conclude to reverse the challenge).
3) Use `verify_answer` to submit the answer.

### challenge variable

The `challenge` variable is defined by `random_string(36)`. Testing the implementation yields lowercase random strings of length 36. The implementation is random enough that we cannot bruteforce the answer. 

### put_challenge

The `put_challenge` function writes the `challenge` byte by byte into a WASM memory address. 

### verify_answer

The `verify_answer` function verifies that the WASM function performed the correct operations. Note that there is a `attempted` barrier, which prevents multiple attempts to verify the answer. The inner function reads the answer byte by byte and checks if it equal to the reverse of the challenge with `str.split('').reverse().join('')`. 

## Solve

There are two possible pathways: either WAT or C. Most people are probably more comfortable with C, therefore this writeup will focus on that pathway. For those interested in a solution written by hand, see `./writeup/solution.wat`. The code is alot shorter, but is alot less optimized than what a compiler can offer.

### Writing C

The references offer an easy online compiler: https://webassembly.studio/. Create a basic C project. Not to have to deal with JavaScript, just recreate the challenge in C. This leads to `./writeup/studio.c`. The output WASM cannot be used directly because there is no way to import JavaScript memory.

### Patching WAT

The challenge provides a `base.wat` that can be used. Just copy the resulting WAT `reverse_string` and `$t2` into it. The challenge functions and `reverse_string` can be called from the `main` function.

```wat
(func (export "main")
    (call $put_challenge
        (i32.const 1337)
    )

    (call $reverse_string
        (i32.const 1337)
    )

    (call $verify_answer
        (i32.const 1337)
    )
)
```

This results into `./writeup/studio.wat`. Comments were added to specify what was copied directly from the WASM Studio output.

### Compile WAT to WASM

The hacky way is to copy the `studio.wat` directly into the `main.wasm` on WASM Studio. Save the file (without rebuilding) and download the result.

The usual way is to use download the `wabt` toolkit (https://github.com/WebAssembly/wabt) and `wat2wasm studio.wat`.

### Submit

With the resulting `studio.wasm`, just upload to the website. This will run the functions and output the flag.
