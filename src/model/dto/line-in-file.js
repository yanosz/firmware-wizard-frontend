import {fromByteArray, toByteArray} from 'base64-js';

export default class LineInFile {
  constructor({path, regexp, line } = {}) {
    this.path = path;
    this.line = line;
    this.regexp = regexp;
  }

  // Take care of base64Encondig
  get line() {
    return toByteArray(this.line_base64 || '');
  }
  get regexp() {
    return toByteArray(this.regexp_base64 || '');
  }

  set line(line) {
    this.line_base64 = fromByteArray(line || '');
  }

  set regexp(exp) {
    this.regexp_base64 = fromByteArray(exp || '');
  }
}
