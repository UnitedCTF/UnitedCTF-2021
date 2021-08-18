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
%include "disk.asm"
%include "font.asm"

main:
	mov ax, 0x7e00
	mov bx, 0x0002
	mov cx, 0x0080
	call disk_load

	mov bx, 0x411a
	call font_load
	mov bh, 0x61
	call font_load
	add ax, 0x16c  ; 26*14
	mov bx, 0x300a
	call font_load
	add ax, 0x8c   ; 10*14
	mov bx, 0x210f
	call font_load
	add ax, 0xd2   ; 15*14
	mov bx, 0x3a07
	call font_load
	add ax, 0x62   ; 7*14
	mov bx, 0x5b06
	call font_load
	add ax, 0x54   ; 6*14
	mov bx, 0x7b04
	call font_load

	mov ax, FLAG
	call print

halt:
	cli
	hlt
	jmp halt

%include "flag.asm"

times 510-($-$$) db 0
dw 0xAA55

%include "chars.asm"
