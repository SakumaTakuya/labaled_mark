import './index.scss';
import mark from './mark/main';
import layout from './layout/main';

const textArea = document.getElementById('markdown_editor_textarea');
const previewArea = document.getElementById('markdown_preview');
const clientId = '5ade943de98836a';

if (textArea instanceof HTMLTextAreaElement && previewArea) {
  const editor = mark.initEditor(textArea, previewArea, clientId);
}

layout.initSwitcher('.view-switch');
layout.initPrinter('#printer', '#print_area');
