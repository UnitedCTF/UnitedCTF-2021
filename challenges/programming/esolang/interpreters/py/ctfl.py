from ctf import Interpreter

import argparse
import time

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="CTFLang Interpreter.")
    parser.add_argument('file', help="File to interpret.")
    parser.add_argument('--verbose', help='Displays interpreter memory.', action='store_true')
    parser.add_argument('--delay', help='Delay for verbose mode.', type=float, default=0.1)
    args = parser.parse_args()

    with open(args.file, 'rb') as h:
        code = b''.join(h.readlines())

    interpreter = Interpreter(code)

    while interpreter.step():
        if args.verbose:
            interpreter.visualize()
            time.sleep(args.delay)

    print(interpreter.output.decode('utf8'))
