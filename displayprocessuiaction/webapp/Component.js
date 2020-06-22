sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
  "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
  "com/sap/cd/maco/monitor/ui/app/processuiactions/actions/ExecuteMsgAggrAction",
  "com/sap/cd/maco/monitor/ui/app/processuiactions/actions/ReportExecutionAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction"
],
function(MonitorComponent, HashSync, ExecuteMsgAggrAction, ReportExecutionAction, ShareAction) {
  "use strict";

  return MonitorComponent.extend("com.sap.cd.maco.monitor.ui.app.processuiactions.Component", {
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
        executeMsgAggr: new ExecuteMsgAggrAction(this),
        reportExecution: new ReportExecutionAction(this),
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
    }
  });
});