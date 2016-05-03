import {
    Attribute,
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    OnDestroy,
    Optional,
    Output,
    Provider,
    Renderer,
    Self,
    forwardRef
} from '@angular/core';
import {
    NgControl,
    ControlValueAccessor
} from '@angular/common';
import {
    CONST_EXPR,
    isPresent
} from 'angular2/src/facade/lang';


/**
 * RadioGroup groups multiple {@link RadioButton} elements together.
 * Use ngControl or ngFormControl to connect it to a form.
 */
@Directive({
    selector: 'gtx-radio-group, [gtx-radio-group]'
})
export class RadioGroup implements ControlValueAccessor {

    private static instanceCounter: number = 0;

    private onChange: Function = (_: any) => {};
    private onTouched: Function = () => {};

    private radioButtons: RadioButton[] = [];
    private groupID: number;

    get uniqueName(): string {
        return 'group-' + this.groupID;
    }

    constructor(@Self() @Optional() private ngControl: NgControl) {
        this.groupID = RadioGroup.instanceCounter++;
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    add(radio: RadioButton): void {
        if (this.radioButtons.indexOf(radio) < 0) {
            this.radioButtons.push(radio);
        }
    }

    remove(radio: RadioButton): void {
        let pos: number = this.radioButtons.indexOf(radio);
        if (pos >= 0) {
            this.radioButtons.splice(pos, 1);
        }
    }

    radioSelected(selected?: RadioButton): void {
        for (let radio of this.radioButtons) {
            if (radio != selected) {
                radio.writeValue(selected ? selected.value : null);
            }
        }
        this.onChange(selected ? selected.value : null);
    }

    writeValue(value: any): void {
        for (let radio of this.radioButtons) {
            radio.writeValue(value);
        }
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }
}


/**
 * RadioButton wraps the native `<input type="radio">` form element.
 * To connect multiple radio buttons with a form via ngControl,
 * wrap them in a {@link RadioGroup} (`<gtx-radio-group>`).
 *
 * ```html
 * <gtx-radio-button [(ngModel)]="val" value="A" label="A"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="B" label="B"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="C" label="C"></gtx-radio-button>
 * ```
 */
@Component({
    selector: 'gtx-radio-button',
    template: require('./radio-button.tpl.html')
})
export class RadioButton implements ControlValueAccessor, OnInit, OnDestroy {

    /**
     * The checked state of the control
     */
    @Input() get checked(): boolean {
        return this.inputChecked;
    }
    set checked(val: boolean) {
        if (val != this.inputChecked) {
            this.inputChecked = val;
            this.change.emit(this.value);
            if (val && this.group) {
                this.group.radioSelected(this);
            }
            if (val) {
                this.onChange(this.value);
            }
        }
    }

    /**
     * The disabled state of the control
     */
    @Input() disabled: boolean = false;

    /**
     * ID of the control
     */
    @Input() id: string = 'radio-' + Math.random().toString(36).substr(2);

    /**
     * Label for the radio button
     */
    @Input() label: string = '';

    /**
     * Name of the input
     */
    @Input() name: string;

    /**
     * Sets the readonly state
     */
    @Input() readonly: boolean = false;

    /**
     * Sets the required state
     */
    @Input() required: boolean = false;

    /**
     * Value associated with this input
     */
    @Input() value: any = '';

    /**
     * Blur event
     */
    @Output() blur: EventEmitter<boolean> = new EventEmitter();

    /**
     * Focus event
     */
    @Output() focus: EventEmitter<boolean> = new EventEmitter();

    /**
     * Change event
     */
    @Output() change: EventEmitter<any> = new EventEmitter();

    private inputChecked: boolean = false;

    private onChange: Function = (_: any) => {};
    private onTouched: Function = () => {};

    constructor(@Self() @Optional() control: NgControl,
                @Optional() private group: RadioGroup,
                @Attribute('ngModel') modelAttrib: string) {

        if (control && !control.valueAccessor) {
            control.valueAccessor = this;
        }

        // Pre-set a common input name for grouped input elements
        if (group) {
            this.name = group.uniqueName;
        } else if (modelAttrib) {
            this.name = modelAttrib;
        }
    }

    onBlur(): void {
        this.blur.emit(this.checked);
        this.onTouched();
    }

    onFocus(): void {
        this.focus.emit(this.checked);
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    writeValue(value: any): void {
        let wasChecked: boolean = this.checked;
        this.inputChecked = (value === this.value);
        if (wasChecked && !this.inputChecked) {
            this.change.emit(false);
            if (this.group) {
                this.group.radioSelected(null);
            }
        }
    }

    ngOnInit(): void {
        if (this.inputChecked) {
            this.onChange(this.value);
        }

        if (this.group) {
            this.group.add(this);
            if (this.inputChecked) {
                this.group.radioSelected(this);
            }
        }
    }

    ngOnDestroy(): void {
        if (this.group) {
            this.group.remove(this);
        }
    }

    private onInputChecked(): void {
        this.inputChecked = true;
        this.change.emit(this.value);
        if (this.group) {
            this.group.radioSelected(this);
        }
        this.onChange(this.value);
    }
}
