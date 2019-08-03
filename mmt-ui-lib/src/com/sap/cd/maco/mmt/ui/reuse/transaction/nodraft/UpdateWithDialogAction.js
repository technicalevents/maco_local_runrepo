/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/transaction/nodraft/CreateUpdateDialogController'
  ],
  function(BaseAction, bundle, CreateUpdateDialogController) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.UpdateWithDialogAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.apply(this, arguments);
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      _getDialog: function(oController) {
        if (!this._oDialog) {
          // get dialog class
          var oDialogClass = this.oConfig.fragmentControllerClass ? this.oConfig.fragmentControllerClass : CreateUpdateDialogController;

          // get entity set
          var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oController.oConfig.entitySet;
          this.oAssert.ok(
            sEntitySet,
            'cannot instantiate dialog. no entitySet. configure the entitySet on the action or on the executing controller'
          );

          // get id
          var sId = this.oConfig.id ? this.oConfig.id : 'updateWithDialog' + sEntitySet;

          // create dialog
          this._oDialog = new oDialogClass({
            component: this.oComponent,
            view: null,
            entitySet: sEntitySet,
            fragmentName: this.oConfig.fragmentName,
            id: sId,
            updateTitle: this.oConfig.title,
            updateSuccessMsg: this.oConfig.successMsg
          });

          // check dialog class
          this.oAssert.subclass(
            this._oDialog,
            'com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.CreateUpdateDialogController',
            'cannot instantiate dialog. dialog class must a subclass of com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.CreateUpdateDialogController'
          );
        }
        return this._oDialog;
      },

      onExit: function() {
        if (this._oDialog) {
          this._oDialog.destroy();
        }
      },

      execute: function(oParams, oEvent, oController) {
        this.assertContextParam(oParams);
        return new Promise(
          function(resolve, reject) {
            var oDialog = this._getDialog(oController);
            var oWhen = oDialog.openForUpdate(oParams.contexts[0].getPath());
            oWhen.then(
              function() {
                resolve({
                  params: oParams
                });
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      }
    });
  }
);
