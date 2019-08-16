(function() {
  "use strict";

  sap.ui.controller("com.sap.cd.maco.monitor.ui.app.overviewprocesses.ext.ExtController", {
   /**
     * Determines which function should be called for the custom parameter
     */
    onCustomParams: function(sCustomParam) {
      if (sCustomParam === "CardToDo") {
        return this.getParamCardToDo;
      } else if (sCustomParam === "CardStatus") {
        return this.getParamCardStatus;
      } else if (sCustomParam === "CardLoad") {
        return this.getParamCardLoad;
      } else {
        throw new Error("unknown custom param " + sCustomParam);
      }
    },

     getParamCardToDo: function(oNavigateParams) {
      return {
        selectionVariant: [
          {
            path: "Card",
            operator: "EQ",
            value1: "ToDo",
            value2: null,
            sign: "I"
          }
        ],
        ignoreEmptyString: true
      };
    },

     getParamCardStatus: function(oNavigateParams) {
      return {
        selectionVariant: [
          {
            path: "Card",
            operator: "EQ",
            value1: "Status",
            value2: null,
            sign: "I"
          }
        ],
        ignoreEmptyString: true
      };
    },

     getParamCardLoad: function(oNavigateParams) {
      return {
        selectionVariant: [
          {
            path: "Card",
            operator: "EQ",
            value1: "Load",
            value2: null,
            sign: "I"
          }
        ],
        ignoreEmptyString: true
      };
    }
  });
})();
