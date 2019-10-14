sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/listReport/ListReportNoDraftController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, Formatter, 
            SelectionVariant, Sorter, Filter, FilterOperator) {
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
          var oComponentActions = this.getOwnerComponent().actions;
			
          this.getOwnerComponent().getModel().setSizeLimit(1200);
              
          ListReportNoDraftController.prototype.onInit.call(this, {
            entitySet: "xMP4GxC_ProcessHeader_UI",
            actions: {
              navToProcessPage: oComponentActions.navToProcessPage,
              executeMsgAggr: oComponentActions.executeMsgAggr,
              share: oComponentActions.share
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
        * Event is triggered when selection is changed in Own Market Partner MultiComboBox
        * @public
        */
        onOwnMarketPartnerChange: function() {
          var aOwnerUUIDKeys = this._getSmartFilterBar().getControlByKey("OwnerUUID").getSelectedKeys();
          var oSmartFilterData = this._getSmartFilterBar().getFilterData();
          
          delete oSmartFilterData.OwnerUUID;
          
          if(!jQuery.isEmptyObject(aOwnerUUIDKeys)) {
            oSmartFilterData["OwnerUUID"] = {"items": []};
            
            for (var intI = 0; intI < aOwnerUUIDKeys.length; intI++) {
              oSmartFilterData["OwnerUUID"].items.push({"key": aOwnerUUIDKeys[intI]});
            }
          }
          
          this._getSmartFilterBar().setFilterData(oSmartFilterData, true);
        },
        
        /**
	       * Event is triggered when FilterBar is initialized. 
	       * This method will set Recently used FilterData in FilterBar
	       * @public
	       */
        onFilterBarInitialized: function() {            
          this.oNav.parseNavigation().done(function(oAppState) {
            if(!jQuery.isEmptyObject(oAppState)) {
              this._getSmartFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
              this._getSmartTable().rebindTable(true);
            }
          }.bind(this));
        },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable DAa
         * @public
         */
        onRefresh: function() {
          this._getSmartTable().rebindTable(true);
        },
        
        /**
         * Function will store application's current state on change in message list
         * @public
         */
        storeCurrentAppState: function() {
          var oSmartFilterUiState = this._getSmartFilterBar().getUiState();
          var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
          var oCurrentAppState = {
            selectionVariant: oSelectionVariant.toJSONString(),
            tableVariantId: this._getSmartTable().getCurrentVariantId(),
            valueTexts: oSmartFilterUiState.getValueTexts()
          };
          
          this.oNav.storeInnerAppState(oCurrentAppState);
        },
        
        /******************************************************************* */
        /* PUBLIC METHODS */
        /******************************************************************* */
        
        /**
         * Function will return instance of Smart Table Control
         * @public
         */
        _getSmartTable: function() {
          if(!this._oSmartTable) {
            this._oSmartTable = this.getView().byId("idProcessSmartTable");
          }
          
          return this._oSmartTable;
        },
        
        /**
         * Function will return instance of Smart Filter Bar Control
         * @public
         */
        _getSmartFilterBar: function() {
          if(!this._oSmartFilterBar) {
            this._oSmartFilterBar = this.getView().byId("idProcessSmartFilterBar");
          }
          
          return this._oSmartFilterBar;
        }
      }
    );
  }
);
