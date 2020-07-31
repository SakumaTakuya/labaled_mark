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
  });

  editArea.on('keyup', (_) => {
    const labeler = new LatexLabeler(/\\label{(.*?)}/g, /\\ref{(.*?)}/g);
    const labeledRenderer = new LabeledRenderer(labeler);

    functions.renderImage = functions.renderTable = functions.renderCode = functions.renderHeading = labeledRenderer;

    const md = marked(editArea.getValue());
    previewArea.innerHTML = labeler.resolveReference(md);
  });
}
