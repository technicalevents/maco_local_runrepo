sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/listReport/ListReportNoDraftController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "sap/ui/model/Sorter",
	"sap/ui/generic/app/navigation/service/SelectionVariant"
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, messageFormatter, 
			Constants, Sorter, SelectionVariant) {
    "use strict";

    return ListReportNoDraftController.extend(
      "com.sap.cd.maco.monitor.ui.app.displaymessages.view.MessageListReport",
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
          var oComponentAction = this.getOwnerComponent().actions;
          
          ListReportNoDraftController.prototype.onInit.call(this, {
            entitySet: "xMP4GxC_TransferDoc_UI",
            actions: {
            	multiDownload: oComponentAction.multiDownload,
            	navToMessagePage: oComponentAction.navToMessagePage,
            	share: oComponentAction.share
            },
            routes: {
				parent: null,
				this: "listReport",
				child: "messagePage"
            },
            controls: {
				table: "idMessageSmartTable",
				variantManagement: "idMessageVariantManagement",
				filterBar: "idMessageSmartFilterBar"
            },
            tableAccessControl: {
            	multiDownload: true,
            	navToMessagePage: true
        	}
          });
        },
        
      /******************************************************************* */
      /* PUBLIC METHODS */
      /******************************************************************* */
        
      /**
	   * Event is triggered before data loading of smart table
       * @param {object} oEvent Table loading event
	   * @public
	   */
        onBeforeRebindTable: function(oEvent) {
          var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
          var aSorters = [];
          aSorters.push(new Sorter("Timestamp", true));
          aSorters.push(new Sorter("TransferDocumentNumber", true));
          oUpdate.addSorters(aSorters);
          
          this.storeCurrentAppState();
        },

        /**
         * Event is triggered when FilterBar is initialized. 
         * This method will set Recently used FilterData in FilterBar
         * @public
         */
        onFilterBarInitialized: function() {
          var oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
          var oSmartTable = this.getView().byId("idMessageSmartTable");

          this.oNav.parseNavigation().done(function(oAppState) {
            if(!jQuery.isEmptyObject(oAppState)) {
              oSmartFilterBar.setDataSuiteFormat(oAppState.selectionVariant, true);
              oSmartTable.rebindTable(true);
            }
          }.bind(this));
        },
        
        /**
         * Event Handler - Function is triggered on click of (Message / Processes) link in Timeline item
         * @param {sap.ui.base.Event} oEvent Link Click event object
         * @public
         */
        onNavToProcess: function(oEvent) {
			var oObject = oEvent.getSource().getBindingContext().getObject();
			var oParam = {
				semanticObject: Constants.SEMANCTIC_OBJECT.PROCESS_DOCUMENT,
				action: Constants.SEMANTIC_ACTION.DISPLAY,
				params: {
					ProcessDocumentKey: oObject.ProcessDocumentKey,
					ProcessID: oObject.ProcessID
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
        
        /**
		 * Function will store application's current state on change in message list
		 * @public
		 */
        storeCurrentAppState: function() {
            var oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
			var oSmartFilterUiState = oSmartFilterBar.getUiState();
			var oSmartTable = this.getView().byId("idMessageSmartTable");
			var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
			var oCurrentAppState = {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: oSmartTable.getCurrentVariantId(),
				valueTexts: oSmartFilterUiState.getValueTexts()
			};
            this.oNav.storeInnerAppState(oCurrentAppState);
        }
      }
    );
  }
);
