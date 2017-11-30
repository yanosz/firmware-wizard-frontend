export default class TunnelOperator {

  constructor(name, {config, uciCmd, uploads, fields} = {}) {
    this.name = name;
    this.config = config;
    this.uci_flag = uciCmd;
    this.uploads = uploads;
    this.fields = fields;
  }

    // Mullvad: Login via account-number
  static mullvad() {
    const op = new TunnelOperator('vpn.operator.mullvad', {
      uci_flag: 'openvpn.mullvad.enabled',
      uploads: [],
      fields: [{
        key: 'account',
        desc: 'vpn.operator.mullvad.account_no.desc',
      }],
    });
    // Using username / passwords requires different serialization
    op.serializedFileUploads = function () {
      return {
        content: `${this.fields.account.value} \nm\n`,
        path: '/lib/freifunk/vpn/mullvad/mullvad_userpass.txt',
      };
    };
    return op;
  }

  // Yanosz: Upload: Key, certificate
  static yanosz() {
    return new TunnelOperator('vpn.operator.yanosz', {
      uci_flag: 'openvpn.yanosz.enabled',
      uploads: [{
        key: 'cert',
        desc: 'vpn.operator.desc.cert',
        dest: '/freifunk/vpn/yanosz/cert.pem',
        fileExtensions: '.crt,.cert,.pem  text/*',
        required: true,
      }, {
        key: 'key',
        desc: 'vpn.operator.desc.key',
        dest: '/freifunk/vpn/yanosz/key.pem',
        fileExtensions: '.key,.pem  text/*',
        required: false,
      }],
      fields: [],
    });
  }

  static berlin() {
    return new TunnelOperator('vpn.operator.berlin_udp', {
      uci_flag: 'openvpn.berlin_udp.enabled',
      uploads: [{
        key: 'cert',
        desc: 'vpn.operator.desc.cert',
        dest: '/freifunk/vpn/freifunk_berlin/berlin.crt',
        fileExtensions: '.crt,.cert,.pem  text/*',
        required: true,
      }, {
        key: 'cert',
        desc: 'vpn.operator.desc.key',
        dest: '/freifunk/vpn/freifunk_berlin/berlin.key',
        fileExtensions: '.key,.pem  text/*',
        required: true,
      }],
      fields: [],
    });
  }

  static berlinTcp() {
    const template = this.berlin();
    template.name = 'vpn.operator.berlin_tcp';
    template.uci_flag = 'openvpn.berlin_udp.enabled';
    return template;
  }

  // Freifunk KBU: Login ueber cert / key
  static kbu() {
    return new TunnelOperator('vpn.operator.kbu', {
      uci_flag: 'openvpn.freifunk_kbu.enabled',
      uploads: [{
        key: 'cert',
        desc: 'vpn.operator.desc.cert',
        dest: '/freifunk/vpn/freifunk_kbu/cert.pem',
        fileExtensions: '.crt,.cert,.pem  text/*',
        required: true,
      }, {
        key: 'cert',
        desc: 'vpn.operator.desc.key',
        dest: '/freifunk/vpn/freifunk_kbu/key.pem',
        fileExtensions: '.key,.pem  text/*',
        required: true,
      }],
      fields: [],
    });
  }

/**
 * None Operator - Static constant for please select Operator
*/
  static none() {
    return new TunnelOperator('vpn.operator.none');
  }

    /**
     * Get all Operators
     * @returns Array containint TunnelOperator objects (all configured ones)
     */
  static allOperators() {
    return [this.none(), this.mullvad(), this.berlin(), this.berlinTcp(), this.kbu(), this.yanosz()];
  }

    /**
     * UCI-Settings for configuring the Tunnel-Operator
     * @returns {string} - uci-commands to be executed in a batch
     */
  uciSettings() {
    let result = '';
    TunnelOperator.allOperators().eachAfter((op) => {
      if (op.uci_flag) {
        result += `set #{op.uci_flag} = ${(op.name === this.name) ? 1 : 0} \n`;
      }
    });
    result += 'commit openvpn\n';
    return result;
  }

  serializedFileUploads() {
    this.uploads.collect(upl => ({path: upl.path,
      conent: upl.content,
    }));
  }
}
