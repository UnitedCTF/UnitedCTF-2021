FROM ubuntu:21.10

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y curl python3 python3-pip

WORKDIR /app

COPY . .

RUN pip3 install -r ./web/requirements.txt

EXPOSE 1337

CMD python3 ./web/app.py
