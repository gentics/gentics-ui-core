## 0.8.0 (2016-08-XX)
### Features
* Add "for" input to ProgressBar that accepts an Observable or a Promise
* Add Tabs components

### Fixes
* ProgressBar cleans up when using start() multiple times
* SideMenu fix positioning for small screens
* ProgressBar works more reliably and with ChangeDetection.OnPush
* Many compatibility issues on older browsers resolved
* DropdownList performance improvements
* (docs) Fix order of polyfills so that zone.js patches promises.

## 0.7.1 (2016-08-01)
### Fixes
* Fix broken import names of 0.7.0 which don't work in compiled JavaScript
* Fix MenuToggleButton not accepting clicks / hover

## 0.7.0 (2016-07-29)
### Features
* Add FilePicker component
* Add FileDropArea & PreventFileDrop directives
* Add PageDragDropFileHandler service
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


## 0.1.1 (2016-05-10)

### Features
* Add icon buttons
* Add stateless mode for Checkbox and RadioButton
* Add show-on-hover class to ContentsListItem

### Fixes
* (docs) Fix docs parser regex
* (build) Upgrade to gulp v4

## v0.1.0
Basic selection of components, built on angular2 rc.0
