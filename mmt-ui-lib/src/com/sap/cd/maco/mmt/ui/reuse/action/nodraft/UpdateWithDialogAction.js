/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, CreateUpdateDialogController, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.UpdateWithDialogAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
      },

      /**
       * @deprecated
       */
      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      _getDialog: function(oController, oDialogClass) {
        if (!this._oDialog) {
          // get entity set
          var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oController.oConfig.entitySet;
          Assert.ok(sEntitySet, 'cannot instantiate dialog. no entitySet. configure the entitySet on the action or on the executing controller');

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
          Assert.subclass(
            this._oDialog,
            'com.sap.cd.maco.mmt.ui.reuse.action.nodraft.CreateUpdateDialogController',
            'cannot instantiate dialog. dialog class must a subclass of com.sap.cd.maco.mmt.ui.reuse.action.nodraft.CreateUpdateDialogController'
          );
        }
        return this._oDialog;
      },

      onExit: function() {
        if (this._oDialog) {
          this._oDialog.destroy();
        }
      },

      _getDialogClass: function() {
        return new Promise(
          function(resolve, reject) {
            if (typeof this.oConfig.fragmentControllerClass === 'string') {
              var sClass = this.oConfig.fragmentControllerClass.replace(/\./g, '/');
              sap.ui.require([sClass], function(oClass) {
                resolve(oClass);
              });
            } else {
              var oClass = this.oConfig.fragmentControllerClass ? this.oConfig.fragmentControllerClass : CreateUpdateDialogController;
              resolve(oClass);
            }
          }.bind(this)
        );
      },

      execute: function(oParams) {
        this.assertContextParam(oParams);
        return new Promise(
          function(resolve, reject) {
            this._getDialogClass().then(
              function(oClass) {
                var oDialog = this._getDialog(oParams.controller, oClass);
                var oWhen = oDialog.openForUpdate(oParams.contexts[0].getPath());
                oWhen.then(
                  function() {
                    resolve({
                      params: oParams
                    });
                  }.bind(this),
                  reject
                );
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      }
    });
  }
);
