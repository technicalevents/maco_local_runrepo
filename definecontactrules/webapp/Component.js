sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/fnd/base/DraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateWithDialogAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/UpdateWithDialogAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/DeleteAction',
  ],
  function(DraftComponent, HashSync, CreateWithDialogAction, UpdateWithDialogAction, DeleteAction) {
    "use strict";

    return DraftComponent.extend("com.sap.cd.maco.monitor.ui.app.definecontactrules.Component", {
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
          create : new CreateWithDialogAction(oComponent, {
            fragmentName: 'com.sap.cd.maco.monitor.ui.app.definecontactrules.view.ContactRulesDialog',
            title: 'i18n text??',
            successMsg: 'i18n text??'
          }),
  
          update: new UpdateWithDialogAction(oComponent, {
            fragmentName: 'com.sap.cd.maco.mmt.ui.app.mgrpartners.page.listReport.ContactRulesDialog',
            title: 'i18n text??',
            successMsg: 'i18n text??'
          }),

          delete: new DeleteAction(oComponent, {
            confirmMsg1: 'i18n text??',
            successMsg1: 'i18n text??'
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
            return "contactrulesPage";
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
