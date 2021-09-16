import re

msg = input()
r = r'^(?P<import_statement>#import)((?P<lib> m[a-z]l{2,10}((?<=l{2})oc))|.);(?(lib)[A-z =]*|[0-9])+$'
re.match(r, msg)