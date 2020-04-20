sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
  "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
  "com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToRouteAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToProcessAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMessageAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction"
], function(MonitorComponent, HashSync, NavToRouteAction, NavToProcessAction, NavToMessageAction, ShareAction) {
  "use strict";

  return MonitorComponent.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.Component", {
    metadata: {
      manifest: "json"
    },

    /**
     * Function is used to initialize MonitorComponent
     */
    init: function() {
      // call the base component"s init function
      MonitorComponent.prototype.init.apply(this, arguments);

      this.mActions = {
        navToProcessPage: new NavToRouteAction(this),
        navToProcessAction: new NavToProcessAction(this, "ProcDocKey", "ProcessID"),
        navToMessageAction: new NavToMessageAction(this, "BusinessObjectUUID"),
        share: new ShareAction(this, {
          appTitleMsgKey: "APP_TITLE",
          objectIdProperty: "ProcessDocumentNumber",
          objectTextProperty: "ProcessIDDescription"
        })
      };

      this.initRouting();
    },

    /**
     * Function is used to initialize Router
     */
    initRouting: function() {
      // sync hash
      var oHashSync = new HashSync({
        component: this,
        message: this.mSingles.message,
        getRouteName: function(startupParams) {
          return "processPage";
        }
      });
      oHashSync.synch();

      // create the views based on the url/hash
      this.getRouter().initialize();
    },

    /**
     * Function is triggered on exit of Application 
     */
    destroy: function() {
      // generic destroy of component
      MonitorComponent.prototype.destroy.apply(this, arguments);
    }
  });
});