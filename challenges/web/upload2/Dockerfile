FROM php:8.0.10-apache

RUN apt-get update -y && apt-get upgrade -y

COPY src /var/www/html
RUN mkdir /var/www/html/uploads

RUN chown -R root:www-data /var/www/html/uploads
RUN chmod -R 755 /var/www/html
RUN chmod -R 733 /var/www/html/uploads

RUN echo "disable_functions=exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source" >> /usr/local/etc/php/php.ini

