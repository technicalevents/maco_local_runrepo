sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/odata/ODataResponseParser', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(
  UI5Object,
  ODataResponseParser,
  bundle
) {
  'use strict';

  return UI5Object.extend('com.sap.cd.maco.mmt.ui.reuse.message.MessageManager', {
    constructor: function(params) {
      // keep stuff
      this._oComponent = params.component;
      this._oMessage = params.message;
      this._oInput = {};

      // attach events
      var oModel = this._oComponent.getModel();
      oModel.attachEvent('metadataFailed', this._onMetadataFailed, this);
      oModel.attachEvent('requestFailed', this._onRequestFailed, this);
    },

    destroy: function() {
      // detach events
      var oModel = this._oComponent.getModel();
      oModel.detachEvent('metadataFailed', this._onMetadataFailed, this);
      oModel.detachEvent('requestFailed', this._onRequestFailed, this);
    },

    replaceBusinessMessage: function(sMessage) {
      this._oInput.businessMessage = sMessage;
      this._triggerHandle();
    },

    addTechnicalMessage: function(sMessage) {
      this._oInput.technicalMessage = sMessage;
      this._triggerHandle();
    },

    whenDialogClosed: function() {
      return new Promise(
        function(resolve, reject) {
          this._oInput.onClose = resolve;
        }.bind(this)
      );
    },

    showInPopover: function(oMessageButton) {
      // check input
      if (!oMessageButton) {
        throw new Error('cannot showMessagePopover. oMessageButton is required');
      }

      // store stuff
      this._oInput.popover = true;
      this._oInput.messageButton = oMessageButton;

      // trigger handling
      this._triggerHandle();
    },

    skip: function() {
      this._oInput.skip = true;
      this._triggerHandle();
    },

    hasMessages: function() {
      return !!this._oInput.message;
    },

    //===========================
    // Private
    //===========================

    _onMetadataFailed: function(oEvent) {
      this._oInput.response = oEvent.getParameter('response');
      this._oInput.message = 'Failed to load the OData metadata';
      this._triggerHandle();
    },

    _onRequestFailed: function(oEvent) {
      this._oInput.response = oEvent.getParameter('response');
      this._oInput.method = oEvent.getParameter('method');
      this._oInput.url = oEvent.getParameter('url');
      this._oInput.message = 'Failed to ' + this._oInput.method + ' ' + this._oInput.url;
      this._triggerHandle();
    },

    _triggerHandle: function() {
      if (!this._bHandleTriggered) {
        this._bHandleTriggered = true;
        setTimeout(this._handle.bind(this), 0);
      }
    },

    _handle: function() {
      // skip requested?
      if (this._oInput.skip) {
        this._oInput = {};
        return;
      }

      // parse
      var oParserInput = {
        method: this._oInput.method,
        url: this._oInput.url
      };
      var oParser = new ODataResponseParser(this._oInput.response, oParserInput);

      // sometimes they status code as integer sometimes as string
      var sStatusCode = this._oInput.response.statusCode;
      if (typeof sStatusCode === 'number') {
        sStatusCode = '' + sStatusCode;
      }

      // handle depending on status code, in general:
      // 4×× = client error
      // 5×× = server error
      var bClientError = this._startsWith(sStatusCode, '4');
      if (bClientError) {
        if (sStatusCode === '412') {
          this._handleETagError();
        } else if (this._oInput.popover) {
          this._handleBusinessErrorWithPopover(oParser);
        } else {
          this._handleBusinessErrorWithDialog(oParser);
        }
      } else {
        if (sStatusCode === '504') {
          this._handleTimeoutError();
        } else {
          this._handleTechnicalError(oParser);
        }
      }

      // reset for next round
      this._oInput = {};
      this._bHandleTriggered = false;
    },

    _startsWith: function(sString, sSub) {
      var bResult = sString.lastIndexOf(sSub, 0) === 0;
      return bResult;
    },

    _showError: function(params) {
      this._oMessage.error(params).then(
        function() {
          if (this._oInput.onClose) {
            this._oInput.onClose();
          }
        }.bind(this),
        function() {}
      );
    },

    _handleETagError: function() {
      this._showError({
        msg: bundle.get().getText('messageManagerETagError')
      });
    },

    _handleTimeoutError: function() {
      this._showError({
        msg: bundle.get().getText('messageManagerTimeoutError')
      });
    },

    _handleBusinessErrorWithPopover: function(oParser) {
      // get message model
      var oMessageModel = this._oComponent.getModel('message');
      if (!oMessageModel) {
        throw new Error("no model with name 'message'");
      }
      if (!oMessageModel.isCustomMessageModel) {
        throw new Error('the message model is not a custom message model');
      }

      // set messages
      var aDetailMessages = oParser.getErrorDetailMessages();
      oMessageModel.updateMessages(aDetailMessages);

      // show dialog
      var oButton = this._oInput.messageButton;
      var sMessage = this._oInput.businessMessage ? this._oInput.businessMessage : oParser.getErrorMessage();
      this._oMessage
        .error({
          msg: sMessage
        })
        .then(
          function() {
            oButton.showPopover();
            if (this._oInput.onClose) {
              this._oInput.onClose();
            }
          }.bind(this),
          function() {}
        );
    },

    _handleBusinessErrorWithDialog: function(oParser) {
      // create params
      var params = {
        msg: this._oInput.businessMessage ? this._oInput.businessMessage : oParser.getErrorMessage(),
        details: oParser.getErrorDetailMessagesAsString(false)
      };

      // skip detail message if the same as the main message
      if (params.details && params.details.length === 1 && params.details[0] === params.msg) {
        delete params.details;
      }

      // show dialog
      this._showError(params);
    },

    _handleTechnicalError: function(oParser) {
      // create params
      var params = {
        msg: bundle.get().getText('messageTechnicalErrorOccured'),
        details: []
      };

      // add detail messages
      if (this._oInput.technicalMessage) {
        params.details.push(this._oInput.technicalMessage);
      }
      params.details.push(this._oInput.message);
      if (oParser.getErrorMessage()) {
        params.details.push(oParser.getErrorMessage());
      }
      params.details.push('More details in the browser console'); // details are not translated

      // show dialog
      this._showError(params);

      // log error
      var oParsedResponse = oParser.getParsedResponse();
      var sLogDetails = JSON.stringify(oParsedResponse, null, '\t');
      var sLogMessage = 'Request Error Details\n' + sLogDetails;
      jQuery.sap.log.error(sLogMessage);
    }
  });
});
