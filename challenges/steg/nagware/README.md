# nagware

> Steg

Author: [Dylan Bobb (dylanbobb)](https://github.com/dylanbobb)

The other steg challenges all had something that looked (or sounded) slightly strange.
But, for effective steg to be possible, it shouldn't even be obvious that a message was hidden at all.
Can you find the secret content in this seemingly normal looking logo?

# Writeup
![out](https://user-images.githubusercontent.com/37233412/133376068-43f28121-9bd3-4853-86be-b53b291a852c.jpg)

This challenge can be solved with many tools that find hidden files in images. \
There are 2 files hidden in this image, one is a flag.txt file, which contains a link to a pastebin. \
The other is a zip file, that is password protected. \
<br>

For those that don't want to use any "fancy" tools:
- The [link to the pastebin](https://pastebin.com/TSiXFe1u) can simply be found in the strings of the file. 
- The zip can be found simply by opening the image with winRAR, 7Zip, etc (the title nagware is a hint that winRAR will be useful).

<br>
The contents of the pastebin, are simply the password of the zip, which when extracted reveal the flag.

flag: `flag-hiddeninplainsight`
