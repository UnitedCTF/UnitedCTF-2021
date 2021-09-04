FROM node:14

# Sudo

RUN apt-get update && apt-get install -y sudo

# Low-Priv User

RUN useradd -ms /bin/bash -G sudo k1dd13

# Web

WORKDIR /app
RUN chown k1dd13:k1dd13 /app

USER k1dd13

COPY ./web/package*.json ./

RUN npm install

COPY ./web/. ./

# PrivEsc

USER root

RUN echo "k1dd13 ALL=(ALL) NOPASSWD: /bin/safemv, /bin/cleanup, /backup/helloworld" >> /etc/sudoers

COPY ./scripts/safemv.sh /bin/safemv
RUN chmod 544 /bin/safemv

COPY ./scripts/cleanup.sh /bin/cleanup
RUN chmod 544 /bin/cleanup

RUN mkdir /backup
RUN chmod 600 /backup
COPY ./scripts/helloworld.sh /backup/helloworld
RUN chmod 544 /backup/helloworld

RUN mkdir /k1dd13safe
RUN chown k1dd13:k1dd13 /k1dd13safe
RUN chmod 755 /k1dd13safe

RUN mkdir /rootsafe
RUN chmod 755 /rootsafe

# Flags

COPY ./challenges/1/FLAG /app/flags/FLAG_1
COPY ./challenges/2/FLAG /app/flags/FLAG_2
RUN chown k1dd13:k1dd13 /app/flags/FLAG_*
RUN chmod 400 /app/flags/FLAG_*

COPY ./challenges/3/FLAG /home/k1dd13/FLAG
RUN chown k1dd13:k1dd13 /home/k1dd13/FLAG
RUN chmod 400 /home/k1dd13/FLAG

COPY ./challenges/4/FLAG /root/FLAG
RUN chmod 400 /root/FLAG

# Entrypoint

USER k1dd13

CMD ["npm", "start"]
