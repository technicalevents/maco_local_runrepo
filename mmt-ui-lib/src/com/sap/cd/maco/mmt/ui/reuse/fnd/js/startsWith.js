/*global location*/
sap.ui.define([], function() {
  'use strict';

  /**
     * startsWith is ES6 and requires polyfill for IE
	 // ... but UI5 seems to contain this
	 */
  return function(sString, sPart) {
    if (typeof sString !== 'string') {
      return false;
    } else {
      return sString.startsWith(sPart);
    }
  };
});
