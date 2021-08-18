jmp _font_section_end

; ax: where from
; bh: char start
; bl: char count
font_load:
  pusha

  push bx

  mov bp, ax

  pop ax
  push ax

  xor ah, ah
  mov cx, ax

  pop ax
  xor al, al
  ror ax, 8

  mov dx, ax
  mov bh, 0x0e
  xor bl, bl
  mov ax, 0x1100
  int 10h

  popa
  ret

_font_section_end:
