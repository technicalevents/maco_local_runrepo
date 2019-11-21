sap.ui.define([], function() {
  'use strict';
  return {
    emailStatusText: function(oStatus) {
      switch (oStatus) {
        case '01': //Invalid
          return sap.ui.core.ValueState.Error;
        case '02': //valid
          return sap.ui.core.ValueState.Success;
      }
    },

    keyPairStatusText: function(oStatus) {
      switch (oStatus) {
        case '01': //Valid
          return sap.ui.core.ValueState.Success;
        case '02': //InValid Soon
          return sap.ui.core.ValueState.Warning;
        case '03': //InValid
          return sap.ui.core.ValueState.Error;
        case '04': //Valid In Future
          return sap.ui.core.ValueState.Warning;
        case '05': //Not Maintaind'
          return sap.ui.core.ValueState.Error;
      }
    },
    beConnectionStatusText: function(oStatus) {
      switch (oStatus) {
        case '01': //Invalid
          return sap.ui.core.ValueState.Error;
        case '02': //valid
          return sap.ui.core.ValueState.Success;
      }
    }
  };
});
