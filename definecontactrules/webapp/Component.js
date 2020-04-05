sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/fnd/base/NoDraftComponent",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateWithDialogAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/UpdateWithDialogAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/DeleteAction'
  ],
  function(NoDraftComponent, HashSync, CreateWithDialogAction, UpdateWithDialogAction, DeleteAction) {
    "use strict";

    return NoDraftComponent.extend("com.sap.cd.maco.selfservice.ui.app.definecontactrules.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize NoDraftComponent
       */
      init: function() {
        // call the base component's init function
        NoDraftComponent.prototype.init.apply(this, arguments);

        this.actions = {
          create : new CreateWithDialogAction(this, {
            fragmentName: 'com.sap.cd.maco.selfservice.ui.app.definecontactrules.view.ContactRulesDialog',
            title: 'CONTACTDETERMINATION_CREATE_TITLE',
            successMsg: 'CONTACTDETERMINATION_CREATE_SUCCESS_MSG'
          }),
  
          update: new UpdateWithDialogAction(this, {
            fragmentName: 'com.sap.cd.maco.selfservice.ui.app.definecontactrules.view.ContactRulesDialog',
            title: 'CONTACTDETERMINATION_EDIT_TITLE',
            successMsg: 'CONTACTDETERMINATION_EDIT_SUCCESS_MSG'
          }),

          delete: new DeleteAction(this, {
            confirmMsg1: 'CONTACTDETERMINATION_DELETE_CONFIRM_MSG',
            successMsg1: 'CONTACTDETERMINATION_DELETE_SUCCESS_MSG'
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
