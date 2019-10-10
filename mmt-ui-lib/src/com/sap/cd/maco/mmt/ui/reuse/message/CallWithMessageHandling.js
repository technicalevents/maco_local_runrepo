sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/message/_/MandatoryCheck'], function(
  Object,
  bundle,
  MandatoryCheck
) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.message.CallWithMessageHandling', {
    constructor: function(oController) {
      this._oController = oController;
      if (this._oController.getView) {
        this._oView = this._oController.getView();
        this._oMandatoryCheck = new MandatoryCheck(this._oView, oController.oAssert);
      } else if (this._oController.getFragment) {
        this._oFragment = this._oController.getFragment();
        this._oMandatoryCheck = new MandatoryCheck(this._oFragment, oController.oAssert);
      } else {
        this._oController.oAssert.ok(false, 'the controller ' + oController + ' has no view or fragment');
      }
    },

    reset: function() {
      // reset value states
      this._oMandatoryCheck.resetValueStates();

      // reset message model
      if (this._oView) {
        var oMessageModel = this._getMessageModel();
        oMessageModel.updateMessages([]);
      }
    },

    whenCalled: function(fnCall, bClient, bServer) {
      if (this._oView) {
        return this._callView(fnCall, bClient, bServer);
      } else {
        return this._callFragment(fnCall, bClient, bServer);
      }
    },

    _getMessageModel: function() {
      var oMessageModel = this._oController.oComponent.getModel('message');
      this._oController.oAssert.ok(oMessageModel, "no 'message' model on component");
      this._oController.oAssert.ok(oMessageModel.isCustomMessageModel, 'the message model is not a custom message model');
      return oMessageModel;
    },

    _callView: function(fnCall, bClient, bServer) {
      return new Promise(
        function(resolve, reject) {
          // get message button
          var oMessageButton = this._oController.byId('messageButton');
          if (!oMessageButton) {
            this._oController.oAssert.ok(false, "cannot make call with message handling. no 'messageButton' for controller " + this._oController);
          }

          // get message model
          var oMessageModel = this._getMessageModel();

          // validate client messages
          if (bClient) {
            var aMessages = this._oMandatoryCheck.check();
            if (aMessages.length > 0) {
              oMessageButton.showPopover();
              oMessageModel.updateMessages(aMessages);
              reject();
              return;
            }
          }

          // reset the messages before firing the call
          // (otherwise we have them double times)
          oMessageModel.updateMessages([]);

          // call the promise
          var oPromise = fnCall.call();
          oPromise.then(
            resolve,
            function() {
              if (bServer) {
                var sMsg = bundle.get().getText('messageCallInputError');
                this._oController.oErrorManager.replaceBusinessMessage(sMsg);
                this._oController.oErrorManager.showInPopover(oMessageButton);
                reject();
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },

    _callFragment: function(fnCall, bClient, bServer) {
      return new Promise(
        function(resolve, reject) {
          // validate client messages
          if (bClient) {
            var aMessages = this._oMandatoryCheck.check();
            if (aMessages.length > 0) {
              reject();
              return;
            }
          }

          // call the promise
          var oPromise = fnCall.call();
          oPromise.then(
            resolve,
            function() {
              if (bServer) {
                var sMsg = bundle.get().getText('messageCallInputError');
                this._oController.oErrorManager.replaceBusinessMessage(sMsg);
                reject();
              }
            }.bind(this)
          );
        }.bind(this)
      );
    }
  });
});
