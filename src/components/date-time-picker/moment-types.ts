import * as moment from 'moment';

export interface Moment extends moment.Moment {}
export interface MomentStatic {
    (arg?: number): Moment;
    unix: (timestamp: number) => Moment;
    locale: (language: string, definition?: moment.MomentLanguage) => string;
}
