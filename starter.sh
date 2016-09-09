#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
        export PATH=/usr/local/bin:$PATH
	export NODE_ENV=production
	cd /opt/MEAN-HR && forever --spinSleepTime 10000 start server.js >> forever.log 2>&1
fi
