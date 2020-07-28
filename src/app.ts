import marked from 'marked';
 
import {LabeledRenderer} from './renderer';
import {LatexLabeler} from './label';
import hljs from "highlight.js";

const labeler = new LatexLabeler(/:(\S*?):/g, /;(\S*?);/g);
const renderer = new LabeledRenderer(labeler);

const div = document.getElementById('mark');
if (div != null) {
    marked.setOptions({
        renderer: renderer,
        highlight: function(code, language) {
          const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
          return hljs.highlight(validLanguage, code).value;
        },
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });

    const md = marked(div.innerHTML);
    div.innerHTML = labeler.resolveReference(md);
}