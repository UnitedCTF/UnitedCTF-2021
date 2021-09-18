#!/bin/bash

{ while :; do redis-server --save "" --appendonly no; done; } &
{ while :; do node /app/ftp.js; done } &
node /app/http.js