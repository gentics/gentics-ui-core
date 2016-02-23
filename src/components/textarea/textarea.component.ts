import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

/**
 * The Textarea wraps the native <textarea> form element.
 */
@Component({
    selector: 'gtx-textarea',
    template: require('./textarea.tpl.html')
})
export class Textarea {

    // native attributes
    @Input() disabled: boolean = false;
    @Input() maxlength: number;
    @Input() name: string;
    @Input() placeholder: string;
    @Input() readonly: boolean = false;
    @Input() required: boolean = false;

    @Input() value: string = '';
    @Input() label: string = '';
    @Input() id: string;

    // events
    @Output() blur: EventEmitter<string> = new EventEmitter();
    @Output() focus: EventEmitter<string> = new EventEmitter();
    @Output() change: EventEmitter<string> = new EventEmitter();

    onBlur(): void {
        this.blur.emit(this.value);
        this.change.emit(this.value);
    }

    onFocus(): void {
        this.focus.emit(this.value);
    }

    onChange(e: Event): void {
        const target: HTMLInputElement = <HTMLInputElement> e.target;
        this.change.emit(target.value);
    }
}
