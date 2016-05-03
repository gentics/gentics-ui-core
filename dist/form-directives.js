"use strict";
var checkbox_component_1 = require('./components/checkbox/checkbox.component');
var date_time_picker_component_1 = require('./components/date-time-picker/date-time-picker.component');
var input_component_1 = require('./components/input/input.component');
var radio_button_component_1 = require('./components/radio-button/radio-button.component');
var range_component_1 = require('./components/range/range.component');
var select_component_1 = require('./components/select/select.component');
var textarea_component_1 = require('./components/textarea/textarea.component');
/**
 * This file is here to group all the form components and their value accessors into a single
 * variable, to simplify their consumption.
 */
exports.GTX_FORM_DIRECTIVES = [
    checkbox_component_1.Checkbox,
    date_time_picker_component_1.DateTimePicker,
    input_component_1.InputField,
    radio_button_component_1.RadioButton,
    radio_button_component_1.RadioGroup,
    range_component_1.Range,
    select_component_1.Select,
    textarea_component_1.Textarea
];
