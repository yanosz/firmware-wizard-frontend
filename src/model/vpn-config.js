import BaseConfig from './base-config';
import TunnelOperator from './tunnel-operator';
import FileUpload from './dto/file-upload';

export default class VpnConfig extends BaseConfig {

  constructor(tunnelOperator) {
    super();
    this.tunnelOperator = tunnelOperator;
  }

  uciSettings() {
    let result = super.uciSettings();
    if (this.tunnelOperator) {
      TunnelOperator.allOperators().forEach((op) => {
        if (op.uciFlag) {
          result += `set openvpn.${op.uciFlag}.enabled = ${(op.name === this.tunnelOperator.name) ? 1 : 0}\n`;
        }
      });
      result += 'commit openvpn\n';
    }
    return result;
  }

  fileUploads() {
    const fileUploads = super.fileUploads();
    // 1st: Regular Uploads chosen by user
    if (this.tunnelOperator.uploads) {
      this.tunnelOperator.uploads.forEach((upload) => {
        if (upload.dest && upload.fileContent) {
          fileUploads.push(new FileUpload({
            path: upload.dest,
            contentBase64: upload.fileContent,
          }));
        }
      });
    }
    // 2nd: Fields resulting in Uploads
    if (this.tunnelOperator.fields) {
      this.tunnelOperator.fields.forEach((field) => {
        console.log('Checking field', field);
        if (field.toFile) {
          fileUploads.push(new FileUpload({
            path: field.toFile,
            content: field.input,
          }));
        }
      });
    }

    return fileUploads;
  }

  debug() {
    console.log('VpnConfig:', this);
  }
}

