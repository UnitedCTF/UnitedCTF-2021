[org 0x7c00]
[bits 16]

xor ax, ax
mov ds, ax
mov es, ax
mov bx, 0x8000 ; stack base

cli
mov ss, bx
mov sp, ax
sti

cld

xor ah, ah
mov al, 0x03
int 0x10
xor al, al

jmp 0x0000:main

%include "print.asm"

main:
  mov ax, ENTER_PASSWORD
  call print

  mov si, 0x0
_read_chars:
  xor ax, ax
  int 0x16
  cmp al, 0x0d
  je _read_chars_done

  cmp al, 0x20
  jl _read_chars

  cmp al, 0x7e
  jg _read_chars

  mov [INPUT+si], al
  inc si

  cmp si, 0x20
  je _read_chars_done

  call print_char

  jmp _read_chars

_read_chars_done:
  call print_nl

  mov si, 0x0
_cmp_input:
  mov bl, [FLAG+si]
  cmp bl, 0x0
  je _cmp_input_good

  ror bl, 4
  xor bl, 0x55

  mov cl, [INPUT+si]
  cmp cl, bl
  jne _cmp_input_bad

  inc si
  jmp _cmp_input

_cmp_input_good:
  mov ax, GOOD
  call print
  jmp halt

_cmp_input_bad:
  mov ax, BAD
  call print
  jmp halt

halt:
  cli
  hlt
  jmp halt

ENTER_PASSWORD:
  db "Enter password: ", 0
GOOD:
  db "Good password", 13, 10, 0
BAD: 
  db "Invalid password", 13, 10, 0
; FLAG-GETTING_GOOD_AT_THIS_THING
FLAG: 
  db 0x31, 0x91, 0x41, 0x21
  db 0x87, 0x21, 0x01, 0x10
  db 0x10, 0xc1, 0xb1, 0x21
  db 0xa0, 0x21, 0xa1, 0xa1
  db 0x11, 0xa0, 0x41, 0x10
  db 0xa0, 0x10, 0xd1, 0xc1
  db 0x60, 0xa0, 0x10, 0xd1
  db 0xc1, 0xb1, 0x21, 0x00
INPUT:
  times 32 db 0x00

times 510-($-$$) db 0x0
dw 0xAA55
