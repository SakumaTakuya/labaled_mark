// BootstrapのJavaScript側の機能を読み込む
import "bootstrap";

import marked from 'marked';
import hljs from "highlight.js";

import {LabeledRenderer} from './renderer';
import {LatexLabeler} from './label';
import "./fitarea";

// スタイルシートを読み込む
import "./index.scss";

hljs.initHighlightingOnLoad();

const edit_area = document.getElementById('markdown_editor_textarea') as HTMLTextAreaElement;
const preview_area = document.getElementById('markdown_preview');
if (edit_area != null && preview_area != null) {
    edit_area.addEventListener('keyup', _ => {
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

        const md = marked(edit_area.value);
        preview_area.innerHTML = labeler.resolveReference(md);
    });
}