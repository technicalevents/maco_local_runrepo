sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/component/single/SingleResolution'], function(SingleResolution) {
  'use strict';

  return function(oObject, bSuppressCheck) {
    return SingleResolution.get('message', oObject, bSuppressCheck);
  };
});
