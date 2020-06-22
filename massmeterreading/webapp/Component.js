sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
  "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
  "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToProcessAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMessageAction"
],
function(MonitorComponent, HashSync, ShareAction, NavToProcessAction, NavToMessageAction) {
  "use strict";

  return MonitorComponent.extend("com.sap.cd.maco.monitor.ui.app.massmeterreadings.Component", {
    metadata: {
      manifest: "json"
    },

    /**
     * Function is used to initialize MonitorComponent
     */
    init: function() {
      // call the base component's init function
      MonitorComponent.prototype.init.apply(this, arguments);

      this.mActions = {
        navToUploadProcessAction: new NavToProcessAction(this, "MassUploadProcessKey", "MassUploadProcessID"),
        navToAggrProcessAction: new NavToProcessAction(this, "AggregationProcessKey", "AggregationProcessID"),
        navToMessageAction: new NavToMessageAction(this, "MessageReferenceUUID"),
        share: new ShareAction(this, {
          appTitleMsgKey: "APP_TITLE",
          objectIdProperty: "CommonAccessUUID",
          objectTextProperty: "PointOfDelivery"
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
          return "listReport";
        }
      });
      oHashSync.synch();

      // create the views based on the url/hash
      this.getRouter().initialize();
    }
  });
});