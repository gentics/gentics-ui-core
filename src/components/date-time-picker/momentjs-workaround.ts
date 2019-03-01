/**
 * This is a workaround for loading moment JS in TypeScript 3.2 and Angular 7.
 * This is based on https://github.com/rollup/rollup/issues/1267#issuecomment-446681320
 */

import * as moment_ from 'moment';

/** The moment namespace and moment function. */
export const momentjs = (moment_ as any).default || moment_;

/** The Moment class. This must be used as a type instead of momentjs.Moment. */
export type Moment = moment_.Moment;
