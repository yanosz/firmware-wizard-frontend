// window is there ... thus:
/* eslint-disable no-undef */
export default class LineInFile {
  constructor({path, regexp, line } = {}) {
    this.path = path;
    this.line = line;
    this.regexp = regexp;
  }

  // Take care of base64Encondig

  set line(linep) {
    if (linep && linep.indexOf('~') !== -1) {
        // eslint-disable-next-line no-throw-literal
      throw '~ cannot be used in line of file commands. ~ is reserved for sed in the rpc-service';
    }
    this.line_base64 = window.btoa(unescape(encodeURIComponent(linep || '')));
  }

  set regexp(exp) {
    this.regexp_base64 = window.btoa(unescape(encodeURIComponent(exp || '')));
  }
}
