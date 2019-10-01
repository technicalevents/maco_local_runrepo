sap.ui.define(
  [
    'sap/ui/base/Object',
    'com/sap/cd/maco/mmt/ui/reuse/message/_/InputSearch',
    'sap/ui/core/MessageType',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/base/Assert'
  ],
  function (UI5Object, InputSearch, MessageType, bundle, Assert) {
    'use strict';

    return UI5Object.extend('com.sap.cd.maco.mmt.ui.reuse.message._.MandatoryCheck', {
      constructor: function (oControl, oAssert) {
        this._oInputSearch = new InputSearch(oControl);
        this._oAssert = oAssert;
      },

      check: function () {
        // get input controls
        var aInputControls = this._oInputSearch.search();

        // check that mandatory fields have values
        this._checkMandatoryControls(aInputControls);

        // collect all messages
        var aMessages = this._collectInputMessages(aInputControls);

        // done
        return aMessages;
      },

      resetValueStates: function () {
        // get input controls
        var aInputControls = this._oInputSearch.search();

        // iterate all
        for (var j = 0; j < aInputControls.length; j++) {
          var oControl = aInputControls[j];
          if (!oControl.setValueState || !oControl.setValueStateText) {
            throw new Error('control ' + oControl + ' does not have value state functions');
          }
          oControl.setValueState('None');
          oControl.setValueStateText(null);
        }
      },

      _checkMandatoryControls: function (aInputControls) {
        var aMessages = [];
        var oFirstControlWithError = null;

        for (var j = 0; j < aInputControls.length; j++) {
          var oControl = aInputControls[j];

          // skip optional fields
          var bMandatory = this._isMandatory(oControl);
          if (!bMandatory) {
            continue;
          }

          // skip invisible fields
          if (oControl.getVisible && !oControl.getVisible()) {
            continue;
          }

          // get value
          var sValue = this._getValue(oControl);

          // check value
          var fValue;
          if (!isNaN(sValue)) {
            fValue = parseFloat(sValue);
          }
          var bError = !sValue || fValue === 0.0;
          if (bError) {
            oControl.setValueState('Error');
            oControl.setValueStateText(bundle.get().getText('clientCheckMandatoryCheck'));
            aMessages.push({});
            if (!oFirstControlWithError) {
              oFirstControlWithError = oControl;
            }
          } else {
            oControl.setValueState('None');
            oControl.setValueStateText('');
          }
        }

        // focus the first field with errors
        if (oFirstControlWithError) {
          oFirstControlWithError.focus();
        }

        return aMessages;
      },

      _isMandatory: function (oControl) {
        if (oControl.getMandatory) {
          // smart control
          return oControl.getMandatory();
        } else {
          // other controls must set a custom label in the smart form
          var oParent = oControl.getParent();
          this._oAssert.ok(oParent, 'input check failed. no parent for control: ' + oControl);
          this._oAssert.ok(oParent.getLabel, 'input check failed. parent of control has no getLabel function: ' + oControl);
          var oLabel = oParent.getLabel();
          this._oAssert.ok(oLabel.getRequired, 'input check failed. label of parent of control has no getRequired function: ' + oControl);
          return oLabel.getRequired();
        }
      },

      _getLabel: function (oControl) {
        if (oControl.getDataProperty) {
          // smart control
          var oProperty = oControl.getDataProperty();
          var sLabel = oProperty.property['sap:label'];
          return sLabel;
        } else {
          // other controls must set a custom label in the smart form
          var oParent = oControl.getParent();
          this._oAssert.ok(oParent, 'input check failed. no parent for control: ' + oControl);
          this._oAssert.ok(oParent.getLabel, 'input check failed. parent of control has no getLabel function: ' + oControl);
          var oLabel = oParent.getLabel();
          this._oAssert.ok(oLabel.getText, 'input check failed. label of parent of control has no getText function: ' + oControl);
          return oLabel.getText();
        }
      },

      _getValue: function (oControl) {
        if (oControl.getValue) {
          // smart control and others
          return oControl.getValue();
        } else if (oControl.getSelectedKey) {
          // select, combobox, ...
          return oControl.getSelectedKey();
        } else {
          throw Error('cannot get value from control: ' + oControl);
        }
      },

      _collectInputMessages: function (aInputControls) {
        var messages = [];

        // iterate input controls
        for (var j = 0; j < aInputControls.length; j++) {
          var oControl = aInputControls[j];

          // message?
          var sMessage = oControl.getValueStateText();
          if (!sMessage) {
            continue;
          }

          // get label
          var sLabel = this._getLabel(oControl);

          // add message
          messages.push({
            message: sLabel + ': ' + sMessage,
            type: MessageType.Error,
            technical: false
          });
        }

        // done
        return messages;
      }
    });
  }
);
