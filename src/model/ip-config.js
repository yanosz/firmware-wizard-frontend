import {Address6, Address4} from 'ip-address';
import BaseConfig from './base-config';

export default class IpConfig extends BaseConfig {
  constructor({v6Prefix, v4Prefix} = {}) {
    super();
    this.v6Prefix = v6Prefix;
    this.v4Prefix = v4Prefix;
  }

  uciSettings(existingUciConfig) {
    const interfaces = IpConfig.firewallInterfaces(existingUciConfig.firewall);
    let ip6Address = new Address6(this.v6Prefix).startAddress().address;
    let ipAddress = new Address4(this.v4Prefix).startAddress().address;

    ip6Address = `${ip6Address.slice(0, -1)}1`;
    ipAddress = `${ipAddress.slice(0, -1)}1`;

    let uciSettings = super.uciSettings(existingUciConfig);
      // Assign addresses to freifunk Interface: Additional IPv6-Address
    uciSettings += `set network.freifunk.ip6addr='${ip6Address}'\n`;
    uciSettings += `set network.freifunk.enabled='1'\n`;
    uciSettings += `set network.freifunk.ip6prefix='${this.v6Prefix}'\n`;
    // Other interfaces in zone Freifunk
    interfaces.forEach((interf) => {
      uciSettings += `set network.${interf}.ipaddr='${ipAddress}'\n`;
      uciSettings += `set network.${interf}.enabled='1'\n`;
    });
      // Set routing & policies
    uciSettings += `set network.route4_node_subnet.target='${this.v4Prefix}'\n`;
    uciSettings += `set network.rule_node_ip_high_prio.src='${ipAddress}/32'\n`;
    uciSettings += `commit network\n`;
    return uciSettings;
  }


  static firewallInterfaces(firewallConfig) {
    let ret = [];
    Object.keys(firewallConfig).forEach((sectionIndex) => {
      const section = firewallConfig[sectionIndex];
      if (section['.type'] === 'zone' && section.name === 'freifunk') {
        if (Array.isArray(section.network)) {
          ret = ret.concat(section.network);
        } else {
          ret = ret.concat(section.network.split(' '));
        }
      }
    });
    return ret;
  }
}
