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
        const label = this.labeler.registerLabel(text, this.hLabel);

        return `<h${level}>${label.index} ${label.text}</h${level}>`;
    }

    table(header: string, body: string): string {
        if (body) body = `<tbody>${body}</tbody>`;
        const label = this.labeler.registerLabel(header, this.tableLabel);
        return `<table>
                    <caption>
                        表${label.index}.\t${label.caption}
                    </caption>
                    <thead>
                        ${label.text}
                    </thead>
                        ${body}
                </table>`;
    }

    image(href: string | null, title: string | null, text: string): string {
        const label = this.labeler.registerLabel(text, this.imgLabel);
        return `<figure>
                    <img src="${href}" alt="${label.text}">
                    <figcaption>図${label.index}.\t${label.caption}</figcaption>
                </figure>`;
    }

    code(code: string, language: string | undefined, isEscaped: boolean): string {
        const label = this.labeler.registerLabel(language || '', this.codeLabel);
        const html = super.code(code, label.text, isEscaped);
        return `<figure>
                    <figcaption>ソースコード${label.index}.\t${label.caption}</figcaption>
                    ${html}
                </figure>`;
    }
}
