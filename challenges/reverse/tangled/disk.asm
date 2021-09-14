jmp _disk_section_end

; ax: where to
; bh: sector start
; bl: sector count
disk_load:
  pusha

  push bx
  push ax

  mov ah, bh
  add ah, 0x2
  mov al, bl

  pop bx

  mov ch, 0x00
  mov cl, 0x02

  mov dx, [BOOT_DISK]
  xor dh, dh

  int 0x13
  jc disk_error

  pop bx
  cmp al, bl
  jne sector_error

  xor ah, ah
  int 0x13

  popa
  ret

BOOT_DISK: db 0x00

disk_error:
  mov ax, DISK_ERROR
  call print
  jmp halt

sector_error:
  mov ax, SECTOR_ERROR
  call print
  jmp halt

DISK_ERROR: db "Disk error", 13, 10, 0
SECTOR_ERROR: db "Sector error", 13, 10, 0

_disk_section_end:
