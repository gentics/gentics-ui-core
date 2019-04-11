import {Component} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    selector: 'split-button-demo',
    templateUrl: './split-button-demo.tpl.html'
})
export class SplitButtonDemo {
    componentSource: string = require('!!raw-loader!../../../components/split-button/split-button.component.ts');

    saveResult: string;

    secondaryActions: string[] = [];
    actionClicked: number;

    buttonIsDisabled: boolean = false;
    clickCount: number = 0;

    formResult: any;
    demoForm = new FormGroup({
        firstName: new FormControl('John'),
        lastName: new FormControl('Doe')
    });

    incrementCounter(): void {
        ++this.clickCount;
    }

    save(): void {
        this.saveResult = 'Save clicked!';
    }

    saveAndPublish(): void {
        this.saveResult = 'Save and Publish clicked!';
    }

    saveAndEmail(): void {
        this.saveResult = 'Save and Send via E-Mail';
    }

    addSecondaryAction(): void {
        this.secondaryActions.push('Secondary Action');
    }

    removeSecondaryAction(): void {
        this.secondaryActions.pop();
    }

    onActionClick(actionId: number): void {
        this.actionClicked = actionId;
    }

}
