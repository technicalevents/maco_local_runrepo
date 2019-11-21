sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpValues'], function(valueHelpValues) {
  'use strict';

  return {
    get: function(sKey) {
      var oResult = {};
      for (var i = 0; i < valueHelpValues[sKey].length; i++) {
        oResult[valueHelpValues[sKey][i].id] = valueHelpValues[sKey][i].text;
      }
      return oResult;
    }
  };
});
