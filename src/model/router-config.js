import BaseConfig from './base-config';

export default class RouterConfig extends BaseConfig {
  constructor({name, passwordHash, sshkeys} = {}) {
    super();
    this.name = name;
    this.passwordHash = passwordHash;
    this.sshkeys = sshkeys;
  }

  // For now, its Hostname, only:
  uciSettings() {
    return `${super.uciSettings()}\n 
    set system.@system[0].hostname='${this.name}\n 
    uci commit system \n`;
  }

}
