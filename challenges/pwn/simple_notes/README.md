# Simple notes

Tags: `pwn`

Level: Medium

## Description
I needed a way to take quick notes on the command line. I might have missed something...

Executable: `simple_notes`

Source code: `simple_notes.c`

Libc: `libc.so.6`

`nc [SERVER ADDRESS] [CHALLENGE PORT]`

## Solution
The index check in the `create_note` function is slightly wrong, allowing 257 notes instead of 256. The additional note overwrites the index in the array of notes.
We can control the index by setting the note importance. By setting the index to a low negative value, we can abuse a signed/unsigned type confusion and read arbitrary data with the `read_note` function. We use it to leak the `libc` base address using a populated GOT entry. We can then overwrite another GOT entry with a `one_gadget` or a pointer to `system`. There are a few restrictions however. One way to solve this is to overwrite the `atoi` GOT entry with `system` using the `edit_note` function. When asked for the note size, enter `/bin/sh` and enjoy a shell.

## How to run
Build the executable.
~~~
make
~~~
Build the docker container.
~~~
docker build -t simple_notes .
~~~
Fetch `libc`.
~~~
docker run --rm -v $(pwd):/vol simple_notes /bin/bash -c 'cp $(ldd /home/simple_notes/simple_notes | grep libc | cut -d " " -f 3) /vol/'
~~~
Run the container.
~~~
docker run --rm -p 9999:9999 simple_notes
~~~

## How to change the flag
1. Modify flag.txt
2. Rebuild the docker image.

## Author:
Colin Stephenne (Niftic)

