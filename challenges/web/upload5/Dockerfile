FROM php:8.0.10-apache

RUN apt-get update -y && apt-get upgrade -y

COPY src /var/www/html
RUN mkdir /var/www/html/uploads

RUN chown -R root:www-data /var/www/html/uploads
RUN chmod -R 733 /var/www/html/uploads
