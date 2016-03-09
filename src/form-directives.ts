import {CONST_EXPR} from 'angular2/src/facade/lang';
import {Type} from 'angular2/core';
import {InputField} from './components/input/input.component';
import {RadioButton, RadioGroup} from './components/radio-button/radio-button.component';
import {Textarea} from './components/textarea/textarea.component';
import {Range} from './components/range/range.component';
import {Select} from './components/select/select.component';

/**
 * This file is here to group all the form components and their value accessors into a single
 * variable, to simplify their consumption.
 */
export const GTX_FORM_DIRECTIVES: Type[] = CONST_EXPR([
    InputField,
    Range,
    Select,
    RadioButton,
    RadioGroup,
    Textarea,
    RadioButton,
    Textarea
]);
