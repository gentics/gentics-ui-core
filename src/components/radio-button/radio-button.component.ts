import {
    Attribute,
    Component,
    Directive,
    EventEmitter,
    Input,
    OnInit,
    OnDestroy,
    Optional,
    Output,
    forwardRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


const GTX_RADIO_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroup),
    multi: true
};

const GTX_RADIO_BUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButton),
    multi: true
};

/**
 * RadioGroup groups multiple {@link RadioButton} elements together.
 * Use ngModel to connect it to a form model.
 */
@Directive({
    selector: 'gtx-radio-group, [gtx-radio-group]',
    providers: [GTX_RADIO_GROUP_VALUE_ACCESSOR]
})
export class RadioGroup implements ControlValueAccessor {

    private static instanceCounter: number = 0;

    private radioButtons: RadioButton[] = [];
    private groupID: number;

    get uniqueName(): string {
        return 'group-' + this.groupID;
    }

    constructor() {
        this.groupID = RadioGroup.instanceCounter++;
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
        // setTimeout because this method is invoked from a child component (RadioButton), which is the wrong direction
        // for change propagation (which should normally always be parent -> child). If we synchronously now update the
        // ngModel value, we will cause "changed after checked" errors in dev mode.
        setTimeout(() => {
            this.onChange(selected ? selected.value : null);
        });
    }

    writeValue(value: any): void {
        for (let radio of this.radioButtons) {
            radio.writeValue(value);
        }
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    private onTouched: Function = () => {};
    private onChange: Function = (_: any) => {};
}


/**
 * RadioButton wraps the native `<input type="radio">` form element.
 * To connect multiple radio buttons with a form via ngModel,
 * wrap them in a {@link RadioGroup} (`<gtx-radio-group>`).
 *
 * ```html
 * <gtx-radio-button [(ngModel)]="val" value="A" label="A"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="B" label="B"></gtx-radio-button>
 * <gtx-radio-button [(ngModel)]="val" value="C" label="C"></gtx-radio-button>
 * ```
 *
 * ##### Stateless Mode
 * By default, the RadioButton keeps track of its own internal checked state. This makes sense
 * for most use cases, such as when used in a form bound to ngModel.
 *
 * However, in some cases we want to explicitly set the state from outside. This is done by binding
 * to the <code>checked</code> attribute. When this attribute is bound, the checked state of the
 * RadioButton will *only* change when the value of the binding changes. Clicking on the RadioButton
 * will have no effect other than to emit an event which the parent can use to update the binding.
 *
 * Here is a basic example of a stateless RadioButton where the parent component manages the state:
 *
 * ```html
 * <gtx-radio-button [checked]="isChecked"></gtx-checkbox>
 * ```
 */
@Component({
    selector: 'gtx-radio-button',
    templateUrl: './radio-button.tpl.html',
    providers: [GTX_RADIO_BUTTON_VALUE_ACCESSOR]
})
export class RadioButton implements ControlValueAccessor, OnInit, OnDestroy {
    /**
     * Sets the radio button to be auto-focused. Handled by `AutofocusDirective`.
     */
    @Input() autofocus: boolean = false;

    /**
     * The checked state of the control. When set, the RadioButton will be
     * in stateless mode.
     */
    @Input() get checked(): boolean {
        return this.inputChecked;
    }
    set checked(val: boolean) {
        this.statelessMode = true;
        if (val != this.inputChecked) {
            this.inputChecked = val === true || <any> val === 'true';
            this.change.emit(this.value);
            if (val && this.group) {
                this.group.radioSelected(this);
            }
            if (val) {
                this.onChange(this.value);
            } else if (val === false) {
                if (this.group) {
                    this.group.radioSelected(null);
                }
                this.onChange(false);
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
    @Input() id: string = randomID();

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
    @Output() blur = new EventEmitter<boolean>(true);

    /**
     * Focus event
     */
    @Output() focus = new EventEmitter<boolean>(true);

    /**
     * Change event
     */
    @Output() change = new EventEmitter<any>(true);

    private inputChecked: boolean = false;
    /**
     * See note above on stateless mode.
     */
    private statelessMode: boolean = false;

    constructor(@Optional() private group: RadioGroup,
                @Attribute('ngModel') modelAttrib: string) {

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

    writeValue(value: any): void {
        let wasChecked: boolean = this.checked;
        this.inputChecked = (value === this.value);
        if (wasChecked && !this.inputChecked) {
            this.change.emit(false);
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

    onInputChecked(e: Event, input: HTMLInputElement): boolean {
        if (e) {
            e.stopPropagation();
        }
        if (this.statelessMode) {
            let newState = input.checked;
            if (input.checked !== this.inputChecked) {
                input.checked = !!this.inputChecked;
            }
            this.change.emit(newState);
            return false;
        }

        this.inputChecked = true;
        this.change.emit(this.value);
        if (this.group) {
            this.group.radioSelected(this);
        }
        this.onChange(this.value);
        return true;
    }

    registerOnChange(fn: Function): void { this.onChange = fn; }
    registerOnTouched(fn: Function): void { this.onTouched = fn; }

    private onChange: Function = (_: any) => {};
    private onTouched: Function = () => {};
}

function randomID(): string {
    return 'radio-' + Math.random().toString(36).substr(2);
}
