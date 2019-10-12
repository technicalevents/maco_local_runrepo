sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/component/DraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/nav/HashSync",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/SingleDownloadAction",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/MultiDownloadAction",
    "com/sap/cd/maco/mmt/ui/reuse/nav/NavToRouteAction",
    "com/sap/cd/maco/mmt/ui/reuse/share/ShareAction",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToProcessAction"
  ],
  function(DraftComponent, HashSync, SingleDownloadAction, MultiDownloadAction, 
			NavToRouteAction, ShareAction, NavToProcessAction) {
    "use strict";

    return DraftComponent.extend("com.sap.cd.maco.monitor.ui.app.displaymessages.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize DraftComponent
       */
      init: function() {
        // call the base component's init function
        DraftComponent.prototype.init.apply(this, arguments);
        
        this.actions = {
			singleDownload: new SingleDownloadAction(this),
			multiDownload: new MultiDownloadAction(this),
			navToMessagePage: new NavToRouteAction(this),
			navToProcessApp: new NavToProcessAction(this, "ProcessDocumentKey"),
			share: new ShareAction(this, {
				appTitleMsgKey: "APP_TITLE",
				objectIdProperty: "TransferDocumentNumber",
				objectTextProperty: "ExternalUUID"
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
      	for (var sName in this.actions) {
        	this.actions[sName].destroy();
        }
        
        // call the base component's destroy function
        DraftComponent.prototype.destroy.apply(this, arguments);
      }
    });
  }
);
