sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(bundle) {
  'use strict';

  return function(sValue) {
    if (sValue) {
      return sValue;
    } else {
      return bundle.getText('formatterNoName');
    }
  };
});
