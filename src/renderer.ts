import * as marked from 'marked';
import * as label from './label';

export interface HeadingRenderer {
    heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6, raw: string, slugger: marked.Slugger): string;
}

export interface CodeRenderer {
    code (code : string, infostring : string, escaped : boolean) : string;
}

export interface ImageRenderer {
    image(href: string | null, title: string | null, text: string): string;
}

export interface TableRenderer {
    table(header: string, body: string): string;
}

export interface BlockquoteRenderer{
    blockquote (quote : string) : string;
}

export interface HtmlRenderer {
    html (html : string) : string;
}

export interface HrRenderer {
    hr () : string;
}

export interface ListRenderer {
    list (body : string, ordered : boolean, start : number) : string;
}

export interface ListitemRenderer {
    listitem (text : string) : string;
}

export interface CheckboxRenderer{
    checkbox (checked : boolean) : string
}

export interface ParagraphRenderer{ 
    paragraph (text : string) : string
}

export interface TablerowRenderer{
    tablerow (content : string) : string
}

export interface TablecellRenderer{
    tablecell (content : string, flags : { header: boolean; align: "center" | "left" | "right" | null; }) : string;
}

export class LabeledRenderer extends marked.Renderer implements HeadingRenderer, CodeRenderer, ImageRenderer, TableRenderer{
    private imgLabel = new label.NumericalLabel();
    private tableLabel = new label.NumericalLabel();
    private codeLabel = new label.NumericalLabel();
    private hLabel = new label.ArrayLabel(6);

    constructor(private labeler : label.Labeler, options?: marked.MarkedOptions) {
        super(options);
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


export class BorderTableRender implements TablecellRenderer {
    tablecell(content: string, flags: {header: boolean; align: "center" | "left" | "right" | null;}): string {
        let style = '';
        function replace(match :string, p1:string, p2:string, p3:string,offset:number, str:string) : string{
            style += /\|/.test(p1) ? 'border-left: solid 1px black;' : '';
            style += /_/.test(p1) ? 'border-top: solid 1px black;': '';
            style += /\|/.test(p3) ? 'border-right: solid 1px black;' : '';
            style += /_/.test(p3) ? 'border-bottom: solid 1px black;': '';
            return p2;
        }

        content = content.replace(/^([\||_]*)(.*?)([\||_]*)$/, replace);
        style = style ? ` style="${style}"` : '';

        const type = flags.header ? 'th' : 'td';
        const align = flags.align ? ` align=${flags.align}` : '';
        return `<${type}${align}${style}>${content}</${type}>\n`;
    }
}


export interface RenderFunctions {
    renderCode? : CodeRenderer;
    renderBlockquote? : BlockquoteRenderer;
    renderHtml? : HtmlRenderer;
    renderHeading? : HeadingRenderer;
    renderHr? : HrRenderer;
    renderList? : ListRenderer;
    renderListitem? : ListitemRenderer;
    renderCheckbox? : CheckboxRenderer;
    renderParagraph? : ParagraphRenderer;
    renderTable? : TableRenderer;
    renderTablerow? : TablerowRenderer;
    renderTablecell? : TablecellRenderer;
    renderImage? : ImageRenderer;
}

export class CustomizableRenderer extends marked.Renderer {
    functions : RenderFunctions;

    constructor(functions? : RenderFunctions) {
        super();
        this.functions = functions || {};
    }

    code (code : string, infostring : string, escaped : boolean) : string {
        return  this.functions.renderCode?.code(code, infostring, escaped) || 
                super.code(code, infostring, escaped);
    }

    blockquote (quote : string) : string {
        return  this.functions.renderBlockquote?.blockquote(quote) ||
                super.blockquote(quote);
    }

    html (html : string) : string {
        return  this.functions.renderHtml?.html(html) ||
                super.html(html);
    }

    heading (text : string, level : 1 | 2 | 3 | 4 | 5 | 6, raw : string, slugger : marked.Slugger) : string {
        return  this.functions.renderHeading?.heading(text, level, raw, slugger) ||
                super.heading(text, level, raw, slugger);
    }

    hr () : string {
        return  this.functions.renderHr?.hr() || 
                super.hr();
    }

    list (body : string, ordered : boolean, start : number) : string {
        return  this.functions.renderList?.list(body, ordered, start) ||
                super.list(body, ordered, start);
    }

    listitem (text : string) : string {
        return  this.functions.renderListitem?.listitem(text) ||
                super.listitem(text);
    }

    checkbox (checked : boolean) : string {
        return  this.functions.renderCheckbox?.checkbox(checked) ||
                super.checkbox(checked);
    }

    paragraph (text : string) : string {
        return  this.functions.renderParagraph?.paragraph(text) ||
                super.paragraph(text);
    }

    table (header : string, body : string) : string {
        return  this.functions.renderTable?.table(header, body) ||
                super.table(header, body);
    }

    tablerow (content : string) : string {
        return  this.functions.renderTablerow?.tablerow(content) ||
                super.tablerow(content);
    }

    tablecell (content : string, flags : { header: boolean; align: "center" | "left" | "right" | null; }) : string {
        return  this.functions.renderTablecell?.tablecell(content, flags) ||
                super.tablecell(content, flags);
    }

    image(href: string | null, title: string | null, text: string): string {
        return  this.functions.renderImage?.image(href, title, text) ||
                super.image(href, title, text);
    }
}