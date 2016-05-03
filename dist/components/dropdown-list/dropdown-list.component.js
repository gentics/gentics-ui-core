"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * A Dropdown List component based on the [Materialize implementation](http://materializecss.com/dropdown.html),
 * but translated into a native Angular2 version.
 *
 * The component expects two child elements with the following classes:
 *
 * * `.dropdown-trigger` - this element is the button/label which the user will click to open the dropdown.
 * * `.dropdown-content` - this should be a `<ul>` list with the contents of the dropdown.
 *
 *
 * ```html
 * <gtx-dropdown-list>
 *     <a class="dropdown-trigger">Show List</a>
 *     <ul class="dropdown-content">
 *         <li><a>First</a></li>
 *         <li><a>Second</a></li>
 *         <li><a>Third</a></li>
 *     </ul>
 * </gtx-dropdown-list>
 * ```
 */
var DropdownList = (function () {
    function DropdownList(elementRef) {
        var _this = this;
        this.elementRef = elementRef;
        this.id = 'dropdown-' + Math.random().toString(36).substr(2);
        this.contentStyles = {
            position: 'absolute'
        };
        this.isOpen = false;
        this.options = {
            inDuration: 300,
            outDuration: 225,
            constrain_width: true,
            hover: false,
            gutter: 0,
            belowOrigin: false,
            alignment: 'left'
        };
        /**
         * Close the dropdown and unregister the global event handlers.
         */
        this.closeDropdown = function () {
            _this.isOpen = false;
            _this.$content.fadeOut(_this.options.outDuration);
            setTimeout(function () { return _this.contentStyles.maxHeight = ''; }, _this.options.outDuration);
            $(document).off('click scroll', _this.closeDropdown);
        };
    }
    Object.defineProperty(DropdownList.prototype, "align", {
        /**
         * Set the alignment of the dropdown, either 'left' or 'right'. Defaults to 'left'.
         */
        get: function () {
            return this.options.alignment;
        },
        set: function (val) {
            this.options.alignment = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set up the various references to the DOM elements we will be working with,
     * and move the content-wrapper div to the body.
     */
    DropdownList.prototype.ngAfterViewInit = function () {
        var _this = this;
        var queryChild = function (selector) { return $(_this.elementRef.nativeElement).find(selector); };
        var $body = $('body');
        this.$trigger = queryChild('.dropdown-trigger');
        this.$contentWrapper = queryChild('.dropdown-content-wrapper');
        this.$content = queryChild('.dropdown-content');
        this.$content.attr('id', this.id);
        this.$trigger.attr('data-activates', this.id);
        // move the contents to body to avoid z-index issues.
        this.$contentWrapper.remove();
        $body.append(this.$contentWrapper);
    };
    /**
     * Remove the content wrapper from the body.
     */
    DropdownList.prototype.ngOnDestroy = function () {
        this.$contentWrapper.remove();
    };
    /**
     * Open the dropdown contents in the correct position.
     */
    DropdownList.prototype.openDropdown = function () {
        var _this = this;
        // Constrain width
        if (this.options.constrain_width === true) {
            this.contentStyles.width = this.$trigger.outerWidth() + 'px';
        }
        else {
            this.contentStyles.whiteSpace = 'nowrap';
        }
        // Offscreen detection
        var windowHeight = window.innerHeight;
        var originHeight = this.$trigger.innerHeight();
        var offsetLeft = this.$trigger.offset().left;
        var offsetTop = this.$trigger.offset().top - $(window).scrollTop();
        var currAlignment = this.options.alignment;
        // Below Origin
        var verticalOffset = 0;
        if (this.options.belowOrigin === true) {
            verticalOffset = originHeight;
        }
        if (offsetLeft + this.$content.innerWidth() > $(window).width()) {
            // Dropdown goes past screen on right, force right alignment
            currAlignment = 'right';
        }
        else if (offsetLeft - this.$content.innerWidth() + this.$trigger.innerWidth() < 0) {
            // Dropdown goes past screen on left, force left alignment
            currAlignment = 'left';
        }
        // Vertical bottom offscreen detection
        if (offsetTop + this.$content.innerHeight() > windowHeight) {
            // If going upwards still goes offscreen, just crop height of dropdown.
            if (offsetTop + originHeight - this.$content.innerHeight() < 0) {
                var adjustedHeight = windowHeight - offsetTop - verticalOffset;
                this.contentStyles.maxHeight = adjustedHeight;
            }
            else {
                // Flow upwards.
                if (!verticalOffset) {
                    verticalOffset += originHeight;
                }
                verticalOffset -= this.$content.innerHeight();
            }
        }
        // Handle edge alignment
        var leftPosition = 0;
        var triggerLeft = this.$trigger[0].getBoundingClientRect().left;
        if (currAlignment === 'left') {
            leftPosition = triggerLeft + this.options.gutter;
        }
        else if (currAlignment === 'right') {
            var offsetRight = triggerLeft + this.$trigger.outerWidth() - this.$content.outerWidth();
            leftPosition = offsetRight + this.options.gutter;
        }
        this.contentStyles.top = this.$trigger[0].getBoundingClientRect().top + verticalOffset + 'px';
        this.contentStyles.left = leftPosition + 'px';
        // Show dropdown
        this.$content.stop(true, true).css('opacity', 0)
            .slideDown({
            queue: false,
            duration: this.options.inDuration,
            easing: 'easeOutCubic',
            complete: function () {
                _this.contentStyles.height = '';
            }
        })
            .velocity({ opacity: 1 }, {
            queue: false,
            duration: this.options.inDuration,
            easing: 'easeOutSine'
        });
    };
    DropdownList.prototype.onTriggerClick = function () {
        var _this = this;
        if (!this.isOpen) {
            this.isOpen = true;
            this.openDropdown();
            setTimeout(function () { return $(document).on('click scroll', _this.closeDropdown); });
        }
        else {
            this.closeDropdown();
        }
    };
    DropdownList.prototype.onContentClick = function () {
        if (this.isOpen) {
            this.closeDropdown();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DropdownList.prototype, "align", null);
    DropdownList = __decorate([
        core_1.Component({
            selector: 'gtx-dropdown-list',
            template: require('./dropdown-list.tpl.html')
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], DropdownList);
    return DropdownList;
}());
exports.DropdownList = DropdownList;
