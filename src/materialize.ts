/**
 * The Gentics UI Core is based on the Materialize framework. Materialize includes javascript code to enable
 * dynamic functionality of many of its components. It ships with a "materilize.js" file, which is a concatenated
 * bundle containing all the component JS as well as embedded versions of velocity-animate (an animation lib) and
 * hammerjs (touch interaction lib).
 *
 * This bundle does not work well when bundling via Webpack, and also we may not want to include *all* the
 * Materialize JS. Therefore this file is used to explicitly require only those component JavaScripts that
 * we need for the UI Core.
 */

'use strict';

/* Required dependencies for the Materialize scripts */
import * as $ from 'jquery';
(<any> window)['$'] = $;
(<any> window)['jQuery'] = $;
require('jquery-easing');
require('materialize-css/js/animation.js');
require('velocity-animate');
require('hammerjs');
require('materialize-css/js/jquery.hammer.js');
require('materialize-css/js/global.js');

/* Uncomment the components that we want to include */
// require('materialize-css/js/collapsible.js');
// require('materialize-css/js/dropdown.js');
require('materialize-css/js/forms.js');
// require('materialize-css/js/leanModal.js');
// require('materialize-css/js/materialbox.js');
// require('materialize-css/js/parallax.js');
// require('materialize-css/js/tabs.js');
// require('materialize-css/js/tooltip.js');
// require('materialize-css/js/waves.js');
// require('materialize-css/js/toasts.js');

// require('materialize-css/js/sideNav.js');
// require('materialize-css/js/scrollspy.js');
// require('materialize-css/js/forms.js');
// require('materialize-css/js/slider.js');
// require('materialize-css/js/cards.js');
// require('materialize-css/js/chips.js');
require('materialize-css/js/buttons.js');
