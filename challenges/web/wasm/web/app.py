from flask import Flask, render_template, Response, send_from_directory
from ppci import wasm
import os

app = Flask(__name__)

with open('./challenge/FLAG') as h:
    FLAG = h.read().encode('utf8')

with open('./challenge/KEY') as h:
    KEY = h.read().encode('utf8')

def encrypt_data(flag: bytes, key: bytes):
    rev_key = bytes(reversed(key)) * 10

    encrypt = ''.join(f'\\{hex((d ^ k) + 1)[2:].zfill(2)}' for d, k in zip(flag, rev_key))

    return f"{key.decode('utf8')}\\00{encrypt}"

def decrypt_flag(data):
    key, encoded_flag = data.split('\\00')
    rev_key = bytes(reversed(key.encode('utf8'))) * 10

    encrypted_flag = [int(h, 16) for h in encoded_flag.split('\\')[1:]]

    return ''.join(chr((e - 1) ^ k) for e, k in zip(encrypted_flag, rev_key)).encode('utf8')

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/healthcheck')
def test():
    data = encrypt_data(FLAG, KEY)
    flag = decrypt_flag(data)

    return ('OK' if flag == FLAG else 'ERROR', 200 if flag == FLAG else 500)

@app.route('/public/<path:path>')
def public(path):
    return send_from_directory('public', path)

@app.route('/challenge.wasm')
def challenge():
    with open('./wasm/challenge.wat') as h:
        source = ''.join(h.readlines())

    source_data = source.replace("DATA", encrypt_data(FLAG, KEY))

    module = wasm.Module(source_data)

    return Response(module.to_bytes(), mimetype='application/wasm')

if __name__ == '__main__':
    app.run(debug=os.environ['ENVIRONMENT'] == 'development', host='0.0.0.0', port=int(os.environ["PORT"]))
