import BaseConfig from './base-config';
import TunnelOperator from './tunnel-operator';
import FileUpload from './dto/file-upload';
import LineInFile from './dto/line-in-file';

export default class VpnConfig extends BaseConfig {

  constructor(tunnelOperator) {
    super();
    this.tunnelOperator = tunnelOperator;
  }

  uciSettings(existingUciConfig) {
    let result = super.uciSettings(existingUciConfig);
    if (this.tunnelOperator) {
      TunnelOperator.allOperators().forEach((op) => {
        if (op.name) {
          result += `set openvpn.${op.name}.enabled='${(op.name === this.tunnelOperator.name) ? 1 : 0}'\n`;
        }
      });
      result += 'commit openvpn\n';
    }
    return result;
  }

  fileUploads(existingUciConfig) {
    const fileUploads = super.fileUploads(existingUciConfig);
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
    return fileUploads;
  }

  lineInFiles(existingUciConfig) {
    const lineInFiles = super.lineInFiles(existingUciConfig);
    if (this.tunnelOperator.fields) {
      this.tunnelOperator.fields.forEach((field) => {
        if (field.lineInFile) {
          lineInFiles.push(new LineInFile({
            path: field.lineInFile.path,
            line: field.input,
            regexp: field.lineInFile.regexp,
          }));
        }
      });
    }
    return lineInFiles;
  }
}

