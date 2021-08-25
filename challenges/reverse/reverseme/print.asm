jmp _print_section_end

print_hex:
  pusha
  mov cx, 0

_print_hex_loop:
  cmp cx, 4
  je _print_hex_done

  mov dx, ax
  and dx, 0x000f
  add dl, 0x30
  cmp dl, 0x39
  jle _print_hex_step2
  add dl, 7

_print_hex_step2:
  mov bx, HEX_OUT + 5
  sub bx, cx
  mov [bx], dl
  ror ax, 4

  add cx, 1
  jmp _print_hex_loop

_print_hex_done:
  mov ax, HEX_OUT
  call print

  popa
  ret

HEX_OUT:
  db '0x0000', 0

print:
  pusha
  mov si, ax

_print_loop:
  lodsb
  cmp al, 0
  je _print_done
  mov ah, 0x0e
  int 0x10
  jmp _print_loop
  
_print_done:
  popa
  ret

print_nl:
  pusha
  
  mov ah, 0x0e
  mov al, 0x0a
  int 0x10
  mov al, 0x0d
  int 0x10
  
  popa
  ret

print_char:
  pusha

  mov ah, 0x0e
  int 0x10

  popa
  ret

_print_section_end: