sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
  "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
  "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateWithDialogAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/UpdateWithDialogAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/DeleteAction",
  "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction"
],
function(MonitorComponent, HashSync, CreateWithDialogAction, UpdateWithDialogAction, DeleteAction, ShareAction) {
  "use strict";

  return MonitorComponent.extend("com.sap.cd.maco.selfservice.ui.app.maintmsgcontacts.Component", {
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
      createContact : new CreateWithDialogAction(this, {
        fragmentName: "com.sap.cd.maco.selfservice.ui.app.maintmsgcontacts.view.ContactDialog",
        title: "NEW_CONTACT_LBL",
        successMsg: "CONTACT_CREATE_SUCCESS_MSG"
      }),
      updateContact: new UpdateWithDialogAction(this, {
        fragmentName: "com.sap.cd.maco.selfservice.ui.app.maintmsgcontacts.view.ContactDialog",
        title: "EDIT_CONTACT_LBL",
        successMsg: "CONTACT_UPDATE_SUCCESS_MSG"
      }),
      deleteContact: new DeleteAction(this, {
        confirmMsg1: "CONTACT_DELETE_CONFIRM_MSG",
        successMsg1: "CONTACT_DELETE_SUCCESS_MSG"
      }),
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
   * @public
   */
  initRouting: function() {
    // Sync hash
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
   * @public
   */
  destroy: function() {
    // Generic destroy of component
    MonitorComponent.prototype.destroy.apply(this, arguments);
  }
  });
});