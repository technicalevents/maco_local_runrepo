sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
  "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
  "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateWithDialogAction",
  "com/sap/cd/maco/selfservice/ui/app/usernotifications/view/NotificationDialog",
  "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/DeleteAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction"
],function(MonitorComponent, HashSync, CreateWithDialogAction, NotificationDialog, DeleteAction, ShareAction) {
  "use strict";

  return MonitorComponent.extend("com.sap.cd.maco.selfservice.ui.app.usernotifications.Component", {
    metadata: {
      manifest: "json"
    },

    /**
     * Function is used to initialize MonitorComponent
     * @public
     */
    init: function() {
      // call the base component"s init function
      MonitorComponent.prototype.init.apply(this, arguments);
      
      this.mActions = {
        createNotification : new CreateWithDialogAction(this, {
          fragmentName: "com.sap.cd.maco.selfservice.ui.app.usernotifications.view.NotificationDialog",
          fragmentControllerClass: NotificationDialog,
          title: "NEW_NOTIFICATION_LBL",
          successMsg: "NOTIFICATION_CREATE_SUCCESS_MSG"
        }),
        deleteNotification: new DeleteAction(this, {
          confirmMsg1: "NOTIFICATION_DELETE_CONFIRM_MSG",
          successMsg1: "NOTIFICATION_DELETE_SUCCESS_MSG"
        }),
        share: new ShareAction(this, {
          appTitleMsgKey: "APP_TITLE",
          objectIdProperty: "NotificationKey",
          objectTextProperty: "Title"
        })
      };
      
      this.initRouting();
    },
    
    /**
     * Function is used to initialize Router
     * @public
     */
    initRouting: function() {
      // Sync hash
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