/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/controller/base/BaseFragmentController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/CallWithMessageHandling',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getTransaction'
  ],
  function(BaseFragmentController, bundle, CallWithMessageHandling, Assert, getMessage, getTransaction) {
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

        // set fragment model
        this.initFragmentModel();
        var oFragmentModel = this.getFragmentModel();
        oFragmentModel.setProperty('/title', null);
        oFragmentModel.setProperty('/saveButtonText', null);
        oFragmentModel.setProperty('/cancelButtonText', bundle.getText('buttonCancel'));

        // init call with message handling
        this._oCallWith = new CallWithMessageHandling(this);

        // why change the UI5 default?
        // the smart table changed it too, and it looks real strange if the dialog on top of the table starts later
        this.getFragment().setBusyIndicatorDelay(0);
      },

      //~~~~ create ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onOpenForCreate: function(oProperties) {},

      openForCreate: function(oProperties) {
        this._bSubmitted = false;

        this.onOpenForCreate(oProperties);

        // set fragment model
        var sTitle = this._getConfigText('createTitle', 'transactionDialogCreateTitle');
        var oFragmentModel = this.getFragmentModel();
        oFragmentModel.setProperty('/title', sTitle);
        oFragmentModel.setProperty('/saveButtonText', bundle.getText('buttonCreate'));
        oFragmentModel.setProperty('/isCreate', true);
        oFragmentModel.setProperty('/isUpdate', false);

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

      onOpenForUpdate: function(sPath) {},

      openForUpdate: function(sPath) {
        this._bSubmitted = false;

        this.onOpenForUpdate(sPath);

        // set fragment model
        var sTitle = this._getConfigText('updateTitle', 'transactionDialogUpdateTitle');
        var oFragmentModel = this.getFragmentModel();
        oFragmentModel.setProperty('/title', sTitle);
        oFragmentModel.setProperty('/saveButtonText', bundle.getText('buttonSave'));
        oFragmentModel.setProperty('/isCreate', false);
        oFragmentModel.setProperty('/isUpdate', true);

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
        var oTransaction = getTransaction(this);
        var fnCall = oTransaction.whenSubmitted.bind(oTransaction, {
          busyControl: this.getFragment()
        });
        var oWhen = this._oCallWith.whenCalled(fnCall, this.oConfig.manageMessagesClient, this.oConfig.manageMessagesServer);
        oWhen.then(
          // resolve
          function(oResult) {
            // close dialog
            this._bSubmitted = true;
            this.getFragment().close();

            var oFragmentModel = this.getFragmentModel();
            var bIsCreate = oFragmentModel.getProperty('/isCreate');
            if (bIsCreate) {
              // resolve & message for create is done in other place (we need the result data)
            } else {
              var oContext = this.getFragment().getBindingContext();
              var oObject = oContext.getObject();
              var sMessage = this._getConfigText('updateSuccessMsg', 'transactionDialogUpdateSuccess');
              getMessage(this).success({ msg: sMessage });
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
        var sMessage = this._getConfigText('createSuccessMsg', 'transactionDialogCreateSuccess');
        getMessage(this).success({ msg: sMessage });
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
            var oFragmentModel = this.getFragmentModel();
            var bIsCreate = oFragmentModel.getProperty('/isCreate');
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
      },

      _getConfigText: function(sKey, sDefault) {
        if (!this.oConfig || !this.oConfig[sKey]) {
          return bundle.getText(sDefault);
        } else {
          var sResult = this.oBundle.getText(this.oConfig[sKey]);
          Assert.ok(sResult !== this.oConfig[sKey], 'the key ' + this.oConfig[sKey] + ' does not exist in the apps i18n file');
          return sResult;
        }
      }
    });
  }
);
