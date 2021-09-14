import random
import os

random.seed(1337)
with open("./boot.bin", "rb") as i:
  with open("./_boot.bin", "wb") as o:
    bin = i.read(510)
    for b in bin:
      if ord(b) == 0x99:
        o.write(chr(random.randint(1, 255)))
      else:
        o.write(b)
    o.write(i.read())

os.rename("./_boot.bin", "./boot.bin")