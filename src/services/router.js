import { module } from 'angular';
import TunnelOperator from '../model/tunnel-operator';
import ExistingUciConfig from '../model/existing-uci-config';

export default module('app.services.router', [])
  .service('router', class RouterService {
    constructor($q, jsonrpc, session, $base64) {
      'ngInject';

      this.$q = $q;
      this.jsonrpc = jsonrpc;
      this.session = session;
      this.$base64 = $base64;
    }

    call(object, method, args) {
      if (!this.session.connection) {
        return this.$q.reject(new Error('not connected'));
      }
      return this.jsonrpc.call(
        this.session.connection.apiUrl,
        this.session.getSessionId(),
        object,
        method,
        args,
      );
    }

    applyConfig(config) {
      return this.call('ffwizard.sh', 'apply', {config});
    }

    getIwinfoFreqlist(device) {
      return this.call('iwinfo', 'freqlist', {device});
    }

    getNetworkWireless() {
      return this.call('network.wireless', 'status', {});
    }

    getOlsrLinks() {
      return this.call('olsrd', 'links', {});
    }

    getOlsrNeighbors() {
      return this.call('olsrd', 'neighbors', {});
    }

    getSystemBoard() {
      return this.call('system', 'board', {});
    }

    getSystemInfo() {
      return this.call('system', 'info', {});
    }

    scanWifi(device) {
      return this.call('iwinfo', 'scan', {device});
    }
    getFreifunkConfig() {
      return this.call('ffwizard.sh', 'get_config', {});
    }
    getFirewallConfig() {
      return this.call('uci', 'get', { config: 'firewall'});
    }
    getNetworkConfig() {
      return this.call('uci', 'get', { config: 'network'});
    }

    // TODO IP-Configuration, Freifunk-Configuration, etc. dann disable-next-line herausnehmen
    // eslint-disable-next-line no-unused-vars
    applyUCIConfig({config, firewallConfig, networkConfig}) {
      let uploads = [];
      let uciCommands = '';
      let lineInFiles = [];
      const existingUciConfig = new ExistingUciConfig({
        network: networkConfig,
        firewall: firewallConfig,

      });
      [config.router, config.ip, config.vpn].forEach((conf) => {
        if (conf) {
          uploads = uploads.concat(conf.fileUploads(existingUciConfig));
          uciCommands += conf.uciSettings(existingUciConfig);
          lineInFiles = lineInFiles.concat(conf.lineInFiles(existingUciConfig));
        }
      });

      console.log('Sending :', {
        uciCommands,
        uploads,
        lineInFiles,
        config,
      });

      return this.call('ffwizard.sh', 'apply', {
        uci_batch_commands_base64: this.$base64.encode(uciCommands),
        uploads,
        lineInFiles,
        config});
    }


  });
