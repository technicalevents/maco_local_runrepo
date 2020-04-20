sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/fnd/base/DraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
    "com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToRouteAction"
  ],
  function(DraftComponent, HashSync, NavToRouteAction) {
    "use strict";

    return DraftComponent.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize DraftComponent
       * @public
       */
      init: function() {
        // call the base component"s init function
        DraftComponent.prototype.init.apply(this, arguments);

        this.actions = {
        	navToPartnerPage: new NavToRouteAction(this)
        };

        this.initRouting();
      },

      /**
       * Function is used to initialize Router
       * @public
       */
      initRouting: function() {
        // sync hash
        var oHashSync = new HashSync({
          component: this,
          message: this.oMessage,
          getRouteName: function(startupParams) {
            return "partnerPage";
          }
        });
        oHashSync.synch();

        // create the views based on the url/hash
        this.getRouter().initialize();
      }
    });
  }
);
