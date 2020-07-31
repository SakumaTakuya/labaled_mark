import $ from 'jquery';

export function initSwitcher(target: string): void {
  $(target)
    .find('input')
    .click((event) => {
      const show = $(event.target).data('show') || '';
      const hide = $(event.target).data('hide') || '';

      $(show).show();
      $(hide).hide();
    });
}
