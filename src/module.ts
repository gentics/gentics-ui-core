import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {Breadcrumbs} from './components/breadcrumbs/breadcrumbs.component';
import {Button} from './components/button/button.component';
import {Checkbox} from './components/checkbox/checkbox.component';
import {ContentsListItem} from './components/contents-list-item/contents-list-item.component';
import {DateTimePicker} from './components/date-time-picker/date-time-picker.component';
import {DropdownList} from './components/dropdown-list/dropdown-list.component';
import {FileDropArea} from './components/file-drop-area/file-drop-area.directive';
import {DragStateTrackerFactory} from './components/file-drop-area/drag-state-tracker.service';
import {PageFileDragHandler} from './components/file-drop-area/page-file-drag-handler.service';
import {MatchesMimeTypePipe} from './components/file-drop-area/matches-mime-type.pipe';
import {FilePicker} from './components/file-picker/file-picker.component';
import {InputField} from './components/input/input.component';
import {MenuToggleButton} from './components/menu-toggle-button/menu-toggle-button.component';
import {DynamicModalWrapper} from './components/modal/dynamic-modal-wrapper.component';
import {ModalService} from './components/modal/modal.service';
import {ModalDialog} from './components/modal/modal-dialog.component';
import {Toast} from './components/notification/toast.component';
import {Notification} from './components/notification/notification.service';
import {OverlayHost} from './components/overlay-host/overlay-host.component';
import {OverlayHostService} from './components/overlay-host/overlay-host.service';
import {ProgressBar} from './components/progress-bar/progress-bar.component';
import {RadioButton, RadioGroup} from './components/radio-button/radio-button.component';
import {Range} from './components/range/range.component';
import {SearchBar} from './components/search-bar/search-bar.component';
import {Select} from './components/select/select.component';
import {SideMenu, SideMenuToggle} from './components/side-menu/side-menu.component';
import {SortableList, SortableListDragHandle, SortableItem} from './components/sortable-list/sortable-list.component';
import {SplitViewContainer} from './components/split-view-container/split-view-container.component';
import {Tab} from './components/tabs/tab.component';
import {Tabs} from './components/tabs/tabs.component';
import {Textarea} from './components/textarea/textarea.component';
import {TopBar} from './components/top-bar/top-bar.component';
import {Icon} from './components/icon/icon.component';
import {PreventFileDrop} from './components/file-drop-area/prevent-file-drop.directive';
import {DateTimePickerModal} from './components/date-time-picker/date-time-picker-modal.component';
import {BlankModal} from './components/modal/blank-modal.component';
import {DateTimePickerFormatProvider} from './components/date-time-picker/date-time-picker-format-provider.service';

const UI_CORE_COMPONENTS: any[] = [
    BlankModal,
    Breadcrumbs,
    Button,
    Checkbox,
    ContentsListItem,
    DateTimePicker,
    DateTimePickerModal,
    DropdownList,
    DynamicModalWrapper,
    FileDropArea,
    FilePicker,
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
    SearchBar,
    Select,
    SideMenu,
    SideMenuToggle,
    SortableItem,
    SortableList,
    SortableListDragHandle,
    SplitViewContainer,
    Tab,
    Tabs,
    Textarea,
    TopBar,
    Toast
];

export const UI_CORE_ENTRY_COMPONENTS: any[] = [
    BlankModal,
    DynamicModalWrapper,
    Toast,
    ModalDialog,
    DateTimePickerModal
];

const UI_CORE_PIPES: any[] = [
    MatchesMimeTypePipe
];

export const UI_CORE_PROVIDERS: any[] = [
    DateTimePickerFormatProvider,
    DragStateTrackerFactory,
    ModalService,
    Notification,
    OverlayHostService,
    PageFileDragHandler
];

export const declarations = [...UI_CORE_COMPONENTS, ...UI_CORE_PIPES];
export const routerModuleForChild: ModuleWithProviders = RouterModule.forChild([]);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routerModuleForChild
    ],
    declarations,
    entryComponents: UI_CORE_ENTRY_COMPONENTS,
    providers: UI_CORE_PROVIDERS,
    exports: declarations
})
export class GenticsUICoreModule {}
