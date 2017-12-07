import BaseConfig from './base-config';

export default class IpConfig extends BaseConfig {
  constructor({v6Prefix, v4Prefix} = {}) {
    super();
    this.v6Prefix = v6Prefix;
    this.v4Prefix = v4Prefix;
  }

  uciSettings(interfaces = []) {
    console.log('Interfaces:', interfaces);
      // Hier die Super-Krasse Iteration ueber alle Interfaces in der Firewall zone
    return super.uciSettings();
  }
}
