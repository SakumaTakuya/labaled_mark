const codeLineClass = 'code-line';
const codeIdClass = 'code-id';
const codeBarClass = 'code-bar';
const codeValueClass = 'code-value';
const codeClass = 'code';
const codeAreaClass = 'code-area';

const defaultLineBreak = /\r\n|\r|\n/g;

export function numbering(code: string, lineBreak?: RegExp): string {
  const hs = code.split(lineBreak || defaultLineBreak).map((value, id) => {
    return `<div class="${codeLineClass}">
                  <span class="${codeIdClass}">${id}.</span class="${codeBarClass}"><span></span><span class="${codeValueClass}">${value}</span>
                </div>`;
  });
  return `<div class="${codeClass}">
            <div class="${codeAreaClass}">
            ${hs.join('\n')}
            </div>
        </div>`;
}
