(function() {
  "use strict";

  sap.ui.controller("com.sap.cd.maco.monitor.ui.app.overviewprocesses.ext.ExtController", {
    /**
     * Determines which function should be called for the custom parameter
     */
    onCustomParams: function(sCustomParam) {
      if (sCustomParam === "getParameters") {
        return this.getParameters;
      } else {
        throw new Error("unknown custom param " + sCustomParam);
      }
    },

    getParameters: function(oNavigateParams, oSelectionVariantParams) {
     debugger;
      // to get the select option property names, make use of this to check what values are available to modify
      var aSelectOptionNames = oSelectionVariantParams.getSelectOptionsPropertyNames();
      
      return {
        selectionVariant: [
          {
            path: aSelectOptionNames[0],
            operator: "EQ",
            value1: oNavigateParams[aSelectOptionNames[0]],
            value2: null,
            sign: "I"
          }
        ],
        ignoreEmptyString: true
      };
    }
  });
})();
