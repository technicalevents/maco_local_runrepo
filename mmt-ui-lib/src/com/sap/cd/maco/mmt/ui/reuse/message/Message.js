sap.ui.define(
  [
    'jquery.sap.global',
    'sap/ui/base/Object',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/layout/VerticalLayout',
    'sap/m/Dialog',
    'sap/m/Button',
    'sap/m/Text',
    'sap/m/TextArea',
    'sap/m/FormattedText',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/message/ConfirmPopover',
    'com/sap/cd/maco/mmt/ui/reuse/device/contentDensity',
    'com/sap/cd/maco/mmt/ui/reuse/base/Assert'
  ],
  function(
    jQuery,
    Object,
    MessageBox,
    MessageToast,
    VerticalLayout,
    Dialog,
    Button,
    Text,
    TextArea,
    FormattedText,
    bundle,
    ConfirmPopover,
    contentDensity,
    Assert
  ) {
    'use strict';

    return Object.extend('com.sap.cd.maco.mmt.ui.reuse.message.Message', {
      //===========================
      // Lifecycle & Internal
      //===========================

      constructor: function(oComponent) {
        Object.apply(this, arguments);
        this._oAssert = oComponent.oAssert;
        this._oComponent = oComponent;
        this._oBundle = oComponent.getModel('i18n').getResourceBundle();
        this._sContentDensity = contentDensity.get();
      },

      destroy: function() {
        if (this._oConfirmPopover) {
          this._oConfirmPopover.destroy();
        }
      },

      //===========================
      // Public API
      //===========================

      success: function(params) {
        // check params
        this._oAssert.ok(params, 'cannot show success. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show success. msg or msgKey must be set');
        // optional: msgParams

        // show
        var sMessage = this._getMessage(params);
        MessageToast.show(sMessage, {
          closeOnBrowserNavigation: false
        });
      },

      info: function(params) {
        // check params
        this._oAssert.ok(params, 'cannot show info. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show info. msg or msgKey must be set');
        // optional: msgParams

        return new Promise(
          function(resolve, reject) {
            var sMessage = this._getMessage(params);
            MessageBox.information(sMessage, {
              styleClass: this._sContentDensity,
              onClose: resolve
            });
          }.bind(this)
        );
      },

      warning: function(params) {
        if (!params.details) {
          params.details = [];
        }

        // check params
        this._oAssert.ok(params, 'cannot show warning. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show warning. msg or msgKey must be set');
        this._oAssert.array(params.details, 'cannot show warning. details is not an array');
        // optional: msgParams

        return new Promise(
          function(resolve, reject) {
            // show
            var sMessage = this._getMessage(params);
            if (!params.details) {
              // show standard message box
              MessageBox.warning(sMessage, {
                styleClass: this._sContentDensity,
                actions: [MessageBox.Action.CLOSE],
                onClose: resolve
              });
            } else {
              // open detail message dialog
              var oDialog = this._createDetailMessageDialog(sMessage, params.details, resolve);
              oDialog.setIcon('sap-icon://message-warning');
              oDialog.setState('Warning');
              oDialog.setTitle(bundle.get().getText('messageWarningDialogTitle'));
              oDialog.open();
            }
          }.bind(this)
        );
      },

      error: function(params) {
        if (!params.details) {
          params.details = [];
        }

        // check params
        this._oAssert.ok(params, 'cannot show error. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show error. msg or msgKey must be set');
        this._oAssert.array(params.details, 'cannot show error. details is not an array');
        // optional: msgParams

        return new Promise(
          function(resolve, reject) {
            var sMessage = this._getMessage(params);
            if (!params.details || (params.details && params.details.length === 0)) {
              // show standard message box
              MessageBox.error(sMessage, {
                styleClass: this._sContentDensity,
                actions: [MessageBox.Action.CLOSE],
                onClose: resolve
              });
            } else {
              // open detail message dialog
              var oDialog = this._createDetailMessageDialog(sMessage, params.details, resolve);
              oDialog.setIcon('sap-icon://message-error');
              oDialog.setState('Error');
              oDialog.setTitle(bundle.get().getText('messageErrorDialogTitle'));
              oDialog.open();
            }
          }.bind(this)
        );
      },

      confirm: function(params) {
        if (!params.details) {
          params.details = [];
        }

        // check params
        this._oAssert.ok(params, 'cannot show confirm. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show confirm. msg or msgKey must be set');
        this._oAssert.ok(!params.popover || !params.warning, 'cannot show confirm. warning is not supported for popover');
        this._oAssert.ok(!params.popover || params.byControl, 'cannot show confirm. byControl is missing for popover');
        this._oAssert.ok(params.buttonText || params.buttonTextKey, 'cannot show confirm. buttonText and buttonTextKey missing');
        this._oAssert.array(params.details, 'cannot show notFound. details is not an array');
        // optional: msgParams
        // optional: buttonTextParams

        // get texts
        var sMessage = this._getMessage(params);
        var sButtonText = this._getButtonText(params);

        if (params.popover) {
          // instantiate popover lazily
          if (!this._oConfirmPopover) {
            this._oConfirmPopover = new ConfirmPopover({
              component: this._oComponent
            });
          }

          // show popover
          return this._oConfirmPopover.open({
            byControl: params.byControl,
            messageText: sMessage,
            buttonText: sButtonText
          });
        } else {
          // return promise
          return new Promise(
            function(resolve, reject) {
              // get config
              var oConfig = {
                title: sButtonText,
                styleClass: this._sContentDensity,
                actions: [sButtonText, MessageBox.Action.CANCEL],
                onClose: function(sAction) {
                  if (sAction === sButtonText) {
                    resolve();
                  } else {
                    reject();
                  }
                }
              };

              if (params.warning) {
                MessageBox.warning(sMessage, oConfig);
              } else {
                MessageBox.confirm(sMessage, oConfig);
              }
            }.bind(this)
          );
        }
      },

      input: function(params) {
        // check params
        this._oAssert.ok(params, 'cannot show input. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show input. msg or msgKey must be set');
        this._oAssert.ok(params.buttonText || params.buttonTextKey, 'cannot show input. buttonText and buttonTextKey missing');
        // optional: msgParams
        // optional: buttonTextParams
        // optional: optional

        if (!params.optional) {
          params.optional = false;
        }

        // get texts
        var sMessage = this._getMessage(params);
        var sButtonText = this._getButtonText(params);

        // return promise
        return new Promise(
          function(resolve, reject) {
            var oTextArea = new TextArea({
              width: '100%',
              rows: 3
            });
            var oLayout = new VerticalLayout();
            var oDialog = new Dialog({
              title: sButtonText,
              contentWidth: '18.75rem',
              content: [oLayout],
              buttons: [
                new Button({
                  text: sButtonText,
                  type: 'Emphasized',
                  press: function() {
                    if (!params.optional && !oTextArea.getValue()) {
                      oTextArea.setValueState('Error');
                    } else {
                      oTextArea.setValueState('None');
                      oDialog.close();
                      oDialog.destroy();
                      resolve({
                        value: oTextArea.getValue()
                      });
                    }
                  }
                }),
                new Button({
                  text: bundle.get().getText('messageInputCancel'),
                  press: function() {
                    oDialog.close();
                    oDialog.destroy();
                    reject();
                  }
                })
              ]
            });
            oDialog.addStyleClass(this._sContentDensity);
            oDialog.addStyleClass('sapUiContentPadding');

            // add main message
            var oText = new Text({ text: sMessage });
            oLayout.addContent(oText);
            oLayout.addContent(oTextArea);

            oDialog.open();
          }.bind(this)
        );
      },

      technicalError: function(params) {
        // check params
        this._oAssert.ok(params, 'cannot show technicalError. params missing');
        this._oAssert.ok(params.msg || params.msgKey, 'cannot show technicalError. msg or msgKey must be set');
        // optional: msgParams

        return new Promise(
          function(resolve, reject) {
            var sMessage = this._getMessage(params);
            var sStandardMessage = bundle.get().getText('messageTechnicalErrorOccured');
            MessageBox.error(sStandardMessage, {
              details: sMessage,
              styleClass: this._sContentDensity,
              actions: [MessageBox.Action.CLOSE]
            });
          }.bind(this)
        );
      },

      _getMessage: function(params) {
        if (params.msg) {
          return params.msg;
        } else {
          return this._oBundle.getText(params.msgKey, params.msgParams);
        }
      },

      _getButtonText: function(params) {
        if (params.buttonText) {
          return params.buttonText;
        } else {
          return this._oBundle.getText(params.buttonTextKey, params.buttonTextParams);
        }
      },

      _createDetailMessageDialog: function(sMainMessage, aDetailMessages, fnOnClose) {
        var oLayout = new VerticalLayout();
        var oDialog = new Dialog({
          type: 'Message',
          content: [oLayout],
          endButton: new Button({
            text: bundle.get().getText('messageErrorDialogCloseButton'),
            press: function() {
              oDialog.close();
              if (fnOnClose) {
                fnOnClose();
              }
            }
          })
        });
        oDialog.addStyleClass(this._sContentDensity);

        // add main message
        var oText = new Text({ text: sMainMessage });
        oLayout.addContent(oText);

        // add detail messages
        var sHtml = '<ul>';
        for (var i = 0; i < aDetailMessages.length; i++) {
          if (i < aDetailMessages.length - 1) {
            sHtml += "<li class='sapUiSmallMarginBottom'>" + aDetailMessages[i] + '</li>';
          } else {
            sHtml += '<li>' + aDetailMessages[i] + '</li>';
          }
        }
        sHtml += '</ul>';
        oLayout.addContent(new FormattedText({ htmlText: sHtml }));

        return oDialog;
      }
    });
  }
);
