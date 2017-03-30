# Gentics UI Core Changelog

## 3.0.1 (2017-03-30)

### Fixes

* SplitViewContainer can be styled in consuming applications instead of detecting its position (GUIC-107)


## 3.0.0 (2017-03-29)

### Breaking changes

* SplitViewContainer state management moved to the parent container with double-binding (GUIC-82):
  ```
  <split-view-container [(focusedPanel)]="panelToFocus" [rightPanelVisible]="hasContent">
  </split-view-container>
  ```
  `leftContainerWidthPercent` is renamed to `split` (double-binding) / `initialSplit` (one-time default):
  ```
  <split-view-container [(split)]="percentageControlledByParent"></split-view-container>
  <split-view-container [initialSplit]="30"></split-view-container>
  ```

### Features

* All form components provide styling for "invalid" state when used with ngModel validators
* All form components provide setDisabledState of the ControlValueAccessor interface (GUIC-100)
* Range slider supports label and has consistent styling with other inputs
* Textarea resizes itself when the text exceeds the width and wraps into another line (GUIC-106)
* ModalService exposes `openModals` property for querying currently-open modal components.

### Fixes

* Breadcrumb component is easier to use with transcluded components (GCU-308)
* Prevent focus of links and items in SideMenu when hidden
* Notification messages may contain newlines and indentation
* Autofocus directive fixed for generated content (ngIf, ngFor)
* Fix Range input in IE11 and Edge (GUIC-101)


## 2.1.1 (2017-03-20)

### Fixes

* Add exports of DropdownItem & DropdownTrigger missing in 2.1.0 (GUIC-104)


## 2.1.0 (2017-03-07)

### Features

* SortableList allows dragging between lists with the `group` attribute, expose sortable API (GUIC-104)

### Fixes

* Fix values emitted by Textarea "blur" and "focus" events (GUIC-102)


## 2.0.6 (2017-02-06)

### Fixes

* Fix Textarea height no longer adapting to contained text
* Fix InputField and Textarea value binding with NgModel/FormControlName


## 2.0.5 (2017-02-03)

### Fixes

* Fix InputField and Textarea values not being correctly updated


## 2.0.4 (2017-02-02)

### Fixes

* Fix AutofocusDirective exception in Firefox (GCU-269)
* Fix InputField and Textarea values not being correctly updated


## 2.0.3 (2017-01-25)

### Fixes

* Fix smaller styling issues of Select, Modals and DropdownList


## 2.0.2 (2017-01-25)

### Fixes

* Remove leaking core-js typings reference from generated d.ts files
* Correctly interpolate font paths in icons Sass file


## 2.0.1 (2017-01-23)

### Fixes
* Add some missing methods to the `MomentLike` interface in `DateTimePickerFormatProvider`
* Fix Modal animations


## 2.0.0 (2017-01-16)

### Breaking Changes
* DropdownList - lists are now created with the `<gtx-dropdown-item>` component:
    ```html
    <!-- before -->
    <gtx-dropdown-content>
        <ul>
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </ul>
    </gtx-dropdown-content>
    
    <!-- now -->
    <gtx-dropdown-content>
        <gtx-dropdown-item>Item 1</gtx-dropdown-item>
        <gtx-dropdown-item>Item 2</gtx-dropdown-item>
    </gtx-dropdown-content>
    ```

* Select - options and option groups now have a "gtx-" prefix:
    ```html
    <!-- before -->
    <gtx-select label="Pick an option">
        <optgroup label="Foos">
            <option value="foo1">Foo 1</option>
            <option value="foo2">Foo 2</option>
        </optgroup>
        <optgroup label="Bars">
            <option value="bar1">Bar 1</option>
            <option value="bar2">Bar 2</option>
        </optgroup>
    </gtx-select>
    
    <!-- now -->
    <gtx-select label="Pick an option">
        <gtx-optgroup label="Foos">
            <gtx-option value="foo1">Foo 1</gtx-option>
            <gtx-option value="foo2">Foo 2</gtx-option>
        </gtx-optgroup>
        <gtx-optgroup label="Bars">
            <gtx-option value="bar1">Bar 1</gtx-option>
            <gtx-option value="bar2">Bar 2</gtx-option>
        </gtx-optgroup>
    </gtx-select>
    ```

### Features
* Migrate type definitions to @types/*
* Add Moment as a peerDependency
* Component templates now get inlined as strings in build step
* DropdownList: extend API with `sticky`, `closeOnEscape`, `isOpen`, `disabled` and `closeDropdown()`; add keyboard support
* Buttons can be declared as submit button
* Selects can bind to object values, full keyboard control support (GUIC-86)
* All form components support `autofocus` (GUIC-91, GCU-143, GCU-192)
* Remove jQuery dependency (GUIC-98)

### Fixes
* No longer leak type definition dependencies (moment, hammerjs, sortablejs etc.)
* User can no longer trigger scrolling via keyboard when DropdownList is open
* Fixed z-index issues with Select component (GUIC-86)


## 1.0.0 (2016-12-06)

### Breaking Changes

* Updated to Angular 2 final. No longer compatible with any version of Angular prior to 2.0.0-rc.6. Exporting lib as `GenticsUICoreModule`.
* DropdownList now uses elements rather than classes to contain the trigger and contents:
    ```html
    <!-- before -->
    <gtx-dropdown-list>
        <a class="dropdown-trigger">trigger</a>
        <ul class="dropdown-content">
            <li><a>Content</a></li>
        </ul>
    </gtx-dropdown-list>
    
    <!-- now -->
    <gtx-dropdown-list>
        <gtx-dropdown-trigger>
            <a>Trigger</a>
        </gtx-dropdown-trigger>
        <gtx-dropdown-content>
            <ul>
                <li><a>Content</a></li>
            </ul>
        </gtx-dropdown-content>
    </gtx-dropdown-list>
    ```

### Fixes
* DropdownList no longer cuts off long lists (GUIC-89, GCU-222)


## 0.12.0 (2016-12-01)

### Features

* DateTimePicker now translatable & localizable (GCU-170)

### Fixes
* Fix FilePicker events being emitting on wrong conditions
* Prevent wrapping in icon buttons (GUIC-88)
* DatePicker formatting fixed for small screen sizes


## 0.11.0 (2016-10-25)

### Features
* Remove Modal component in favor of `ModalService.fromComponent`


## 0.10.0 (2016-09-29)

### Features
* Modal CSS changed to fit all screen sizes

### Fixes
* ModalService default options no longer overwritten

## 0.9.1 (2016-09-26)

### Features
* SearchBar accepts placeholder parameter to translate it
* Icons can now be written as "icon" element, e.g. `<icon left>wastebin</icon>`
  instead of `<i class="material-icons left">wastebin</i>`


## 0.9.0 (2016-09-22)

### Fixes
* SplitViewContainer works with OnPush change detection
* SplitViewContainer handles dragging outside of the window
* Select uses ellipses if selected item text is wider than component
* Select dropdown aligns with the input
* DropdownList works inside modals
* Range component no longer forwards native "change"/"focus"/"blur" DOM events
* Button component does not forward native "click" events when disabled
* FilePicker styles fixed to align with button appeareance
* OverlayHostService: fix bug with registering multiple consumers
* Breadcrumbs use a back button on small screens and ellipsis on medium and up
* (docs) Fix issues with PageFileDragHandler provider declaration
* [semver-minor] ModalService: promise no longer rejects when modal is cancelled


## 0.8.0 (2016-08-24)

### Features
* Added "for" input to ProgressBar that accepts an Observable or a Promise
* Added Tabs component

### Fixes
* SideMenu positioning for small screens
* ProgressBar cleans up when using start() multiple times
* ProgressBar works more reliably and with ChangeDetection.OnPush
* Resolved many compatibility issues on older browsers
* DropdownList performance improvements
* (docs) Reorder polyfills so zone.js patches promises

## 0.7.1 (2016-08-01)

### Fixes
* Fixed broken import names of 0.7.0 which don't work in compiled JavaScript
* Fixed MenuToggleButton not accepting clicks / hover


## 0.7.0 (2016-07-29)

### Features
* Added FilePicker component
* Added FileDropArea & PreventFileDrop directives
* Added PageDragDropFileHandler service
* ModalService.fromComponent() now accepts a parameter defining local variables
* Split SideMenu and MenuToggleButton into separate components
* SideMenu can now have its width and position configured

### Fixes
* (docs) Improved parsing & display of auto docs
* (docs) Renamed title attribute to prevent browsers from displaying tooltips on hover
* (docs) Show angular template errors in console instead of silently failing

## 0.6.1 (2016-07-19)

### Fixes
* ModalService templates named correctly and exported
* ModalService styling
* Fix layout issues with Checkbox & RadioButton


## 0.6.0 (2016-07-19)

### Features
* SearchBar now has a ValueAccessor, and `hideClearButton` attribute
* ModalService introduced for more flexible promise-based modals
* Add version number to docs


## 0.5.0 (2016-07-07)

### Features
* Upgraded to angular release candidate 4
* Upgraded to new router and form directives
* (build) Updated jscs version

### Fixes
* Fix resizing SplitViewContainer above iframe
* Resolved Performance problem with innerHTML in docs
* Fix "Cannot read property of undefined" in Notifications
* (docs) Prevent angular from sanitizing strings in AutoDocs


## 0.4.0 (2016-06-20)

### Features
* Add gulp "dist:watch" task, internal tasks not exposed anymore
* Form components can be imported individually

### Fixes
* InputField is now marked as "touched" on blur
* Select is now marked as "touched" on blur
* Images in ui-core demo changed to relative urls

## 0.3.1

### Features 
* SearchBar now has a "clear" button and event
* SearchBar can project content
* Add OverlayHostService & refactored the way that overlays are created
* (build) Updated tslint version
* (tests) Add source map support for karma tests

### Fixes
* InputField no longer fires "change" event on blur
* DropdownList now uses native Angular methods of inserting & disposing of DOM nodes, which fixes some layout issues


## 0.3.0 (2016-06-03)

### Features
* Upgrade to typings 1.0.4

### Fixes
* Gulp tasks now exit with a non-zero code when errors occur
* Check sass validity in npm package build process


## 0.2.0 (2016-06-01)

### Features
* Add breadcrumbs component
* Add progress-bar component
* Use Foundation 6 grid instead of the materialize grid
* DropdownList width and positioning are now adjustable

### Fixes
* (build) Test are only executed once
* (tests) Fix tests for DropdownList, RadioButton
* Fix sorting of SortableList


### 0.1.1 (2016-05-10)

### Features
* Add icon buttons
* Add stateless mode for Checkbox and RadioButton
* Add show-on-hover class to ContentsListItem

### Fixes
* (docs) Fix docs parser regex
* (build) Upgrade to gulp v4


## 0.1.0
Basic selection of components, built on angular2 rc.0
