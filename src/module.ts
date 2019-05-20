import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ConfigService, optionsConfig, PredefinedConfig, CustomConfig, defaultConfig, configFactory} from './module.config';
import {Breadcrumbs} from './components/breadcrumbs/breadcrumbs.component';
import {Button} from './components/button/button.component';
import {Checkbox} from './components/checkbox/checkbox.component';
import {ContentsListItem} from './components/contents-list-item/contents-list-item.component';
import {DateTimePickerControls} from './components/date-time-picker/date-time-picker-controls.component';
import {DateTimePickerFormatProvider} from './components/date-time-picker/date-time-picker-format-provider.service';
import {DateTimePickerModal} from './components/date-time-picker/date-time-picker-modal.component';
import {DateTimePicker} from './components/date-time-picker/date-time-picker.component';
import {DropdownContentWrapper} from './components/dropdown-list/dropdown-content-wrapper.component';
import {DropdownContent} from './components/dropdown-list/dropdown-content.component';
import {DropdownItem} from './components/dropdown-list/dropdown-item.component';
import {DropdownList} from './components/dropdown-list/dropdown-list.component';
import {DropdownTriggerDirective} from './components/dropdown-list/dropdown-trigger.directive';
import {ScrollMask} from './components/dropdown-list/scroll-mask.component';
import {DragStateTrackerFactory} from './components/file-drop-area/drag-state-tracker.service';
import {FileDropArea} from './components/file-drop-area/file-drop-area.directive';
import {MatchesMimeTypePipe} from './components/file-drop-area/matches-mime-type.pipe';
import {PageFileDragHandler} from './components/file-drop-area/page-file-drag-handler.service';
import {PreventFileDrop} from './components/file-drop-area/prevent-file-drop.directive';
import {FilePicker} from './components/file-picker/file-picker.component';
import {GroupedTabs} from './components/grouped-tabs/grouped-tabs.component';
import {GtxTabContent} from './components/grouped-tabs/tab-content';
import {TabGroup} from './components/grouped-tabs/tab-group.component';
import {GtxTabLabel} from './components/grouped-tabs/tab-label';
import {TabPane} from './components/grouped-tabs/tab-pane.component';
import {Icon} from './components/icon/icon.directive';
import {InputField} from './components/input/input.component';
import {MenuToggleButton} from './components/menu-toggle-button/menu-toggle-button.component';
import {BlankModal} from './components/modal/blank-modal.component';
import {DynamicModalWrapper} from './components/modal/dynamic-modal-wrapper.component';
import {ModalDialog} from './components/modal/modal-dialog.component';
import {ModalService} from './components/modal/modal.service';
import {UserAgentRef} from './components/modal/user-agent-ref';
import {Notification} from './components/notification/notification.service';
import {Toast} from './components/notification/toast.component';
import {OverlayHost} from './components/overlay-host/overlay-host.component';
import {OverlayHostService} from './components/overlay-host/overlay-host.service';
import {ProgressBar} from './components/progress-bar/progress-bar.component';
import {RadioButton, RadioGroup} from './components/radio-button/radio-button.component';
import {Range} from './components/range/range.component';
import {SearchBar} from './components/search-bar/search-bar.component';
import {SelectOption, SelectOptionGroup} from './components/select/option.component';
import {Select} from './components/select/select.component';
import {SideMenu, SideMenuToggle} from './components/side-menu/side-menu.component';
import {SortableItem, SortableList, SortableListDragHandle} from './components/sortable-list/sortable-list.component';
import {SplitButtonPrimaryAction} from './components/split-button/split-button-primary-action.component';
import {SplitButton} from './components/split-button/split-button.component';
import {SplitViewContainer} from './components/split-view-container/split-view-container.component';
import {Tab} from './components/tabs/tab.component';
import {Tabs} from './components/tabs/tabs.component';
import {Textarea} from './components/textarea/textarea.component';
import {TopBar} from './components/top-bar/top-bar.component';
import {AutofocusDirective} from './directives/autofocus/autofocus.directive';

export const UI_CORE_COMPONENTS: any[] = [
    AutofocusDirective,
    BlankModal,
    Breadcrumbs,
    Button,
    Checkbox,
    ContentsListItem,
    DateTimePicker,
    DateTimePickerControls,
    DateTimePickerModal,
    DropdownList,
    DropdownContentWrapper,
    DropdownContent,
    DropdownItem,
    DropdownTriggerDirective,
    DynamicModalWrapper,
    FileDropArea,
    FilePicker,
    GroupedTabs,
    Icon,
    InputField,
    MenuToggleButton,
    ModalDialog,
    OverlayHost,
    PreventFileDrop,
    ProgressBar,
    RadioButton,
    RadioGroup,
    Range,
    ScrollMask,
    SearchBar,
    Select,
    SelectOption,
    SelectOptionGroup,
    SideMenu,
    SideMenuToggle,
    SortableItem,
    SortableList,
    SortableListDragHandle,
    SplitButton,
    SplitButtonPrimaryAction,
    SplitViewContainer,
    Tab,
    Tabs,
    TabPane,
    TabGroup,
    Textarea,
    TopBar,
    Toast
];

export const UI_CORE_DIRECTIVES: any[] = [
    GtxTabLabel,
    GtxTabContent
];

export const UI_CORE_ENTRY_COMPONENTS: any[] = [
    BlankModal,
    DateTimePickerModal,
    DropdownContentWrapper,
    DynamicModalWrapper,
    ScrollMask,
    Toast,
    ModalDialog
];

export const UI_CORE_PIPES: any[] = [
    MatchesMimeTypePipe
];

export const UI_CORE_PROVIDERS: any[] = [
    DateTimePickerFormatProvider,
    DragStateTrackerFactory,
    ModalService,
    Notification,
    OverlayHostService,
    PageFileDragHandler,
    UserAgentRef
];

export const declarations = [...UI_CORE_COMPONENTS, ...UI_CORE_DIRECTIVES, ...UI_CORE_PIPES];
export const routerModuleForChild: ModuleWithProviders = RouterModule.forChild([]);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routerModuleForChild,
    ],
    declarations,
    entryComponents: UI_CORE_ENTRY_COMPONENTS,
    exports: declarations
})
export class GenticsUICoreModule {
    /**
     * Gentics UI Core exposes several providers which are intended to be used a singleton services, i.e. there should only
     * be a single instance of each in an app. When this module is imported into lazy-loaded child modules, we do not want
     * to include those providers, otherwise the app injector would create new instances of them to use in that child
     * module.
     *
     * Therefore this method should be used only once in the app, at the level of the root module to ensure that only one
     * instance of each provider is instantiated.
     */
    static forRoot(configValue?: optionsConfig | (() => optionsConfig)): ModuleWithProviders {
        return {
            ngModule: GenticsUICoreModule,
            providers: [
                {
                    provide: CustomConfig,
                    useValue: configValue,
                },
                {
                    provide: PredefinedConfig,
                    useValue: defaultConfig,
                },
                {
                    provide: ConfigService,
                    useFactory: configFactory,
                    deps: [PredefinedConfig, CustomConfig],
                },
                ...UI_CORE_PROVIDERS
            ]
        };
    }
}