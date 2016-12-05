/**
 * The Gentics UI Core is based on the Materialize framework. Materialize includes javascript code to enable
 * dynamic functionality of many of its components. It ships with a "materialize.js" file, which is a concatenated
 * bundle containing all the component JS as well as embedded versions of velocity-animate (an animation lib) and
 * hammerjs (touch interaction lib).
 *
 * This bundle does not work well when bundling via Webpack, and also we may not want to include *all* the
 * Materialize JS. Therefore this file is used to explicitly require only those component JavaScripts that
 * we need for the UI Core.
 */

declare const window: Window & {
    $: JQueryStatic;
    jQuery: JQueryStatic;
};

/* Required dependencies for the Materialize scripts */
import * as $ from 'jquery';
window.$ = window.jQuery = $;
require('jquery-easing');
require('materialize-css/js/animation.js');
require('velocity-animate');
require('hammerjs');
require('materialize-css/js/jquery.hammer.js');
require('materialize-css/js/global.js');
require('materialize-css/js/dropdown.js'); // required for the form <select> input
require('materialize-css/js/forms.js');
