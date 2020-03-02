sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/base/strings/formatMessage"
  ], function(ListReportNoDraftController, SmartTableBindingUpdate, SelectionVariant, Sorter, Filter, FilterOperator, formatMessage) {
    "use strict";
    return ListReportNoDraftController.extend("com.sap.cd.maco.monitor.ui.app.massmeterreadings.view.MassMeterReadingListReport",
      {
      	
      /**
       * Formatter Attribute.
       * @public
       */
        formatMessage: formatMessage,
        
        /******************************************************************* */
        /* LIFECYCLE METHODS */
        /******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of MassMeterReadingListReport Controller
         */
        onInit: function() {
			var oComponentActions = this.getOwnerComponent().actions;
			this.getOwnerComponent().getModel().setSizeLimit(1500);
			
			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_MassProcMtrRead",
				actions: {
					navToUploadProcessAction: oComponentActions.navToUploadProcessAction,
					navToAggrProcessAction: oComponentActions.navToAggrProcessAction,
					navToMessageAction: oComponentActions.navToMessageAction,
					share: oComponentActions.share
				},
				routes: {
					parent: null,
					this: "listReport",
					child: "null"
				},
				controls: {
					table: "idMassMeterReadingSmartTable",
					variantManagement: "idMassMeterReadingVariantManagement",
					filterBar: "idMassMeterReadingSmartFilterBar"
				}
			});
			
			this.oRouter.getRoute("initial").attachPatternMatched(this._onRoutePatternMatched, this);
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
			aSorters.push(new Sorter("PeriodFromDate", true));
			aSorters.push(new Sorter("PeriodToDate", true));
			oUpdate.addSorters(aSorters);
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
        },

        /**
        * Event is triggered when selection is changed in Smart Filter Bar
        * @public
        */
        onMassMeterReadingsFilterBarChanged: function() {
			var oFilterData = jQuery.extend(true, {}, this.getFilterBar().getFilterData());
			var aRanges = []; 
			var bIsFilterDataChanged = false;
			
			if(oFilterData.ExternalMarketPartner) {
				aRanges = oFilterData.ExternalMarketPartner.ranges;
				for(var intI = 0; intI < aRanges.length && aRanges[intI].operation === FilterOperator.EQ; intI++) {
					oFilterData.ExternalMarketPartner.ranges[intI].operation = FilterOperator.Contains;
					oFilterData.ExternalMarketPartner.ranges[intI].tokenText = "*" + aRanges[intI].tokenText.slice(1) +"*";
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
			var aOwnerUUIDKeys = this.getFilterBar().getControlByKey("OwnMarketPartner").getSelectedKeys();
			var oSmartFilterData = this.getFilterBar().getFilterData();
			
			delete oSmartFilterData.OwnMarketPartner;
			
			if(!jQuery.isEmptyObject(aOwnerUUIDKeys)) {
				oSmartFilterData["OwnMarketPartner"] = {"items": []};
				for (var intI = 0; intI < aOwnerUUIDKeys.length; intI++) {
					oSmartFilterData["OwnMarketPartner"].items.push({"key": aOwnerUUIDKeys[intI]});
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
         * This method will refresh SmartTable Data
         * @public
         */
        onRefresh: function() {
			this.getSmartTable().rebindTable(true);
		},
		
		/**
         * Event is triggered when Meter Type Segmented Button selection is changed
         * @params {object} oEvent  Segmented button selection change event
         * @public
         */
        onMeterTypeSelectionChange: function(oEvent) {
        	var sSelSegmentKey = oEvent.getSource().getSelectedKey();
        	var oItemBinding = this.getSmartTable().getTable().getBinding("items");
        	if(sSelSegmentKey === "ALL") {
        		oItemBinding.filter();
        	} else {
        		oItemBinding.filter([new Filter("MeterReadType", FilterOperator.EQ, sSelSegmentKey)]);
        	}
        },
        
        /**
		 * Event is triggered before export of Records 
		 * @param {object} oEvent Table Export event
		 * @public
		 */
		onBeforeExport: function (oEvent) {
			var iCount = oEvent.getParameter("exportSettings").dataSource.count;
			if (iCount > 500) {
				oEvent.getParameter("exportSettings").dataSource.count = 500;
				this.oMessage.info({
					msgKey: "EXCEL_DOWNLOAD_INFO_MSG"
				});
			}
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
    });
});