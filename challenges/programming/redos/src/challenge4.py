import re

# msg = input()
msg = 'f \tffffffffffffffffffff_DaddyIssues'
a = sum(map(ord, msg)) % 35
b = len(msg.split('_')[0])
c = len(msg)

print(a, b, c)

reg_str = f'^((?P<a5>\\S)|(?P<a14>(?<!(?(a5)[\\w\\W]|.)))|(?P<a23> )|(?P<a35>\\s)){{{c % 16}}}(?(a{c})(?(a{b})(?P=a{a})+|(?(a14)\\w+|(?P=a23)))|_)+$'
regex = re.compile(reg_str)
print(regex.match(msg))