sap.ui.define(["com/sap/cd/maco/mmt/ui/reuse/monitor/NavToExternalAction"], function(
  NavToExternalAction
) {
  "use strict";

  return NavToExternalAction.extend('com.sap.cd.maco.mmt.ui.reuse.monitor.NavToMessageAction', {
    /******************************************************************* */
    /* CONSTRUCTOR */
    /******************************************************************* */

    /**
     * Constructor
     */
    constructor: function(oComponent, sKeyField) {
      var oConfig = {
        semanticObject: "UtilsDataExchangeProcessing",
        action: "displayMessage",
        paramsMap: {
          TransferDocumentKey: sKeyField
        },
        guidFields: sKeyField
      };

      NavToExternalAction.call(this, oComponent, oConfig);
      this.oConfig.minContexts = 1;
    }
  });
});
