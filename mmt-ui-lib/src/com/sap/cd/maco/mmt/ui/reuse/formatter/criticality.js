sap.ui.define([], function() {
  'use strict';

  return function(iValue) {
    if (iValue === 0) {
      return 'None';
    } else if (iValue === 1) {
      return 'Error';
    } else if (iValue === 2) {
      return 'Warning';
    } else if (iValue === 3) {
      return 'Success';
    } else {
      return 'None';
    }
  };
});
