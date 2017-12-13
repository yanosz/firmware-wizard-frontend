import {copy} from 'angular';

export default class TunnelOperator {

  constructor(id, {uploads, fields, name} = {}) {
    this.id = id;
    this.uploads = uploads;
    this.fields = fields;
    this.name = name;
  }

    // Mullvad: Login via account-number
  static mullvad() {
    const op = new TunnelOperator('vpn.operator.mullvad', {
      name: 'mullvad',
      uploads: [],
      fields: [{
        key: 'account',
        desc: 'vpn.operator.mullvad.account_no.desc',
        lineInFile: {
          path: '/lib/freifunk/vpn/mullvad/mullvad_userpass.txt',
          regexp: '^.*',
        },
      }],
    });
    return op;
  }

    // Yanosz: Upload: Key, certificate
  static yanosz() {
    return new TunnelOperator('vpn.operator.yanosz', {
      name: 'yanosz',
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
      name: 'berlin_udp',
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
    const template = copy(this.berlin());
    template.id = 'vpn.operator.berlin_tcp';
    template.name = 'berlin_tcp';
    return template;
  }

    // Freifunk KBU: Login ueber cert / key
  static kbu() {
    return new TunnelOperator('vpn.operator.freifunk_kbu', {
      name: 'freifunk_kbu',
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

}
