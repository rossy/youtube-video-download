#!/bin/sh

if [ $# -eq 0 ]
then
	echo "usage: $0 input.js"
	exit 1
fi

grep -q HASH < $1
if [ $? -ne 0 ]
then
	echo "input file already patched"
	exit 2
fi

sha1sum $1 > $1.sha1sum
sed -i "0,/HASH/s//`cat $@.sha1sum|cut -c 1-7`/" $1
