import './style.scss';
import { initSwitcher } from './switch';
import { initPrinter } from './print';

initSwitcher('.view-switch');
initPrinter('#printer', '#print_area');
