sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
  "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
  "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/SingleDownloadAction",
  "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/MultiDownloadAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToRouteAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToProcessAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMessageAction",
  "com/sap/cd/maco/monitor/ui/app/displaymessages/actions/MultipleDocumentAction"
],function(MonitorComponent, HashSync, SingleDownloadAction, MultiDownloadAction, 
          NavToRouteAction, ShareAction, NavToProcessAction, NavToMessageAction,
          MultipleDocumentAction) {
  "use strict";

  return MonitorComponent.extend("com.sap.cd.maco.monitor.ui.app.displaymessages.Component", {
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
        singleDownload: new SingleDownloadAction(this),
        multiDownload: new MultiDownloadAction(this),
        navToMessagePage: new NavToRouteAction(this),
        navListToProcessApp: new NavToProcessAction(this, "ProcessDocumentKey", "ProcessID"),
        navObjectTableToProcessApp: new NavToProcessAction(this, "ProcessDocumentKey", "SemanticType"),
        navObjectToProcessApp: new NavToProcessAction(this, "LinkedDocumentKey", "SemanticType"),
        navObjectToMessageApp: new NavToMessageAction(this, "LinkedDocumentKey"),
        multipleDoc: new MultipleDocumentAction(this),
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
        message: this.mSingles.message,
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
      MonitorComponent.prototype.destroy.apply(this, arguments);
    }
  });
});