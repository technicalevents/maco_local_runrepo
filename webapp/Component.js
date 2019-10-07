sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "com/sap/cd/maco/mmt/ui/reuse/bootstrap/BootstrapDraft",
    "com/sap/cd/maco/mmt/ui/reuse/nav/HashSync",
    "com/sap/cd/maco/mmt/ui/reuse/nav/NavToRouteAction",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/actions/ExecuteMsgAggrAction",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/actions/ReportExecutionAction",
    "com/sap/cd/maco/mmt/ui/reuse/share/ShareAction"
  ],
  function(UIComponent, Bootstrap, HashSync, NavToRouteAction, ExecuteMsgAggrAction, ReportExecutionAction, ShareAction) {
    "use strict";

    return UIComponent.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize Component
       */
      init: function() {
        // call the base component"s init function
        UIComponent.prototype.init.apply(this, arguments);
			
        // generic init of component
        this._oBootstrap = new Bootstrap(this);
        this._oBootstrap.initComponent();
        
        this.actions = {
          executeMsgAggr: new ExecuteMsgAggrAction(this),
          reportExecution: new ReportExecutionAction(this),
          navToProcessPage: new NavToRouteAction(this),
          share: new ShareAction(this, {
          	appTitleMsgKey: "APP_TITLE"
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
        // generic destroy of component
        this._oBootstrap.destroyComponent();

        // call the base component's destroy function
        UIComponent.prototype.destroy.apply(this, arguments);
      }
    });
  }
);
