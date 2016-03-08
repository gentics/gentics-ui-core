import {CONST_EXPR} from 'angular2/src/facade/lang';
import {Type} from 'angular2/core';
import {InputField, GtxInputValueAccessor} from './components/input/input.component';
import {Textarea} from './components/textarea/textarea.component';
import {Select, GtxSelectValueAccessor} from './components/select/select.component';

/**
 * This file is here to group all the form components and their value accessors into a single
 * variable, to simplify their consumption.
 */
export const GTX_FORM_DIRECTIVES : Type[] = CONST_EXPR([
    InputField,
    Select,
    Textarea,
    GtxInputValueAccessor,
    GtxSelectValueAccessor
]);
