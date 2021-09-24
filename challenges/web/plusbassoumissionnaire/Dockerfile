FROM php:8.0.10-apache

RUN apt-get update -y && apt-get upgrade -y

RUN useradd flag -c "flag-a4c73faf76b6db78c1921b32dfbe4b23de0ce255"

COPY src /var/www/html
RUN chmod -R 555 /var/www/html

RUN echo "ServerTokens Prod" >> /etc/apache2/apache2.conf
RUN echo "ServerSignature Off" >> /etc/apache2/apache2.conf

RUN find / -execdir touch -t 203708261532 {} \; 2> /dev/null
