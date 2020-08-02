import $ from 'jquery';
import { copy } from './util';

export function initCopier(target: string, getCopyee: () => Promise<string>): void {
  $(target).click(async (event) => {
    event.preventDefault();
    const copyee = await getCopyee();
    copy(copyee);
    console.log(copyee);
  });
}
