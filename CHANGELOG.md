## 0.3.1
### Features 
* SearchBar now has a "clear" button and event
* SearchBar can project content.
* Created OverlayHostService & refactored the way that overlays are created.
* (build) Updated tslint version
* (tests) Add source map support for karma tests

### Fixes
* InputField no longer fires "change" event on blur.
* DropdownList now uses native Angular methods of inserting & disposing of DOM nodes, which fixes some layout issues.

## 0.3.0 (2016-06-03)

### Features
* Upgrade to typings 1.0.4

### Fixes
* Gulp tasks exit with a non-zero code when errors occur
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
* (docs) fix docs parser regex.
* (build) Upgrade to Gulp v4.


## v0.1.0
Basic selection of components, built on angular2 rc.0.
