import $ from 'jquery';

export function initPrinter(target: string, printArea: string): void {
  $(target).click((event) => {
    event.preventDefault();
    const print = $(event.target).data('target');

    if (typeof print == 'string') {
      let $print = $(print);
      const $baseParent = $(print).parent();

      $print = $print.appendTo(printArea);
      window.print();
      $print.appendTo($baseParent);
    }
  });
}
