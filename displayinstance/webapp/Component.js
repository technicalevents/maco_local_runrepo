sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/mmt/MmtComponent",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
     "com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToRouteAction",
     "com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction"
  ],
  function(MmtComponent, HashSync, NavToRouteAction, ShareAction) {
    "use strict";

    return MmtComponent.extend("com.sap.cd.us4g.DisplayInstance.Component", {
      metadata: {
        manifest: "json"
      },

      init: function() {
        // super
        MmtComponent.prototype.init.apply(this, arguments);

        // create actions
      this.mActions = {
        navToInstancePage: new NavToRouteAction(this),
        share: new ShareAction(this, {
          appTitleMsgKey: "APP_TITLE",
          objectIdProperty: "InstanceGuid",
        })
      };

        var oHashSync = new HashSync({
          component: this,
          message: this.oMessage,
          routeName: "InstanceDetailPage"
        });

        oHashSync.synch();

        // create the views based on the url/hash
        this.getRouter().initialize();
      },

      exit: function() {
        // super
        MmtComponent.prototype.exit.apply(this, arguments);
        this.actions.destroy();
      }
    });
  }
);