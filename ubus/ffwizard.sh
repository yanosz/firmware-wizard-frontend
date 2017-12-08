#!/bin/sh
# Copyright (C) 2016 OpenWrt.org

. /lib/functions.sh
. /usr/share/libubox/jshn.sh

uploads() {
    json=$1
    i=0
    if [ ! -z "${json}" ]; then
        while true; do
            logger "ok - Testing ${i} - ${json}";
            upl=$(jsonfilter -s "${json}" -e "@[${i}]")
            if [ -z "${upl}"]; then
                break
            fi
            path=$(jsonfilter -s "${json}" -e "@[${i}].path")
            content=$(jsonfilter -s "${json}" -e "@[${i}].contentBase64")
            logger "Decoding Upload for ${path}"
            echo -ne "${content}" | base64 -d > $path
            i=`expr $i + 1`
        done
    fi
}

case "$1" in
  list)
    json_init
    json_add_object "apply"
    json_add_string "uci_batch_commands_base64"
    json_add_array "uploads"
    json_add_object "upload"
    json_add_string "content_base_64"
    json_add_string "path"
    json_close_object
    json_close_array
    json_add_object "json"
    json_close_object
    json_close_object
    json_add_object "get_config"
    json_close_object
    json_dump
  ;;
  call)
    case "$2" in
      get_config)
	    logger "Sending configuration to client"
	    cat /etc/ffwizard.config.json
	  exit 0;
      ;;
      apply)
        logger "Appyling configuration"
        read json
        config=$(jsonfilter -s "${json}" -e '@.config')
        uploads=$(jsonfilter -s "${json}" -e '@.uploads')
        lineInFiles=$(jsonfilter -s "${json}" -e '@.lineInFiles')
        logger "Got uploads..."
        uploads "${uploads}" > /tmp/uplods
        echo "${lineInFiles}" > /tmp/lineInFiles

        uci_batch_command=$(jsonfilter -s "${json}" -e '@.uci_batch_commands_base64')
        echo $uci_batch_command > /tmp/uci_batch_command
        base64 -d < /tmp/uci_batch_command | uci -q batch
        echo '{ "status": "success", "description": "config has been applied" }'

        echo $config > /etc/ffwizard.config.json
        exit 0
        #reboot
      ;;
    esac
  ;;
esac