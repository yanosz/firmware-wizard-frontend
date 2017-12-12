import BaseConfig from './base-config';
import LineInFile from './dto/line-in-file';
import FileUpload from './dto/file-upload';

export default class RouterConfig extends BaseConfig {
  constructor({name, passwordHash, sshkeys, passwordChanged} = {}) {
    super();
    this.name = name;
    this.passwordHash = passwordHash;
    this.sshkeys = sshkeys;
    this.passwordChanged = passwordChanged;
  }

  // For now, its Hostname, only:
  uciSettings(existingUciConfig) {
    return `${super.uciSettings(existingUciConfig)}\n 
    set system.@system[0].hostname='${this.name}'\n 
    commit system \n`;
  }

  lineInFiles(existingUciConfig) {
    const ret = super.lineInFiles(existingUciConfig);
    if (this.passwordChanged) {
      ret.push(new LineInFile({
        path: '/etc/shadow',
        regexp: '^root:.*',
        line: `root:${this.passwordHash}:0:0:99999:7:::`,
      }));
    }
    return ret;
  }
  fileUploads(existingUciConfig) {
    const uploads = super.fileUploads(existingUciConfig);
    if (this.sshkeys) {
      uploads.push(new FileUpload({
        path: '/etc/dropbear/authorized_keys',
        content: this.sshkeys,
      }));
    }
    return uploads;
  }

  get passwordChanged() {
    return this.pwChanged(); // Set callback to avoid serialization
  }
  set passwordChanged(passwordChanged) {
    this.pwChanged = () => (passwordChanged); // Set callback to avoid serialization
  }
}
