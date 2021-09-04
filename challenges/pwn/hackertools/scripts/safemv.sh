#!/bin/bash

if ! [[ $1 =~ ^[A-Za-z0-9_]+$ ]]; then
    echo "Unsafe source file."
    exit
fi

if ! [[ $2 =~ ^[A-Za-z0-9_]+$ ]]; then
    echo "Unsafe destination file."
    exit
fi

if [ -e "/rootsafe/${2}"~ ] ; then rm -f "/rootsafe/${2}"~ || : ; fi
mv -f "/rootsafe/${2}" "/rootsafe/${2}"~
mv "/k1dd13safe/${1}" "/rootsafe/${2}"
chown -h root:root "/rootsafe/${2}"
chmod 600 "/rootsafe/${2}"
