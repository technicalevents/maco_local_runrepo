sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/monitor/valueHelpValues'], function(valueHelpValues) {
  'use strict';

  var fnGetText = function(sKey, sId) {
    for (var i = 0; i < valueHelpValues[sKey].length; i++) {
      if (valueHelpValues[sKey][i].id === sId) {
        return valueHelpValues[sKey][i].text;
      }
    }
    return '? (' + sId + ')';
  };

  /**
   * The goal of this file is to abstract on how the resource bundle is accessed.
   * This differs if the reuse code runs in a real reuse lib or is copied to an app.
   */
  return {
    division: function(sId) {
      return fnGetText('divisions', sId);
    },
    marketRole: function(sId) {
      return fnGetText('marketRoles', sId);
    }
  };
});
