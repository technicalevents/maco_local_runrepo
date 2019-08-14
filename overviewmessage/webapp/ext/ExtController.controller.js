(function() {
  'use strict';

  sap.ui.controller('com.sap.cd.maco.monitor.ui.app.overviewmessages.ext.ExtController', {
  	
  	/**
     * LifeCycle method
     */
    onInit: function() {
    	
    },
    
    /**
     * LifeCycle Method
     */
    onAfterRendering: function(oEvent) {
    	this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
    },
    
    
    CardStatus: function(oNavigateParams,oSelectionVariantParams) {
    	
    },
    
    //Store custom data in oCustomData
    getCustomAppStateDataExtension: function (oCustomData) {
    	
    },
    //Appstate will return the same oCustomData
    restoreCustomAppStateDataExtension: function (oCustomData) {
    	
    },
    //Returns Filter object to be used in filtering
    getCustomFilters: function () {
    	
    },
    //Returns Custom Action function
    onCustomActionPress: function (sCustomAction) {
    	
    },
    //Returns Custom Parameters
    onCustomParams: function (sCustomParams) {
    	
    },
    //Modifies the selection variant to be set to the SFB
    modifyStartupExtension: function (oCustomSelectionVariant) {
    	
    },

    //method to get custom message and icon for no data and error case
    getCustomMessage: function (oResponse, sCardId) {
    	
    },

    /**
     * Determines which function should be called for the custom parameter
     */
    // onCustomParams: function(sCustomParam) {
    //   if (sCustomParam === 'CardToDo') {
    //     return this.getParamCardToDo;
    //   } else if (sCustomParam === 'CardStatus') {
    //     return this.getParamCardStatus;
    //   } else if (sCustomParam === 'CardLoad') {
    //     return this.getParamCardLoad;
    //   } else {
    //     throw new Error('unknown custom param ' + sCustomParam);
    //   }
    // },

    getParamCardToDo: function(oNavigateParams) {
      return {
        selectionVariant: [
          {
            path: 'Card',
            operator: 'EQ',
            value1: 'ToDo',
            value2: null,
            sign: 'I'
          }
        ],
        ignoreEmptyString: true
      };
    },

    getParamCardStatus: function(oNavigateParams) {
      return {
        selectionVariant: [
          {
            path: 'Card',
            operator: 'EQ',
            value1: 'Status',
            value2: null,
            sign: 'I'
          }
        ],
        ignoreEmptyString: true
      };
    },

    getParamCardLoad: function(oNavigateParams) {
      return {
        selectionVariant: [
          {
            path: 'Card',
            operator: 'EQ',
            value1: 'Load',
            value2: null,
            sign: 'I'
          }
        ],
        ignoreEmptyString: true
      };
    }
  });
})();
