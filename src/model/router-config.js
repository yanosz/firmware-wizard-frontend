import BaseConfig from './base-config';
import LineInFile from './dto/line-in-file';
import FileUpload from './dto/file-upload';

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

  lineInFiles() {
    const ret = super.lineInFiles();
    ret.push(new LineInFile({
      path: '/etc/shadow',
      regexp: 'root:.*',
      line: `root:${this.passwordHash}:0:0:99999:7:::`,
    }));
    return ret;
  }
  fileUploads() {
    const uploads = super.fileUploads();
    if (this.sshkeys) {
      uploads.push(new FileUpload({
        path: '/etc/dropbear/authorized_keys',
        content: this.sshkeys,
      }));
    }
    return uploads;
  }
}
