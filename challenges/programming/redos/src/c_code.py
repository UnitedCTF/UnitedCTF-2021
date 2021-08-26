import re

# At least 64k steps max 32 chars, 28 needed
r = r'^(?P<import_statement>#import)((?P<lib> m[a-z]l{2,10}((?<=l{2})oc))|.);(?(lib)[A-z =]*|[0-9])+$'
s = '#import malloc; int flag = 1337'

print(re.match(r, s))