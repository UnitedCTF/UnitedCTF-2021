FROM ubuntu:20.04

# Install requirements
RUN dpkg --add-architecture i386 && apt-get update -y && apt-get upgrade -y && apt install -y xinetd libc6:i386

# Add user
RUN useradd simple_notes -m

# Copy config
COPY simple_notes.conf /root/simple_notes.conf

# Copy binary
COPY simple_notes /home/simple_notes/simple_notes

# Copy flag
COPY flag.txt /home/simple_notes/flag.txt

# Set permissions
RUN chown -R root:simple_notes /home/simple_notes
RUN chmod -R 750 /home/simple_notes
RUN chmod 440 /home/simple_notes/flag.txt

# Start daemon
EXPOSE 9999
CMD ["/usr/sbin/xinetd", "-dontfork", "-f", "/root/simple_notes.conf"]