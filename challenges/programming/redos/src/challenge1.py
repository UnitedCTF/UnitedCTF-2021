import re

msg = input()
r = r'^(\w*)+$'
re.match(r, msg)