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

print:
  pusha
  mov si, ax

_print_loop:
  lodsb
  cmp al, 0
  je _print_done
  mov ah, 0x0e
  ror al, 4
  xor al, 0x40
  int 0x10
  inc si
  jmp _print_loop

_print_done:
  popa
  ret

main:
  mov ax, FLAG
  call print

halt:
  cli
  hlt
  jmp halt

FLAG:
  db 0x60, 0xeb, 0xc0, 0x1b, 0x10, 0xcd, 0x70, 0x10, 0xd6, 0x7c
  db 0x71, 0x0c, 0x50, 0x31, 0xc0, 0x34, 0x30, 0xe4, 0xf0, 0x04 
  db 0xd0, 0xb4, 0x50, 0x00, 0xf1, 0x40, 0x41, 0x3c, 0xf0, 0xc8
  db 0xf1, 0x7c, 0x17, 0xbb, 0x67, 0xc6, 0x20, 0xac, 0x90, 0x60
  db 0x41, 0x3d, 0x31, 0x00, 0x00

times 510-($-$$) db 0x0
dw 0xAA55
