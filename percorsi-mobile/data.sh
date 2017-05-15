#!/bin/sh
DATA_WEBAPP="Ingarda"

grep "var DEVELOPMENT = false;" www/js/services/conf.js &>/dev/null
#if [ $? == 0 ]; then
#  DATA_HOST_NAME="dev"
#else
#  DATA_HOST_NAME="tn"
#fi
DATA_HOST_NAME="tn"
echo "host: $DATA_HOST_NAME"

curl -H "Content-Type: application/json" -d '{"updated":{}}' "https://$DATA_HOST_NAME.smartcommunitylab.it/percorsi/sync/$DATA_WEBAPP?since=0" -o www/data/data.json
