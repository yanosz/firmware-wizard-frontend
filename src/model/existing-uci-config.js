export default class ExistingUciConfig {
  constructor({firewall, network} = {}) {
    this.firewall = firewall;
    this.network = network;
  }
}
