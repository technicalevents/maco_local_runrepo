sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/component/DraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/nav/HashSync",
    "com/sap/cd/maco/mmt/ui/reuse/nav/NavToRouteAction",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/actions/ExecuteMsgAggrAction",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/actions/ReportExecutionAction",
    "com/sap/cd/maco/mmt/ui/reuse/share/ShareAction"
  ],
  function(DraftComponent, HashSync, NavToRouteAction, ExecuteMsgAggrAction, 
            ReportExecutionAction, ShareAction) {
    "use strict";

    return DraftComponent.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize DraftComponent
       */
      init: function() {
        // call the base component"s init function
        DraftComponent.prototype.init.apply(this, arguments);

        this.actions = {
          executeMsgAggr: new ExecuteMsgAggrAction(this),
          reportExecution: new ReportExecutionAction(this),
          navToProcessPage: new NavToRouteAction(this),
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
          message: this.oMessage,
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
        //Destroy Actions
        for (var sName in this.actions) {
          this.actions[sName].destroy();
        }

        // generic destroy of component
        DraftComponent.prototype.destroy.apply(this, arguments);
      }
    });
  }
);
