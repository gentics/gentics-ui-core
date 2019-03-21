# Gentics UI Core Changelog

## 6.6.1 (2019-03-21)

### Fixes

* Upgrade some dependencies to resolve some security vulnerabilities (GUIC-208)
* Fix the `focus` event of Input to always emit the current value of the input field (GUIC-160).
* Fix the handling of the `DateTimePicker.timestamp` input property - it can now be used to set a new value and not just the initial value (GUIC-160).

## 6.6.0 (2018-02-05)

### Features

* Add icon property to Select (GUIC-212)

## 6.5.1 (2019-01-22)

### Fixes

* Fix ModalService openModalComponents counter, when multiple instances needed. (SUP-7331)

## 6.5.0 (2019-01-15)

### Features

* Add placeholder option to Select (GUIC-205)

### Fixes

* Remove the firing of the change event in writeValue() method (GUIC-193)
* Fix race condition in multiline breadcrumbs in IE and Edge (GUIC-203)
* Fix the order of ngModel and onChange (GUIC-204)
* Fix .clear-button style to be scoped to gtx-select (SUP-7296)

## 6.4.0 (2018-11-22)

### Features

* Add clearable option to Select (GUIC-195)

### Fixes

* Fix styling of breadcrumbs (GTXPE-182)

## 6.3.0 (2018-11-14)

### Features

* Add support for vertical tabs (GUIC-186)
* Add optional tooltip for breadcrumbs (GUIC-189)
* Add option for multiline breadcrumbs (GUIC-190)
* Add support for pattern validation to textarea (GUIC-191)

### Fixes

* Fix unexpected propagation of DOM onChange event in Textarea during onBlur (GUIC-187)
* Fix modal height in IE11 with dynamic height calculation by surrounding elements. (GUIC-188)

## 6.2.3 (2018-09-20)

### Fixes

* Fix keyboard usage and search in the Select-Component when multiple option selection is enabled (GUIC-185)

## 6.2.2 (2018-09-11)

### Fixes

* Fix modal height in IE11 to fit to the height of the modal's content.

## 6.2.1 (2018-09-04)

### Fixes

* Fix the dropdown-content style which causes the content to get pushed out of it (GUIC-181)
* Fix the `gtx-input`'s width inside the date-time-picker to make it responsive to the parents width (GUIC-163, GUIC-179, #5)

## 6.2.0 (2018-08-30)

### Features

* Add support to override the DateTimeFormatProvider on the DateTimePickerControl-Component (SUP-6172)

### Fixes

* Fix change-detection and update of the calendar in the DateTimePickerControl when a FormatProvider pushes changes (SUP-6172)

## 6.1.2 (2018-08-14)

### Fixes

* Fix occasional incorrect height calculation of Textarea (GUIC-152).

## 6.1.1 (2018-04-11)

### Fixes

* Fix runtime error in DropdownList when opening with empty content

## 6.1.0 (2018-03-19)

### Features
* Add "warning" toast type to Notification service
* Add "thumbLabel" option to Range input

### Fixes
* Fix modal scrolling on small screens (GUIC-93)

## 6.0.3 (2018-01-16)

### Fixes

* Fix DateTimePicker component in "OnPush" components (GUIC-160)
* Fix DateTimePicker styling in modals for IE (GUIC-161)


## 6.0.2 (2018-01-09)

### Fixes

* TextArea component works correctly in Internet Explorer (GUIC-158)


## 6.0.1 (2017-12-13)

### Fixes

* Fix AoT error in Tabs component (GUIC-155)


## 6.0.0 (2017-12-12)

### Features

* New "clear" event on clearable DateTimePickers
* Add `wrap` input to Tabs component to control wrapping of tabs
* Add title attribute to tabs
* Add "expand" option to the DropdownList `width` input

### Fixes

* Prevent disabled DateTimePicker from being cleared (GUIC-146)
* Fix SideMenu causing extra whitespace on Chrome mobile
* Fix DropdownList positioning on mobile
* Fix DropdownList ScrollMask not preventing scroll on Chrome mobile
* Fix Select width when contents are wider than select element itself

### Breaking Changes

* GUIC is now built with Angular 5 and requires that version as a peerDependency
* GUIC now requires the @angular/animations module as well as the `web-animations-js` polyfill to allow the animations to work in IE and Safari.


## 5.6.0 (2017-11-22)

### Features

* Remove padding from select with no label 
* Tabs support icons (GUIC-140)

### Fixes

* Long text in tabs are truncated with text ellipsis (GUIC-143)
* DateTimePicker clear button aligned independent of parent height (GUIC-148)
* Buttons no longer forward click events when disabled (GUIC-124)
* Ignore clicks on disabled routerLink breadcrumbs
* InputField and SearchBar correctly communicate with ngModel (GUIC-149, GCU-377)


## 5.5.0 (2017-10-25)

### Features

* Make DateTimePicker clearable (GUIC-139)


## 5.4.1 (2017-10-16)

### Fixes
* Fix downstream build issues introduced by an update to moment.js (GUIC-138)


## 5.4.0 (2017-09-17)

### Features
* DropdownList exposes a `.resize()` method

### Fixes
* Fix positioning issues with DropdownList (GUIC-118)


## 5.3.0 (2017-09-17)

### Features
* Add `open` and `close` events to DropdownList.
* Large Select menus are initialized to the selected item (GUIC-131).
* Implement max, min and year selection in DateTimePicker (GUIC 130).
* Split up DateTimePicker into standalone DateTimePickerControls component.


## 5.2.2 (2017-07-24)

### Fixes
* ModalService no longer attempts to open modal before the host view is registered.
* Remove redundant "readonly" inputs on Checkbox, Range and RadioButton.


## 5.2.1 (2017-07-24)

* Fixed bad publish to npm, no source changes.


## 5.2.0 (2017-07-24)

### Features
* Improve type safety of ModalService.fromComponent() method.

### Fixes
* Fix SplitViewContainer incorrectly switching in IE11 (GUIC-126)


## 5.1.1 (2017-07-11)

* Library had not been rebuilt before last npm publish, so some changes were not there.


## 5.1.0 (2017-07-11)

### Features
* Library is now built with ngc, generating metadata files required for AoT-compiled projects.

### Fixes
* OverlayHostService no longer breaks when instantiated in a child module.
* Select options are updated upon <gtx-option> changes (GUIC-120).


## 5.0.0 (2017-05-08)

### Breaking Changes
* Add static `forRoot()` method to `GenticsUICoreModule` to enable use in apps with lazy-loaded child modules. 
Importing without the `forRoot()` call will not include the providers, only the declarations and pipes.


## 4.0.0 (2017-04-19)

### Breaking Changes
* Update to Angular 4
* Update to TypeScript 2.2.2


## 3.1.0 (2017-04-03)

### Features

* ProgressBar accepts an observable via `[for]` which starts/completes the progress bar on `true`/`false`.
* SplitViewContainer focus changing in a `click` event no longer resets the focus (GUIC-82)
* Style clickable areas in SplitViewContainer more obvious at small/medium breakpoints (GUIC-109)


## 3.0.1 (2017-03-30)

### Fixes

* SplitViewContainer can be styled in consuming applications instead of detecting its position (GUIC-107)
* SplitViewContainer focus changing in a `click` event no longer resets the focus (GUIC-82)


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
