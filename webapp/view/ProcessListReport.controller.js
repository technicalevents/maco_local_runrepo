sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/listReport/ListReportNoDraftController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "sap/ui/model/Sorter"
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, Formatter, 
			SelectionVariant, Sorter) {
    "use strict";

    return ListReportNoDraftController.extend(
      "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.ProcessListReport",
      {
      	
        /**
		 * Formatter Attribute.
		 * @public
		 */
        formatter: Formatter,
        
    	/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of ProcessListReport Controller
         */
        onInit: function() {
			var oComponentAction = this.getOwnerComponent().actions;
        	
			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_ProcessHeader_UI",
				actions: {
					navToProcessPage: oComponentAction.navToProcessPage,
					executeMsgAggr: oComponentAction.executeMsgAggr,
					share: oComponentAction.share
				},
				routes: {
					parent: null,
					this: "listReport",
					child: "processPage"
	            },
				controls: {
					table: "idProcessSmartTable",
					variantManagement: "idProcessVariantManagement",
					filterBar: "idProcessSmartFilterBar"
				},
				tableAccessControl: {
					navToProcessPage: true,
					executeMsgAggr: true
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
          var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
          var aSorters = [];
          aSorters.push(new Sorter("ProcessTimestamp", true));
          aSorters.push(new Sorter("ProcessDocumentKey", true));
          oUpdate.addSorters(aSorters);
          
          // This method will add Current application state in URL
          this.storeCurrentAppState();
        },
        
        /**
	       * Event is triggered when FilterBar is initialized. 
	       * This method will set Recently used FilterData in FilterBar
	       * @public
	       */
        onFilterBarInitialized: function() {
          var oSmartFilterBar = this.getView().byId("idProcessSmartFilterBar");
          var oSmartTable = this.getView().byId("idProcessSmartTable");

          this.oNav.parseNavigation().done(function(oAppState) {
            if(!jQuery.isEmptyObject(oAppState)) {
              oSmartFilterBar.setDataSuiteFormat(oAppState.selectionVariant, true);
              oSmartTable.rebindTable(true);
            }
          }.bind(this));
        },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable DAa
         * @public
         */
        onRefresh: function() {
          this.getView().byId("idProcessSmartTable").rebindTable(true);
        },
        
        /**
         * Function will store application's current state on change in message list
         * @public
         */
        storeCurrentAppState: function() {
          var oSmartFilterBar = this.getView().byId("idProcessSmartFilterBar");
          var oSmartFilterUiState = oSmartFilterBar.getUiState();
          var oSmartTable = this.getView().byId("idProcessSmartTable");
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
