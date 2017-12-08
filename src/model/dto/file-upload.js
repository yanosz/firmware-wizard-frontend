import { fromByteArray, toByteArray } from 'base64-js';
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
  get content() {
    return toByteArray(this.contentBase64 || '');
  }
  set content(content) {
    this.contentBase64 = fromByteArray(content || '');
  }
}
