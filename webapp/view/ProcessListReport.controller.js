sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator"
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, Formatter, 
            SelectionVariant, Sorter, FilterOperator) {
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

          var oRoute = this.oRouter.getRoute("initial");
          oRoute.attachPatternMatched(this._onRoutePatternMatched, this);

          this.oTransaction.whenRead({
            path: "/xMP4GxC_System_Details",
            busyControl: this.getView()
          }).then(function(oData) {
              this.getThisModel().setProperty("/SystemDetails", oData.data.results[0]);
          }.bind(this));
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
        * Event is triggered when selection is changed in Smart Filter Bar
        * @public
        */
       onProcessFilterBarChanged: function() {
        var oFilterData = jQuery.extend(true, {}, this.getFilterBar().getFilterData());
        var aRanges = []; 
        var bIsFilterDataChanged = false;
        
        if(oFilterData.MarketPartner) {
          aRanges = oFilterData.MarketPartner.ranges;
          for(var intI = 0; intI < aRanges.length && aRanges[intI].operation === FilterOperator.EQ; intI++) {
            oFilterData.MarketPartner.ranges[intI].operation = FilterOperator.Contains;
            oFilterData.MarketPartner.ranges[intI].tokenText = "*" + aRanges[intI].tokenText.slice(1) +"*";
            bIsFilterDataChanged = true;
          }
          
          if(bIsFilterDataChanged) {
            this.getFilterBar().setFilterData(oFilterData, true);
          }
        }
      },

       /**
        * Event is triggered when selection is changed in Own Market Partner MultiComboBox
        * @public
        */
        onOwnMarketPartnerChange: function() {
          var aOwnerUUIDKeys = this.getFilterBar().getControlByKey("OwnerUUID").getSelectedKeys();
          var oSmartFilterData = this.getFilterBar().getFilterData();
          
          delete oSmartFilterData.OwnerUUID;
          
          if(!jQuery.isEmptyObject(aOwnerUUIDKeys)) {
            oSmartFilterData["OwnerUUID"] = {"items": []};
            
            for (var intI = 0; intI < aOwnerUUIDKeys.length; intI++) {
              oSmartFilterData["OwnerUUID"].items.push({"key": aOwnerUUIDKeys[intI]});
            }
          }
          
          this.getFilterBar().setFilterData(oSmartFilterData, true);
        },
        
        /**
	       * Event is triggered when FilterBar is initialized. 
	       * This method will set Recently used FilterData in FilterBar
	       * @public
	       */
        onFilterBarInitialized: function() {            
          this.oNav.parseNavigation().done(function(oAppState) {
            if(!jQuery.isEmptyObject(oAppState)) {
              this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
              this.getSmartTable().rebindTable(true);
            }
          }.bind(this));
        },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable DAa
         * @public
         */
        onRefresh: function() {
          this.getSmartTable().rebindTable(true);
        },
        
        /**
         * Function will store application's current state on change in message list
         * @public
         */
        storeCurrentAppState: function() {
          var oSmartFilterUiState = this.getFilterBar().getUiState();
          var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
          var oCurrentAppState = {
            selectionVariant: oSelectionVariant.toJSONString(),
            tableVariantId: this.getSmartTable().getCurrentVariantId(),
            valueTexts: oSmartFilterUiState.getValueTexts()
          };
          
          this.oNav.storeInnerAppState(oCurrentAppState);
        },
        
        /******************************************************************* */
        /* PRIVATE METHODS */
        /******************************************************************* */
	    
	      /**
         * Method is called on Route to Message List Page
         * @private
         */
        _onRoutePatternMatched: function() {
          this.oComponent.getService("ShellUIService").then(
            function(oService) {
              oService.setHierarchy([]);
            }.bind(this),
            function(oError) {
              jQuery.sap.log.error("Cannot get ShellUIService", oError);
            }
          );
        }
      }
    );
  }
);
