// Demo pages
import {ButtonDemo} from './components/button-demo/button-demo';
import {CheckboxDemo} from './components/checkbox-demo/checkbox-demo';
import {ColorsDemo} from './components/colors-demo/colors-demo';
import {ContentsListItemDemo} from './components/contents-list-item-demo/contents-list-item-demo';
import {DateTimePickerDemo} from './components/date-time-picker-demo/date-time-picker-demo';
import {InputDemo} from './components/input-demo/input-demo';
import {ModalDemo} from './components/modal-demo/modal-demo';
import {RadioButtonDemo} from './components/radio-button-demo/radio-button-demo';
import {RangeDemo} from './components/range-demo/range-demo';
import {SearchBarDemo} from './components/search-bar-demo/search-bar-demo';
import {SelectDemo} from './components/select-demo/select-demo';
import {SideMenuDemo} from './components/side-menu-demo/side-menu-demo';
import {SplitViewContainerDemo} from './components/split-view-container-demo/split-view-container-demo';
import {TextareaDemo} from './components/textarea-demo/textarea-demo';
import {TopBarDemo} from './components/top-bar-demo/top-bar-demo';
import {TypographyDemo} from './components/typography-demo/typography-demo';

export interface IDemoItem {
    name: string;
    component: FunctionConstructor;
}

export const demos: IDemoItem[] = [
    {
        name: 'button',
        component: ButtonDemo
    },
    {
        name: 'checkbox',
        component: CheckboxDemo
    },
    {
        name: 'colors',
        component: ColorsDemo
    },
    {
        name: 'contents-list-item',
        component: ContentsListItemDemo
    },
    {
        name: 'date-time-picker',
        component: DateTimePickerDemo
    },
    {
        name: 'input',
        component: InputDemo
    },
    {
        name: 'modal',
        component: ModalDemo
    },
    {
        name: 'radio-button',
        component: RadioButtonDemo
    },
    {
        name: 'range',
        component: RangeDemo
    },
    {
        name: 'search-bar',
        component: SearchBarDemo
    },
    {
        name: 'select',
        component: SelectDemo
    },
    {
        name: 'side-menu',
        component: SideMenuDemo
    },
    {
        name: 'split-view-container',
        component: SplitViewContainerDemo
    },
    {
        name: 'textarea',
        component: TextareaDemo
    },
    {
        name: 'top-bar',
        component: TopBarDemo
    },
    {
        name: 'typography',
        component: TypographyDemo
    }
];

/**
 * Convert "my-best-string" to "MyBestString"
 */
export const kebabToPascal: Function = (str: string): string => {
    let camel: string = str.replace(/\-([a-z])/g, (m) => m[1].toUpperCase());
    return camel.charAt(0).toUpperCase() + camel.slice(1);
};
