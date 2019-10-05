sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "com/sap/cd/maco/mmt/ui/reuse/bootstrap/BootstrapMmt",
    "com/sap/cd/maco/mmt/ui/reuse/nav/HashSync",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/SingleDownloadAction",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/MultiDownloadAction",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/CrossAppNavigationAction",
    "com/sap/cd/maco/mmt/ui/reuse/nav/NavToRouteAction",
    "com/sap/cd/maco/mmt/ui/reuse/share/ShareAction"
  ],
  function(UIComponent, Bootstrap, HashSync, SingleDownloadAction, MultiDownloadAction, 
			CrossAppNavigationAction, NavToRouteAction, ShareAction) {
    "use strict";

    return UIComponent.extend("com.sap.cd.maco.monitor.ui.app.displaymessages.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize UIComponent
       */
      init: function() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);
			
        // generic init of component
        this._oBootstrap = new Bootstrap(this);
        this._oBootstrap.initComponent();
        
        this.actions = {
          singleDownload: new SingleDownloadAction(this),
          multiDownload: new MultiDownloadAction(this),
          crossAppNavigation: new CrossAppNavigationAction(this),
          navToMessagePage: new NavToRouteAction(this),
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
            return "messagePage";
          }
        });
        oHashSync.synch();

        // create the views based on the url/hash
        this.getRouter().initialize();
      },

      /**
       * Function is used to destroy component
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
