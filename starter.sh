#!/bin/bash
#if curl -s --head curl -s --head http://demo.newmediaguru.co:3006 | grep "200 OK" > /dev/null
#  then
#    echo "The HTTP server on http://demo.newmediaguru.co:3006 is up!"
#  else
## NodeJs Project Starter (Supervisor) ##
d="$(echo "$0"|rev|cut -d '/' -f2- |rev)";f="$(echo "$0"|rev|cut -d '/' -f1 |rev)"
p="$(echo "$0"|rev|cut -d '/' -f2 |rev)"
if [ "$d" = "$f" ] ; then p="$(pwd|rev|cut -d '/' -f1 |rev)" ; else cd ${d} ; fi
kill -9 $(lsof +D .|grep "^node "|awk '{print $2}') &> /dev/null
echo "[+] Stopped [$p]";sleep 4
/usr/bin/npm start &> pitchnswitch.nodeapp.log &
echo "[+] Started [$p] [LogFile => pitchnswitch.nodeapp.log]"
exit 0
#fi
