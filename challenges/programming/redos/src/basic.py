import re

# 2000+ steps, 8 chars
r = r'^(\w*)+$'
s = 'Hi_nerd!'

print(re.match(r, s))