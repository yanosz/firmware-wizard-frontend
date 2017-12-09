/**
 * file-Upload DTO: Transfer Object for file uploads" sent to the router.
 * The content is encode using base64
 */
export default class FileUpload {

  constructor({path, content, contentBase64, mode} = {}) {
    this.path = path;
    this.contentBase64 = contentBase64;
    this.mode = mode || '600';
    if (content) {
      this.content = content;
    }
  }
  set content(content) {
// eslint-disable-next-line no-undef
    this.contentBase64 = window.btoa(unescape(encodeURIComponent(content || '')));
  }
}
