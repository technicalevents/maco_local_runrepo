sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, messageFormatter, Constants, Sorter, JSONModel) {
    'use strict';

    return ActionSmartTableController.extend(
      'com.sap.cd.maco.monitor.ui.app.displaymessages.view.MessageListReport',
      {

    /**
		 * Formatter Attribute.
		 * @public
		 */
    formatter: messageFormatter,

    /******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * LifeCycle method Called when MessageListReport controller is instantiated.
		 * @public
		 */
        onInit: function() {
          ActionSmartTableController.prototype.onInit.call(this, {
            entitySet: 'xMP4GxC_TransferDoc_UI',
            actions: {},
            controls: {
              table: 'idMessageSmartTable'
            }
          });

          if(!sap.ui.getCore().getModel("DisplayMessageApp")) {
            // Create a JSON Model
            var oDisplayMsgAppModel = new JSONModel({
                FilterData: {}
            });
            oDisplayMsgAppModel.setDefaultBindingMode("OneWay");
            sap.ui.getCore().setModel(oDisplayMsgAppModel, "DisplayMessageApp");
          }
        },

      /******************************************************************* */
      /* PUBLIC METHODS */
      /******************************************************************* */

      /**
	  	 * Event is triggered when Back button is triggered
       * @param {object} oEvent BackButton Event
       * @public
       */
      onMessageRowSelect: function(oEvent) {
          this._setFilterDataProperty();

          var oObject = oEvent.getSource().getBindingContext().getObject();

          this.oRouter.navTo('messagePage', {
            TransferDocumentKey: oObject.TransferDocumentKey
          });
        },
        
      /**
	  	 * Event is triggered before data loading of smart table
       * @param {object} oEvent Table loading event
	  	 * @public
		   */
        onBeforeRebindTable: function(oEvent) {
          var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
          var aSorters = [];
          aSorters.push(new Sorter("Timestamp", true));
          aSorters.push(new Sorter("TransferDocumentNumber", true));
          oUpdate.addSorters(aSorters);
        },

        /**
         * Event is triggered when FilterBar is initialized. 
         * This method will set Recently used FilterData in FilterBar
         * @public
         */
        onFilterBarInitialized: function() {
          var oFilterData = jQuery.extend(true, {}, 
                  sap.ui.getCore().getModel("DisplayMessageApp").getProperty("/FilterData"));
          this.getView().byId("idMessageSmartFilterBar").setFilterData(oFilterData);
        },
        
        /**
         * Event Handler - Function is triggered on click of (Message / Processes) link in Timeline item
         * @param {sap.ui.base.Event} oEvent Link Click event object
         * @public
         */
        onNavToProcess: function(oEvent) {
          this._setFilterDataProperty();

          var oObject = oEvent.getSource().getBindingContext().getObject();
          var oParam = {
          	semanticObject: Constants.SEMANCTIC_OBJECT.PROCESS_DOCUMENT,
          	action: Constants.SEMANTIC_ACTION.DISPLAY,
          	params: {
          		ProcessDocumentKey: oObject.ProcessDocumentKey
          	}
          };
          
          this.oNav.navExternal(oParam);
        },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable Data
         * @public
         */
        onRefresh: function() {
          this.getView().byId("idMessageSmartTable").rebindTable(true);
        },

         /**
         * Formatter method returns formatted Technical Id and External Business Message Id
         * @param   {string} 	sTechnicalId	     Technical Id
         * @param   {string} 	sExBusinessMsgId	 External Business Message Id
         * @public
         * @returns {string} 	    	             Formatted text
         */
          formatTechnicalBusinessMsgId: function(sTechnicalId, sExBusinessMsgId) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var sI18nFormat = "FORMAT_TXT_LBL";
            var aI18nData = [sTechnicalId];
            
            if(sExBusinessMsgId) {
              aI18nData.push(sExBusinessMsgId);
              sI18nFormat = "FORMAT_AMID_TXT_LBL";
            }
          
            return oResourceBundle.getText(sI18nFormat, aI18nData);
          },

        /******************************************************************* */
        /* PRIVATE METHODS */
        /******************************************************************* */
        
        /**
         * Method will retrieve filter data from filterbar and set in JSON Model
         * @public
         */
        _setFilterDataProperty: function() {
        	var oFilterData = jQuery.extend(true, {}, 
                            this.getView().byId("idMessageSmartFilterBar").getFilterData());
            sap.ui.getCore().getModel("DisplayMessageApp").setProperty("/FilterData", oFilterData);
        }
      }
    );
  }
);
