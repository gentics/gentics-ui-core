import {Component} from '@angular/core';

@Component({
    templateUrl: './split-button-demo.tpl.html'
})
export class SplitButtonDemo {
    componentSource: string = require('!!raw-loader!../../../components/split-button/split-button.component.ts');

    saveResult: string;

    secondaryActions: string[] = [];
    actionClicked: number;

    buttonIsDisabled: boolean = false;
    secondaryActionIsDisabled: boolean = false;
    clickCount: number = 0;

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
