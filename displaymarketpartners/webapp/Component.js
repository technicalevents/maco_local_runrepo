sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/fnd/base/DraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync"
  ],
  function(DraftComponent, HashSync) {
    "use strict";

    return DraftComponent.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.Component", {
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
