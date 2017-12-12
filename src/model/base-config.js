/* eslint-disable class-methods-use-this,no-unused-vars */
import ExistingUciConfig from './existing-uci-config';

export default class BaseConfig {

    // By default, there are no settings or upads
  uciSettings(existingUciConfig) {
    return '';
  }
  fileUploads(existingUciConfig) {
    return [];
  }

  lineInFiles(existingUciConfig) {
    return [];
  }
}
