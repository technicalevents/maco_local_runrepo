sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(bundle) {
  'use strict';

  return function(bValue) {
    return bValue ? bundle.getText('formatterYesNoTrue') : bundle.getText('formatterYesNoFalse');
  };
});
