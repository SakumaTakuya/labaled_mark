import CodeMirror from 'codemirror';
import { readFileAsDataURL } from './util';
import { type } from 'jquery';

export class ImageUploaderForCodeMirror {
  static url = 'https://api.imgur.com/3/image';

  constructor(
    private codemirror: CodeMirror.Editor,
    private clientId: string,
    public uploadingText: string,
    public failerText: string
  ) {}

  private async fetchMarkdown(url: string | null, defaultText: string): Promise<string> {
    let result = defaultText;
    if (url) {
      const data = url.split(',')[1];
      const formData = new FormData();
      formData.append('image', data);
      formData.append('type', 'base64');

      const request = await fetch(ImageUploaderForCodeMirror.url, {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${this.clientId}`,
        },
        body: formData,
      });

      if (request.ok) {
        const json = await request.json();
        const link = json.data?.link as string;

        if (link) {
          result = `![](${link})`;
        }
      }
    }
    return Promise.resolve(result);
  }

  async upload(files: FileList): Promise<void> {
    const pos = this.codemirror.getCursor();

    for (let id = 0; id < files.length; id++) {
      const element = files[id];

      this.codemirror.replaceRange(this.uploadingText, pos);
      const url = await readFileAsDataURL(element);
      const md = await this.fetchMarkdown(typeof url == 'string' ? url : null, this.failerText);

      const repLen = this.uploadingText.length;
      this.codemirror.replaceRange(md, pos, { line: pos.line, ch: pos.ch + repLen });
    }
  }
}
