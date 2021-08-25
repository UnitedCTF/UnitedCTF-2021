import random
import re

random.seed(1337)
with open("./chars.asm") as f:
  text = f.read()
  matches = [(letter, bin) for letter, bin in re.findall(r'(c[0-9a-f]+):([\n\w\s]+)\n(?=c[0-9a-f]+:)', text, flags=re.MULTILINE)]
  with open("./chars_shuffled.asm", "w") as g:
    random.shuffle(matches)
    g.write('\n'.join([bin for (_, bin) in matches]))