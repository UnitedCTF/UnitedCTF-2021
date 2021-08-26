from handler import Handler
import socketserver
import json
import exceptions
import os

from datetime import datetime

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f'Type {type(obj)} not serializable')

# Implement your custom code here
class CustomTCPServer(socketserver.TCPServer):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

port = 31337
print(f'Starting server on internal port: {port}')
address = ('0.0.0.0', port)
s = CustomTCPServer(address, Handler)
s.serve_forever()