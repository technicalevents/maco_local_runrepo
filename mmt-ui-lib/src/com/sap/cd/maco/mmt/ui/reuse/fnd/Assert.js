/* eslint no-console: "off"  */
sap.ui.define(
  [
    'sap/ui/base/Object',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'sap/m/Dialog',
    'sap/m/Text',
    'sap/m/Button',
    'sap/ui/core/Icon',
    'sap/m/HBox',
    'sap/m/VBox'
  ],
  function(Object, UI5Metadata, Dialog, Text, Button, Icon, HBox, VBox) {
    'use strict';

    return {
      int: function(iNumber, sMessage) {
        if (!Number.isInteger(iNumber)) {
          var oError = new Error(sMessage);
          this._showAndLog(oError);
          throw oError;
        }
      },

      ok: function(oValue, sMessage) {
        if (!oValue) {
          var oError = new Error(sMessage);
          this._showAndLog(oError);
          throw oError;
        }
      },

      function: function(fnFunction, sMessage) {
        if (!this._isFunction(fnFunction)) {
          var oError = new Error(sMessage);
          this._showAndLog(oError);
          throw oError;
        }
      },

      _isFunction: function(fnFunction) {
        return !!fnFunction && {}.toString.call(fnFunction) === '[object Function]';
      },

      array: function(oObject, sMessage) {
        if (!Array.isArray(oObject)) {
          var oError = new Error(sMessage);
          this._showAndLog(oError);
          throw oError;
        }
      },

      instance: function(oObject, sClassName, sMessage) {
        if (!UI5Metadata.isInstance(oObject, sClassName)) {
          var oError = new Error(sMessage);
          this._showAndLog(oError);
          throw oError;
        }
      },

      subclass: function(oObject, sClassName, sMessage) {
        if (!UI5Metadata.isSubclass(oObject, sClassName)) {
          var oError = new Error(sMessage);
          this._showAndLog(oError);
          throw oError;
        }
      },

      _showAndLog: function(oError) {
        // async show
        setTimeout(function() {
          var oIcon = new Icon({
            src: 'sap-icon://collision',
            size: '5rem',
            color: 'rgb(187,15,23)'
          });
          oIcon.addStyleClass('sapUiSmallMarginEnd');
          var oMoreText = new Text({ text: 'Find the full stack trace in the console' });
          oMoreText.addStyleClass('sapUiSmallMarginTop');
          var oText = new Text({});
          oText.setText(oError.message); // must use setter for the message as the constructor interprets "{" as binding syntax
          var oDialog = new Dialog({
            type: 'Message',
            contentWidth: '440px',
            icon: 'sap-icon://xxx', // disables the icon
            title: 'Assertion Failed',
            content: [
              new HBox({
                items: [
                  oIcon,
                  new VBox({
                    items: [oText, oMoreText]
                  })
                ]
              })
            ],
            endButton: new Button({
              text: 'Close',
              press: function() {
                oDialog.close();
              }
            })
          });
          oDialog.open();
        }, 0);

        // to console
        if (console && console.error) {
          console.error(oError);
        }
      }
    };
  }
);
