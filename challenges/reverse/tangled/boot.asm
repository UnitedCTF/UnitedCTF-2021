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

mov [BOOT_DISK], dl
cmp dl, 0x00 ; expect boot from floppy
jne halt

jmp 0x0000:main

%include "system.asm"
%include "print.asm"
%include "disk.asm"
%include "font.asm"

main:
  mov ax, 0x7e00
  mov bx, 0x0002
  call disk_load

  mov bx, 0x411a
  call font_load
  add bh, 0x20
  call font_load
  add ax, 0x16c  ; 26*14
  sub bx, 0x3110 ; 0x300a
  call font_load
  add ax, 0x8c   ; 10*14
  sub bx, 0x0efb ; 0x210f
  call font_load
  add ax, 0xd2   ; 15*14
  add bx, 0x18f8 ; 0x3a07
  call font_load
  add ax, 0x62   ; 7*14
  add bx, 0x20ff ; 0x5b06
  call font_load
  add ax, 0x54   ; 6*14
  add bx, 0x1ffe ; 0x7b04
  call font_load

  mov ax, FLAG
  call print
  jmp halt

%include "flag.asm"

times 510-($-$$) db 0x99
dw 0xAA55

%include "chars.asm"
