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
} from 'angular2/core';
import {
    NgControl,
    ControlValueAccessor
} from 'angular2/common';
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

    private onChange: Function = () => {};
    private onTouched: Function = () => {};

    private radioButtons: RadioButton[] = [];
    private groupID: number;

    get uniqueName(): string {
        return 'group-' + this.groupID;
    }

    constructor(@Optional() private ngControl: NgControl) {
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
 * RadioButton wraps the native <input type=radio> form element.
 * To connect multiple radio buttons with a form via ngControl,
 * wrap them in a {@link RadioGroup} (<gtx-radio-group>).
 */
@Component({
    selector: 'gtx-radio-button',
    template: require('./radio-button.tpl.html')
})
export class RadioButton implements ControlValueAccessor, OnInit, OnDestroy {

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
    @Input() disabled: boolean = false;
    @Input() id: string = 'radio-' + Math.random().toString(36).substr(2);
    @Input() label: string = '';
    @Input() name: string;
    @Input() readonly: boolean = false;
    @Input() required: boolean = false;
    @Input() value: any = '';
    @Input() get withGap(): any {
        return this.materialGap;
    }
    set withGap(gap: any) {
        this.materialGap = isPresent(gap) && gap !== false;
    }

    @Output() blur: EventEmitter<boolean> = new EventEmitter();
    @Output() focus: EventEmitter<boolean> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();

    private materialGap: boolean = false;
    private inputChecked: boolean = false;

    private onChange: Function = () => {};
    private onTouched: Function = () => {};

    constructor(@Optional() control: NgControl,
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
