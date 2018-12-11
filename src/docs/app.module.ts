import {NgModule, ModuleWithProviders} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {GenticsUICoreModule} from '../module';
import {App} from './app.component';
import {routes} from './app.routes';
import {BreadcrumbsDemo} from './pages/breadcrumbs-demo/breadcrumbs-demo';
import {ButtonDemo} from './pages/button-demo/button-demo';
import {CheckboxDemo} from './pages/checkbox-demo/checkbox-demo';
import {ColorsDemo} from './pages/colors-demo/colors-demo';
import {ContentsListItemDemo} from './pages/contents-list-item-demo/contents-list-item-demo';
import {DateTimePickerDemo} from './pages/date-time-picker-demo/date-time-picker-demo';
import {DateTimePickerControlsDemo} from './pages/date-time-picker-controls-demo/date-time-picker-controls-demo';
import {DemoFormatProvider} from './pages/date-time-picker-demo/demo-format-provider';
import {DropdownListDemo} from './pages/dropdown-list-demo/dropdown-list-demo';
import {FileDropAreaDemo} from './pages/file-drop-area-demo/file-drop-area-demo';
import {FilePickerDemo} from './pages/file-picker-demo/file-picker-demo';
import {GridDemo} from './pages/grid-demo/grid-demo';
import {IconsDemo} from './pages/icons-demo/icons-demo';
import {InputDemo} from './pages/input-demo/input-demo';
import {Instructions} from './pages/instructions/instructions';
import {MenuToggleButtonDemo} from './pages/menu-toggle-button-demo/menu-toggle-button-demo';
import {ModalServiceDemo, MyModal} from './pages/modal-service-demo/modal-service-demo';
import {NotificationDemo} from './pages/notification-demo/notification-demo';
import {OverlayHostDemo} from './pages/overlay-host-demo/overlay-host-demo';
import {ProgressBarDemo} from './pages/progress-bar-demo/progress-bar-demo';
import {RadioButtonDemo} from './pages/radio-button-demo/radio-button-demo';
import {RangeDemo} from './pages/range-demo/range-demo';
import {SearchBarDemo} from './pages/search-bar-demo/search-bar-demo';
import {SelectDemo} from './pages/select-demo/select-demo';
import {SideMenuDemo} from './pages/side-menu-demo/side-menu-demo';
import {SortableListDemo} from './pages/sortable-list-demo/sortable-list-demo';
import {SplitViewContainerDemo} from './pages/split-view-container-demo/split-view-container-demo';
import {TabsDemo} from './pages/tabs-demo/tabs-demo';
import {TextareaDemo} from './pages/textarea-demo/textarea-demo';
import {TopBarDemo} from './pages/top-bar-demo/top-bar-demo';
import {TreeDemo} from './pages/tree-demo/tree-demo';
import {TypographyDemo} from './pages/typography-demo/typography-demo';
import {Autodocs} from './components/autodocs/autodocs.component';
import {AutodocTable} from './components/autodocs/autodoc-table.component';
import {DemoBlock} from './components/demo-block/demo-block.component';
import {HighlightedCode} from './components/highlighted-code/highlighted-code.component';
import {TrustedHTMLPipe} from './components/trusted-html/trusted-html.pipe';

const DEMO_APP_PAGES: any[] = [
    BreadcrumbsDemo,
    ButtonDemo,
    CheckboxDemo,
    ColorsDemo,
    ContentsListItemDemo,
    DateTimePickerDemo,
    DateTimePickerControlsDemo,
    DemoFormatProvider,
    DropdownListDemo,
    FileDropAreaDemo,
    FilePickerDemo,
    GridDemo,
    IconsDemo,
    InputDemo,
    Instructions,
    MenuToggleButtonDemo,
    ModalServiceDemo,
    MyModal,
    NotificationDemo,
    OverlayHostDemo,
    ProgressBarDemo,
    RadioButtonDemo,
    RangeDemo,
    SearchBarDemo,
    SelectDemo,
    SideMenuDemo,
    SortableListDemo,
    SplitViewContainerDemo,
    TabsDemo,
    TextareaDemo,
    TopBarDemo,
    TreeDemo,
    TypographyDemo
];

const DEMO_APP_DECLARATIONS: any[] = [
    Autodocs,
    AutodocTable,
    DemoBlock,
    HighlightedCode,
    TrustedHTMLPipe,
    App
];

export const declarations = [...DEMO_APP_PAGES, ...DEMO_APP_DECLARATIONS];
export const routerModuleForRoot: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        routerModuleForRoot,
        GenticsUICoreModule.forRoot()
    ],
    declarations,
    entryComponents: [MyModal],
    bootstrap: [App]
})
export class DocsModule {}
