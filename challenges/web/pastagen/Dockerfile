FROM php:7.4-apache

RUN rm /var/log/apache2/access.log

RUN useradd flag -c "FLAG-WHERE_DID_YOU_GET_THAT_PASTA"
RUN echo -n "FLAG-LFI_TO_RCE_IN_A_FEW_STEPS" > /flag_962ee5b266379bf62dbd22cb7cfa6adc11ffbd85e37c6ac97efea767f81d6a49.txt

COPY --chown=www-data:www-data ./src /var/www/html/

# Clear logs every 5 mins
HEALTHCHECK --interval=300s --start-period=5s --retries=3 \
  CMD [ "cp", "/dev/null", "/var/log/apache2/access.log" ]

USER www-data
