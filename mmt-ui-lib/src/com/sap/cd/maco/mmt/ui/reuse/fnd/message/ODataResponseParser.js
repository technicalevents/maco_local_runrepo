sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/core/MessageType'], function(jQuery, Object, MessageType) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.message.ODataResponseParser', {
    constructor: function(oResponse, oInclude) {
      if (!oResponse) {
        return;
      }
      if (!oInclude) {
        oInclude = {};
      }
      this._oResult = jQuery.extend(true, oInclude, oResponse);
      this._parseResponseText(oResponse);
      this._parseSapMessage(oResponse);
    },

    getParsedResponse: function() {
      return this._oResult;
    },

    getErrorMessage: function() {
      return this._sErrorMessage;
    },

    getErrorDetailMessages: function() {
      return this._aErrorDetailMessages;
    },

    getErrorDetailMessagesAsString: function(bIncludeType) {
      return this._messages2String(this._aErrorDetailMessages, bIncludeType);
    },

    getSapMessages: function() {
      return this._aSapMessages;
    },

    getSapMessagesAsString: function(bIncludeType) {
      return this._messages2String(this._aSapMessages, bIncludeType);
    },

    _messages2String: function(aMessages, bIncludeType) {
      var aResult = [];
      aMessages.forEach(function(oMessage) {
        var sMessage = oMessage.message;
        if (bIncludeType) {
          sMessage += ' (' + oMessage.type + ')';
        }
        aResult.push(sMessage);
      });
      return aResult;
    },

    _parseResponseText: function(oResponse) {
      this._sErrorMessage = null;
      this._aErrorDetailMessages = [];

      // parse response text
      if (!oResponse.responseText) {
        return;
      }
      try {
        // parse JSON
        var oResponseText = JSON.parse(oResponse.responseText);
      } catch (e) {
        try {
          // parse XML
          oResponseText = {};
          var xml = jQuery.parseXML(oResponse.responseText);
          var jXml = jQuery(xml);
          oResponseText.code = jXml.find('code').text();
          oResponseText.message = jXml.find('message').text();
          oResponseText.timestamp = jXml.find('timestamp').text();
        } catch (e) {
          this._sErrorMessage = oResponse.responseText;
          jQuery.sap.log.error('failed to parse oResponse text: ' + oResponse.responseText);
          return;
        }
      }
      this._oResult.responseText = oResponseText;

      // error detail messages
      if (oResponseText.error) {
        if (oResponseText.error.message) {
          this._sErrorMessage = oResponseText.error.message.value;
        }
        if (oResponseText.error.innererror && oResponseText.error.innererror.errordetails && oResponseText.error.innererror.errordetails.length > 0) {
          // multiple detail messages
          oResponseText.error.innererror.errordetails.forEach(
            function(oDetail) {
              this._aErrorDetailMessages.push({
                message: oDetail.message,
                code: oDetail.code,
                type: this._getMessageType(oDetail.severity),
                technical: false
              });
            }.bind(this)
          );
        } else {
          // only a single message
          this._aErrorDetailMessages.push({
            message: oResponseText.error.message.value,
            code: oResponseText.error.code,
            type: MessageType.Error,
            technical: false
          });
        }
      }
    },

    _parseSapMessage: function(oResponse) {
      this._aSapMessages = [];

      // check header
      var sSapMessageHeader = oResponse.headers['sap-message'];
      if (!sSapMessageHeader) {
        return;
      }

      // parse
      try {
        var json = JSON.parse(sSapMessageHeader);
      } catch (e) {
        return;
      }

      // copy all properties back to oResponse
      this._oResult['sap-message'] = {};
      jQuery.each(
        json,
        function(property, value) {
          this._oResult['sap-message'][property] = value;
        }.bind(this)
      );

      // first message
      this._aSapMessages.push({
        message: json.message,
        code: json.code,
        target: json.target,
        type: this._getMessageType(json.severity),
        technical: false
      });

      // details messages
      if (json.details) {
        json.details.forEach(
          function(oDetail) {
            this._aSapMessages.push({
              message: oDetail.message,
              code: oDetail.code,
              target: oDetail.target,
              type: this._getMessageType(oDetail.severity),
              technical: false
            });
          }.bind(this)
        );
      }
    },

    _mMessageTypes: {
      info: MessageType.Information,
      information: MessageType.Information,
      error: MessageType.Error,
      warning: MessageType.Warning,
      success: MessageType.Success,
      none: MessageType.None
    },

    _getMessageType: function(sSeverity) {
      if (!sSeverity) {
        return MessageType.None;
      }
      var sResult = this._mMessageTypes[sSeverity];
      if (!sResult) {
        return MessageType.None;
      } else {
        return sResult;
      }
    }
  });
});
