import './index.scss';
import mark from './mark/main';
import layout from './layout/main';
import { encodeDataToUrl, decodeUrlToData } from './save/converter';
import { compress, decompress } from './save/lzma';

layout.initSwitcher('.view-switch');
layout.initPrinter('#printer', '#print_area');

const textArea = document.getElementById('markdown_editor_textarea');
const previewArea = document.getElementById('markdown_preview');
const clientId = '5ade943de98836a';

if (textArea instanceof HTMLTextAreaElement && previewArea) {
  const editor = mark.initEditor(textArea, previewArea, clientId);
  layout.initCopier('#copier', async () => {
    return await encodeDataToUrl(editor.getValue());
  });

  decodeUrlToData().then((data) => {
    const pos = editor.getCursor();
    editor.replaceRange(data, pos);
  });
}
