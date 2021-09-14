FROM tommylau/php-5.2

COPY src /project
RUN mkdir /project/uploads

RUN chown -R root:www-data /project/uploads
RUN chmod -R 733 /project/uploads
