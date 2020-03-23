sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/fnd/base/DraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
    // "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction",
    // "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToProcessAction",
    // "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMessageAction"
  ],
  function(DraftComponent, HashSync, ShareAction, NavToProcessAction, NavToMessageAction) {
    "use strict";

    return DraftComponent.extend("com.sap.cd.maco.monitor.ui.app.maintmsgcontacts.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize DraftComponent
       */
      init: function() {
        // call the base component's init function
        DraftComponent.prototype.init.apply(this, arguments);

        // this.actions = {
          // navToUploadProcessAction: new NavToProcessAction(this, "MassUploadProcessKey", "MassUploadProcessID"),
          // navToAggrProcessAction: new NavToProcessAction(this, "AggregationProcessKey", "AggregationProcessID"),
          // navToMessageAction: new NavToMessageAction(this, "MessageReferenceUUID"),
          // share: new ShareAction(this, {
          //   appTitleMsgKey: "APP_TITLE",
          //   objectIdProperty: "CommonAccessUUID",
          //   objectTextProperty: "PointOfDelivery"
          // })
        // };

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
            return "listReport";
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
        // for (var sName in this.actions) {
        //   this.actions[sName].destroy();
        // }
        
        // generic destroy of component
        DraftComponent.prototype.destroy.apply(this, arguments);
      }
    });
});