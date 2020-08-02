import $ from 'jquery';

export function copy(str: string): void {
  $(document.body).append(`
    <textarea id="__tmp_copy__" style="position:fixed;right:100vw;font-size:16px;" readonly="readonly">
    ${str}
    </textarea>
  `);
  const $elm = $('#__tmp_copy__');
  $elm.select();
  document.execCommand('copy', true);
  $($elm).remove();
}
