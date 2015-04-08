#!/bin/sh
DATA_WEBAPP_MULTI="ComuneRovereto"

grep "var DEVELOPMENT=true;" ../js/services/conf.js &>/dev/null
#if [ $? == 0 ]; then
#  DATA_HOST_NAME="dev"
#else
#  DATA_HOST_NAME="tn"
#fi
DATA_HOST_NAME="dev"
echo "host: $DATA_HOST_NAME"

curl -H "Content-Type: application/json" -d '{"updated":{}}' "https://$DATA_HOST_NAME.smartcommunitylab.it/percorsi/sync/$DATA_WEBAPP_MULTI?since=0" -o data.json
