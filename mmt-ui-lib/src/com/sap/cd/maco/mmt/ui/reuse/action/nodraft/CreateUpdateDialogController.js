/*global location*/
sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseFragmentController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/CallWithMessageHandling',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/getConfigText',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(JSONModel, BaseFragmentController, bundle, CallWithMessageHandling, getConfigText, Assert) {
    'use strict';

    return BaseFragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.CreateUpdateDialogController', {
      //~~~~ init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      constructor: function(oConfig) {
        // super
        BaseFragmentController.apply(this, arguments);

        // default config
        if (!oConfig.hasOwnProperty('manageMessagesClient')) {
          oConfig.manageMessagesClient = true;
        }
        if (!oConfig.hasOwnProperty('manageMessagesServer')) {
          oConfig.manageMessagesServer = true;
        }

        // check config
        // others checked by BaseFragmentController
        Assert.ok(oConfig.entitySet, 'cannot init CreateUpdateDialogController. no entitySet');
        this.oConfig = oConfig;
      },

      onInit: function() {
        // call overwritten onInit
        BaseFragmentController.prototype.onInit.apply(this, arguments);

        // set view model
        var oViewModel = new JSONModel({
          title: null,
          saveButtonText: null,
          cancelButtonText: bundle.getText('buttonCancel')
        });
        this.getFragment().setModel(oViewModel, 'this');

        // init call with message handling
        this._oCallWith = new CallWithMessageHandling(this);

        // why change the UI5 default?
        // the smart table changed it too, and it looks real strange if the dialog on top of the table starts later
        this.getFragment().setBusyIndicatorDelay(0);
      },

      _getConfigText: function(sKey, sDefault, oObject) {
        return getConfigText(this, this.oConfig, sKey, sDefault, oObject);
      },

      //~~~~ create ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onOpenForCreate: function() {},

      openForCreate: function(oProperties) {
        this._bSubmitted = false;

        this.onOpenForCreate();

        // set view model
        var sTitle = this._getConfigText('createTitle', 'transactionDialogCreateTitle', null);
        var oViewModel = this.getThisModel();
        oViewModel.setProperty('/title', sTitle);
        oViewModel.setProperty('/saveButtonText', bundle.getText('buttonCreate'));
        oViewModel.setProperty('/isCreate', true);
        oViewModel.setProperty('/isUpdate', false);

        // reset messages
        // (also done by UI5 on binding but very few sometimes a value state was not reset)
        this._oCallWith.reset();

        // clean UI to not see old data
        this.getFragment().unbindElement();

        // open
        this.getFragment().open();

        // create a entry
        var sPath = '/' + this.oConfig.entitySet;
        var oContext = this.oModel.createEntry(sPath, {
          properties: oProperties,
          success: this._onSubmitCreateSuccess.bind(this)
        });

        this.getFragment().bindElement({
          path: oContext.getPath()
        });

        // return promise
        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;
          }.bind(this)
        );
      },

      //~~~~ update ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onOpenForUpdate: function() {},

      openForUpdate: function(sPath) {
        this._bSubmitted = false;

        this.onOpenForUpdate();

        // set view model
        var sTitle = this._getConfigText('updateTitle', 'transactionDialogUpdateTitle', null);
        var oViewModel = this.getThisModel();
        oViewModel.setProperty('/title', sTitle);
        oViewModel.setProperty('/saveButtonText', bundle.getText('buttonSave'));
        oViewModel.setProperty('/isCreate', false);
        oViewModel.setProperty('/isUpdate', true);

        // reset messages
        // (also done by UI5 on binding but very few sometimes a value state was not reset)
        this._oCallWith.reset();

        // clean UI to not see old data
        this.getFragment().unbindElement();

        // bind
        this.getFragment().setBusy(true);
        this.getFragment().bindElement({
          path: sPath,
          events: {
            change: function() {
              this.getFragment().setBusy(false);
              if (this.onFragmentBound) {
                this.onFragmentBound();
              }
            }.bind(this)
          }
        });

        // open
        this.getFragment().open();

        // return promise
        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;
          }.bind(this)
        );
      },

      //~~~~ submit / cancel ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onSubmit: function() {
        var fnCall = this.oTransaction.whenSubmitted.bind(this.oTransaction, {
          busyControl: this.getFragment()
        });
        var oWhen = this._oCallWith.whenCalled(fnCall, this.oConfig.manageMessagesClient, this.oConfig.manageMessagesServer);
        oWhen.then(
          // resolve
          function(oResult) {
            // close dialog
            this._bSubmitted = true;
            this.getFragment().close();

            var oViewModel = this.getThisModel();
            var bIsCreate = oViewModel.getProperty('/isCreate');
            if (bIsCreate) {
              // resolve & message for create is done in other place (we need the result data)
            } else {
              var oContext = this.getFragment().getBindingContext();
              var oObject = oContext.getObject();
              var sMessage = this._getConfigText('updateSuccessMsg', 'transactionDialogUpdateSuccess', oObject);
              this.oMessage.success({ msg: sMessage });
              this._fnResolve();
            }
          }.bind(this),

          // reject
          function() {
            // do not reject to outside yet, only on close
          }
        );
      },

      _onSubmitCreateSuccess: function(oData) {
        var sMessage = this._getConfigText('createSuccessMsg', 'transactionDialogCreateSuccess', oData);
        this.oMessage.success({ msg: sMessage });
        this._fnResolve({
          data: oData
        });
      },

      onAfterClose: function() {
        // this function is also called when the dialog is cancelled by pressing the ESC key

        if (!this._bSubmitted) {
          // undo changes if not submitted
          var oDialog = this.getFragment();
          var oContext = oDialog.getBindingContext();
          if (oContext) {
            var oViewModel = this.getThisModel();
            var bIsCreate = oViewModel.getProperty('/isCreate');
            if (bIsCreate) {
              this.oModel.deleteCreatedEntry(oContext);
            } else {
              this.oModel.resetChanges([oContext.getPath()]);
            }
          }

          // reject
          this._fnReject();
        }
      },

      onCancel: function() {
        this.getFragment().close();
        // the undo is done in _onAfterClose
      }
    });
  }
);
