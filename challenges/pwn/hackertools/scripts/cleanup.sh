#!/bin/bash

rm -rf /backup
mkdir /backup
chmod 600 /backup
echo "IyEvYmluL2Jhc2gKZWNobyAiSGVsbG8gV29ybGQiCg==" | base64 -d > /backup/helloworld
chmod 544 /backup/helloworld

rm -rf /rootsafe
mkdir /rootsafe
chmod 755 /rootsafe
