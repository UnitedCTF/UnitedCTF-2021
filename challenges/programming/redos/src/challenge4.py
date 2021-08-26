import re
import re

# Max 40 chars
# Top answer: 11.5m steps

msg = input()
s = map(ord, msg)

a = sum(s) % 35
b = len(msg.split('_')[0])
c = len(msg)

reg_str = f'^((?P<a5>\\S)|(?P<a23> )|(?P<a35>\\s)){{{c % 16}}}(?(a{c})(?(a{b})(?P=a{a})+|_)|_)+$'
regex = re.compile(reg_str)
regex.match(msg)