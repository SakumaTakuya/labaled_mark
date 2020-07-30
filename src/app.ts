// BootstrapのJavaScript側の機能を読み込む
import 'bootstrap';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/gfm/gfm.js';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import marked from 'marked';
import hljs from 'highlight.js';
import CodeMirror from 'codemirror';

import {LabeledRenderer} from './renderer';
import {LatexLabeler} from './label';

// スタイルシートを読み込む
import './index.scss';


const textArea = document.getElementById('markdown_editor_textarea') as HTMLTextAreaElement;
const previewArea = document.getElementById('markdown_preview');
if (textArea != null && previewArea != null) {
    const editArea = CodeMirror.fromTextArea(
        textArea, {
            mode: {
                name: "gfm",
            },
            lineNumbers: true,
            lineWrapping : true,
            theme: "default",
        });
    
    editArea.on('keyup', _ => {
        const labeler = new LatexLabeler(/\\label{(.*?)}/g, /\\ref{(.*?)}/g);
        const renderer = new LabeledRenderer(labeler);
        marked.setOptions({
            renderer: renderer,
            highlight: function(code, language) {
              const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
              return hljs.highlightAuto(code, [validLanguage]).value;
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });

        const md = marked(editArea.getValue());
        previewArea.innerHTML = labeler.resolveReference(md);
    });
}