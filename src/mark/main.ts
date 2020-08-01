// BootstrapのJavaScript側の機能を読み込む
import 'bootstrap';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/gfm/gfm.js';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import marked, { Renderer } from 'marked';
import hljs from 'highlight.js';
import CodeMirror from 'codemirror';

import {
  LabeledRenderer,
  BorderTableRenderer,
  RenderFunctions,
  CustomizableRenderer,
} from './renderer';
import { LatexLabeler } from './label';

// スタイルシートを読み込む
import './style.scss';

import $ from 'jquery';

const functions = {
  renderTablecell: new BorderTableRenderer(),
} as RenderFunctions;

marked.setOptions({
  renderer: new CustomizableRenderer(functions),
  highlight: function (code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlightAuto(code, [validLanguage]).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

const textArea = document.getElementById('markdown_editor_textarea') as HTMLTextAreaElement;
const previewArea = document.getElementById('markdown_preview');
if (textArea != null && previewArea != null) {
  const editArea = CodeMirror.fromTextArea(textArea, {
    mode: {
      name: 'gfm',
    },
    lineNumbers: true,
    lineWrapping: true,
    theme: 'custom',
    dragDrop: true,
    allowDropFileTypes: ['image/png', 'image/jpeg'],
  });

  editArea.on('keyup', () => {
    const labeler = new LatexLabeler(/\\label{(.*?)}/g, /\\ref{(.*?)}/g);
    const labeledRenderer = new LabeledRenderer(labeler);

    functions.renderImage = functions.renderTable = functions.renderCode = functions.renderHeading = labeledRenderer;

    const md = marked(editArea.getValue());
    previewArea.innerHTML = labeler.resolveReference(md);
  });

  const url = 'https://api.imgur.com/3/image';

  editArea.on('drop', (codemirror, event) => {
    event.preventDefault();

    const pos = codemirror.getCursor();
    const reader = new FileReader();

    reader.onload = (res) => {
      $.ajax({
        url: 'https://api.imgur.com/3/upload',
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 5ade943de98836a',
        },
        data: {
          image: reader.result,
          type: 'base64',
        },
      }).then(
        (resp) => {
          const link = resp?.data?.link as string;
          codemirror.replaceRange(link ? `![](${link})` : '![failed to upload]()', pos);
        },
        () => {
          console.log('ajax error');
          codemirror.replaceRange('![failed to upload]()', pos);
        }
      );
    };

    reader.onerror = reader.onabort = () => {
      console.log('read error');
      codemirror.replaceRange('![failed to upload]()', pos);
    };

    const files = event.dataTransfer?.files || [];
    for (let id = 0; id < files.length; id++) {
      const element = files[id];
      reader.readAsDataURL(element);
    }
  });
}
