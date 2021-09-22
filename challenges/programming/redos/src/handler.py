import socketserver
import json
import subprocess
import re

from subprocess import TimeoutExpired

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
		try:
			self.get_action(r)()
		except Exception as e:
			self.send_message(str(e))
			self.serve()

	def quit(self):
		self.send_message('Bye bye 👋')

	def chall1(self):
		m = 'Selected Challenge 1, enter answer:'
		self.send_message(m)

		d = {
			'filename': 'challenge1.py',
			'max_chars': 8,
			'target_steps': 2000}

		self.run_challenge(**d)

	def chall2(self):
		m = 'Selected Challenge 2, enter answer:'
		self.send_message(m)

		d = {
			'filename': 'challenge2.py',
			'max_chars': 32,
			'target_steps': 40000}

		self.run_challenge(**d)

	def chall3(self):
		m = 'Selected Challenge 3, enter answer:'
		self.send_message(m)

		d = {
			'filename': 'challenge3.py',
			'max_chars': 32,
			'target_steps': 64000}

		self.run_challenge(**d)

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
		print(msg)
		if len(msg) > max_chars: raise InvalidInputError(f'Message length should not exceed {max_chars}.')

		try:
			s = subprocess.run(['python3', filename], capture_output=True, input=msg, timeout = 15)
		except TimeoutExpired:
			m = (
				'Great, you broke the challenge.',
				f"Anyway, here's your flag: {flags[filename]}"
			)
			self.send_message(m)
			return self.serve()

		stdout = s.stdout.decode()
		print(stdout)

		if (stderr := s.stderr.decode()):
			error_message = stderr.split('\n')[-2]
			m = ('Error while parsing regex!', error_message)
			self.send_message(m)
			self.serve()
			return

		rule = re.compile(r'^Match step count: (\d+)$')
		n = int(rule.match(stdout).group(1))

		if n < target_steps:
			m = (
				"Sorry not good enough.",
				f'Your solution took {format_number(n)} steps',
				f'You need to hit at least {format_number(target_steps)}.'
			)
		else:
			m = (
				f'You did it with {format_number(n)} steps!',
				f"Here's your flag: {flags[filename]}"
			)

		self.send_message(m)
		return self.serve()