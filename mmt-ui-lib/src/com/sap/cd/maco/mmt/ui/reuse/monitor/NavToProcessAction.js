sap.ui.define(["com/sap/cd/maco/mmt/ui/reuse/monitor/NavToExternalAction"], function(NavToExternalAction) {
  "use strict";

  return NavToExternalAction.extend('com.sap.cd.maco.mmt.ui.reuse.monitor.NavToProcessAction', {
    /******************************************************************* */
    /* CONSTRUCTOR */
    /******************************************************************* */

    /**
     * Constructor
     */
    constructor: function(oComponent, sKeyField, sProcessId) {
      var oConfig = {
        semanticObject: "UtilsDataExchangeProcessing",
        action: "displayProcess",
        paramsMap: {
          ProcessDocumentKey: sKeyField,
          ProcessID: sProcessId
        },
        guidFields: sKeyField
      };

      NavToExternalAction.call(this, oComponent, oConfig);
      this.oConfig.minContexts = 1;
    }
  });
});
