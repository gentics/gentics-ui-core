import {Component} from "angular2/core";
import {InputField} from "../components/input/input.component";

@Component({
    selector: 'app',
    template: `
    <h1>Gentics UI Core Demo</h1>
    <gtx-input-field placeholder="test input" type="number" label="An Input Label"></gtx-input-field>
    `,
    directives: [InputField]
})
export class App {

}