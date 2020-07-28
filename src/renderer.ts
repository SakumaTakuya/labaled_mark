import * as marked from 'marked';
import * as label from './label';

export class LabeledRenderer extends marked.Renderer {
    private imgLabel = new label.NumericalLabel();
    private tableLabel = new label.NumericalLabel();
    private codeLabel = new label.NumericalLabel();
    private hLabel = new label.ArrayLabel(6);

    constructor(private labeler : label.Labeler) {
        super();
    }

    heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6, raw: string, slugger: marked.Slugger): string {
        this.hLabel.level = level;
        const label = this.labeler.label(text, this.hLabel);

        return `<h${level}>${label.index} ${label.text}</h${level}>`;
    }

    table(header: string, body: string): string {
        if (body) body = `<tbody>${body}</tbody>`;
        const label = this.labeler.label(header, this.tableLabel);
        return `<table>
                    <caption>
                        表${label.index}. ${label.caption}
                    </caption>
                    <thead>
                        ${label.text}
                    </thead>
                        ${body}
                </table>`;
    }

    image(href: string | null, title: string | null, text: string): string {
        const label = this.labeler.label(text, this.imgLabel);
        return `<figure>
                    <img src="${href}" alt="${label.text}">
                    <figcaption>図${label.index}. ${label.caption}</figcaption>
                </figure>`;
    }

    code(code: string, language: string | undefined, isEscaped: boolean): string {
        const test = super.code(code, language, isEscaped);
        return test;
    }
    
}
