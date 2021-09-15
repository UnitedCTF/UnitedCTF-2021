import socket
import os
import subprocess

listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)
listener.bind((os.environ.get("URL"), int(os.environ.get("SERVER_PORT"))))
listener.listen(5)
print(listener.getsockname())

try:
    while True:
        client, addr = listener.accept()
        subprocess.Popen(['./' + os.environ.get("PROGRAM_NAME")], stdin=client, stdout=client, stderr=client)
        client.close()
except KeyboardInterrupt:
    pass
finally:
    listener.close()