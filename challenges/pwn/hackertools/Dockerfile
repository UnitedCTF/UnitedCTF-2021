FROM node:14

# Sudo

RUN apt-get update && apt-get install -y sudo python3

# Users

RUN useradd -ms /bin/bash -G sudo k1dd13
RUN useradd -ms /bin/bash super_k1dd13

# Web

WORKDIR /app

COPY ./web/package*.json ./

RUN npm install

RUN chmod 644 ./package*.json

COPY ./web/. ./

## Chmod on all folders but large `node_modules`.
RUN find . -not -path "*/node_modules*" -type f -exec chmod 644 {} \;

# PrivEsc

RUN echo "k1dd13 ALL=(super_k1dd13) NOPASSWD: /bin/lua, /bin/php, /bin/ruby, /bin/vim" >> /etc/sudoers

## PrivEsc "binary" script
COPY ./scripts/ruby.sh /bin/ruby
RUN chmod 755 /bin/ruby

## Fake "binary" scripts
COPY ./scripts/php.sh /bin/php
RUN chmod 755 /bin/php

COPY ./scripts/lua.sh /bin/lua
RUN chmod 755 /bin/lua

# Flags

RUN mkdir /flags

COPY ./challenges/1/FLAG /app/flags/FLAG_1
COPY ./challenges/2/FLAG /app/flags/FLAG_2
RUN chown root:k1dd13 /app/flags/FLAG_*
RUN chmod 440 /app/flags/FLAG_*

COPY ./challenges/3/FLAG /flags/FLAG_3
RUN chown root:k1dd13 /flags/FLAG_3
RUN chmod 440 /flags/FLAG_3

COPY ./challenges/4/FLAG /flags/FLAG_4
RUN chown root:super_k1dd13 /flags/FLAG_4
RUN chmod 440 /flags/FLAG_4

# Entrypoint

USER k1dd13

CMD ["npm", "start"]
