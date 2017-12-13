#!/bin/sh

. /lib/functions.sh
. /usr/share/libubox/jshn.sh

# Security Note: This code DOES NOT check for command-injection problems!
# By design, this code is able to do harmful things using the root account!
# Please make sure, that only authorized administrators are able to call these functions!

# Handle a json array, by executing a specific handler for each value
# Arguments:
# Json: A json array
# Handler: Command to execute for each element
handleArray() {
    local json=$1
    local handler=$2
    local i=0
    if [ ! -z "${json}" ]; then
        while true; do
           local elem=$(jsonfilter -s "${json}" -e "@[${i}]")
           # Break if there is no more element
            if [ -z "${elem}"]; then
                break
            fi
            `${handler} "${elem}"`
            i=`expr $i + 1`
        done
    fi
}

# Handle an upload json string
# Example: {"path":"/freifunk/vpn/freifunk_berlin/berlin.crt","contentBase64":"XnJvb3Q6Lio=","mode":"600"}
handleUpload() {
    local json=$1
    local path=$(jsonfilter -s "${json}" -e "@.path");
    local content=$(jsonfilter -s "${json}" -e "@.contentBase64")
    local mode=$(jsonfilter -s "${mode}" -e "@.contentBase64")
    logger "Applying upload for ${path}"
    echo -ne "${content}" | base64 -d > $path
    if [ ! -z "${mode}" ]; then
        chmod ${mode} ${path}
    fi
}
# Handle a "lineInFileCommand"
# Example: {"path":"/etc/shadow","line_base64":"XnJvb3Q6Lio=","regexp_base64":"XnJvb3Q6Lio="}
handleLineInFile() {
    local json=$1
    local regexp=$(jsonfilter -s "${json}" -e "@.regexp_base64" | base64 -d);
    local line=$(jsonfilter -s "${json}" -e "@.line_base64" | base64 -d);
    local path=$(jsonfilter -s "${json}" -e "@.path");
    logger "Handling line in file: ${path}, using regxp: ${regexp}"
    sed -i "s~${regexp}~${line}~g" ${path}
}

# Function for handling uci-commands to be executed in a batch
# All operations are json-encoded in a batch-like manner
uciBatchCommands() {
    local json=$1
    echo $uci_batch_command > /tmp/uci_batch_command
    base64 -d < /tmp/uci_batch_command | uci -q batch
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
        logger "Line in files: ${lineInFiles}"
        uci_batch_command=$(jsonfilter -s "${json}" -e '@.uci_batch_commands_base64')

        handleArray "${uploads}" "handleUpload"
        handleArray "${lineInFiles}" "handleLineInFile"
        uciBatchCommands "${uci_batch_command}"
        echo '{ "status": "success", "description": "config has been applied" }'

        echo $config > /etc/ffwizard.config.json
        exit 0
        #reboot
      ;;
    esac
  ;;
esac