import socket
import os
import subprocess

listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)
listener.bind('0.0.0.0', 9001)
listener.listen(5)
print(listener.getsockname())

try:
    while True:
        client, addr = listener.accept()
        subprocess.Popen(['./gamepad'], stdin=client, stdout=client, stderr=client)
        client.close()
except KeyboardInterrupt:
    pass
finally:
    listener.close()