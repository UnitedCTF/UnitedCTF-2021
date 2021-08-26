import socketserver
import json
import subprocess
import re

from exceptions import InvalidInputError
from secrets import flags

def format_number(n):
	return f'{f"{n:,d}".replace(",", " ")}'

class Handler (socketserver.StreamRequestHandler):
	def send_message(self, message):
		if isinstance(message, tuple):
			message = '\n\r'.join(message)

		self.wfile.write(message.encode() + b'\r\n')

	def handle(self):
		self.send_welcome_message()
		self.serve()

	def send_welcome_message(self):
		m = (
			'Successfully connected.',
		)

		self.send_message(m)

	def get_action(self, choice: str):
		try:
			c = int(choice)
			return {
				1: self.chall1,
				2: self.chall2,
				3: self.chall3,
				4: self.chall4,
				5: self.quit
			}[c]
		except (ValueError, KeyError):
			self.send_message(f'Invalid value: {choice}')
			return self.serve

	def serve(self):
		m = (
			'Select which challenge to try:',
			'1: Challenge 1',
			'2: Challenge 2',
			'3: Challenge 3',
			'4: Challenge 4',
			'5: Quit'
		)

		self.send_message(m)

		r = self.rfile.readline().strip(b'\n\r')
		self.get_action(r)()

	def quit(self):
		self.send_message('Bye bye 👋')
		self.finish()

	def chall1(self):
		self.quit()

	def chall2(self):
		m = 'Selected Challenge 2, enter answer:'
		self.send_message(m)

		d = {
			'filename': 'challenge2.py',
			'max_chars': 32,
			'target_steps': 40000}

		self.run_challenge(**d)

	def chall3(self):
		self.quit()

	def chall4(self):
		m = 'Selected Challenge 4, enter answer:'
		self.send_message(m)

		d = {
			'filename': 'challenge4.py',
			'max_chars': 40,
			'target_steps': 11500000}

		self.run_challenge(**d)

	def run_challenge(self, filename: str, max_chars: int, target_steps: int):
		msg = self.rfile.readline().strip(b'\n\r')
		if len(msg) > max_chars: raise InvalidInputError(f'Message length should not exceed {max_chars}.')

		s = subprocess.run(['python3', filename], capture_output=True, input=msg)
		stdout = s.stdout.decode()

		if (stderr := s.stderr.decode()):
			m = 'Error while parsing regex!'
			self.send_message(m)
			self.serve()

		rule = re.compile(r'^Match step count: (\d+)$')
		n = int(rule.match(stdout).group(1))

		if n < target_steps:
			m = (
				"Sorry not good enough.",
				f'Your solution took {format_number(n)} steps',
				f'You need to hit at least {format_number(target_steps)}.'
			)
			self.send_message(m)
		else:
			m = (
				f'You did it with {format_number(n)} steps!',
				f"Here's your flag: {flags[filename]}"
			)
			self.send_message(m)

		self.serve()

