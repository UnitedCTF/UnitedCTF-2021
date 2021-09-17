# PNG repair
> steg
Author: @KptCheeseWhiz

## Challenge
The most evil hacker in the world corrupted all my cute kitten images 😾😾. Can you help me recover my cuties 😿?

## Writeup

### Flag 1
This image has its header erased. Add the header `0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a` back and it will display.

### Flag 2
This image has its bytes reversed, reverse it back to see the flag.

### Flag 3
This image has its dimensions set to 1x1. You can try to find the right width and height by opening the image in GIMP as a raw (.data) image. Then you set the height to around 1500 and adjust the width. You should be able to see a repeating pattern that "synchrosises" up to around 2000. Then you can create multiple images around that width, up to you to find the right one. Add two `uint32` at the position `16` and `20` of values `2000` and `1333`.

### Flag 4
This image has its length and CRC checksum erased for IDAT segments. Originally, it was supposed to be only the CRC that were erased, but since Windows Photo doesn't care about CRCs, I added the length. (refer to `src/flag4.ts`)

### Flag 5
This image has its IDAT segments scrambled. First, you need to find the first IDAT segment which is marked by the letter `x` or `0x78`. Then you need to find the last segment which is the one that has a different size. After that, you need to bruteforce the rest of the segments one by one to obtain an image that is more and more visible until you can read the flag. (refer to `src/flag5.ts`)

## Setup

### Requirements
 - nodejs

### How to run
 - Execute the command `npm run genflags`