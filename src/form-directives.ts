import {CONST_EXPR} from 'angular2/src/facade/lang';
import {Type} from 'angular2/core';
import {DateTimePicker} from './components/date-time-picker/date-time-picker.component';
import {InputField} from './components/input/input.component';
import {RadioButton, RadioGroup} from './components/radio-button/radio-button.component';
import {Range} from './components/range/range.component';
import {Select} from './components/select/select.component';
import {Textarea} from './components/textarea/textarea.component';

/**
 * This file is here to group all the form components and their value accessors into a single
 * variable, to simplify their consumption.
 */
export const GTX_FORM_DIRECTIVES: Type[] = CONST_EXPR([
    DateTimePicker,
    InputField,
    Range,
    Select,
    RadioButton,
    RadioGroup,
    Textarea,
    RadioButton,
    Textarea
]);
