# Reverse Boot sector 16/32 bits
> Reverse
Author: @KptCheeseWhiz

## Challenge
Can you help me decipher this string?
```
=4I|RI2RAR^V2RO6R[6<^I{R+6.R+{<'7L
```

## Resources
 - https://linux.die.net/man/1/qemu-kvm
 - https://github.com/cfenollosa/os-tutorial
 - https://en.wikipedia.org/wiki/BIOS_interrupt_call
 
## Setup

### Requirements
 - python
 - nasm
 - qemu

### How to run
 - Test : `make && make boot`
 - Debug : `make && make debug`
 - Print hint : `make hint && make boot`
 - Build challenge : `make final`
