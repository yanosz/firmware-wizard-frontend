#!/bin/sh
# Copyright (C) 2016 OpenWrt.org

. /lib/functions.sh
. /usr/share/libubox/jshn.sh

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
        local json
        read json
        local uci_batch_command
        local config
        local uploads
        config=$(jsonfilter -s "${json}" -e '@.config')
        uploads=$(jsonfilter -s "${json}" -e '@.uploads[0]')
        logger "Uploads[0]: ${uploads}"
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