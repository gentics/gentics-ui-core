import {momentjs} from './momentjs.import';

import * as rome_ from '@bevacqua/rome';
import * as momentum from '@bevacqua/rome/src/momentum';

(window as any).moment = momentjs;
rome_.use(momentjs);
delete (window as any).moment;

if (momentum.moment === void 0) {
  throw new Error('rome depends on moment.js, you can get it at http://momentjs.com.');
}

/** The rome namespace and rome function. */
export const rome = (rome_ as any).default || rome_;