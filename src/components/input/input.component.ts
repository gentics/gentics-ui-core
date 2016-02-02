import {Component, Input} from "angular2/core";

@Component({
    selector: 'gtx-input-field',
    template: `
    <div class="input-field">
        <input [placeholder]="placeholder" [id]="id" [type]="type">
        <label [attr.for]="id">{{ label }}</label>
    </div>
    `
})
export class InputField {

    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() id: string = '';
    @Input() type: string = 'text';
    @Input() value: string = '';
}
