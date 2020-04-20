sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/base/strings/formatMessage",
	"sap/base/security/encodeURL",
	"sap/ui/core/CalendarType",
	"sap/ui/core/format/DateFormat"
  ], function(ListReportNoDraftController, SmartTableBindingUpdate, SelectionVariant, Sorter, 
			FilterOperator, formatMessage, encodeURL, CalendarType, DateFormat) {
    "use strict";
    return ListReportNoDraftController.extend("com.sap.cd.maco.monitor.ui.app.massmeterreadings.view.MassMeterReadingListReport",
      {
      	
      /**
       * Formatter Attribute.
       * @public
       */
        formatter: formatMessage,
        
        /******************************************************************* */
        /* LIFECYCLE METHODS */
        /******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of MassMeterReadingListReport Controller
		 * @public
         */
        onInit: function() {
			this.getOwnerComponent().getModel().setSizeLimit(1500);
			
			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_MassProcMtrRead",
				actions: this.getOwnerComponent().mActions,
				routes: {
					parent: null,
					this: "listReport",
					child: null
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
			var aSorters = [new Sorter("UploadDate", true), new Sorter("PeriodFromDate", true), new Sorter("PeriodToDate", true)];
			var sSelMassMeterReadType = this.byId("idMassMeterReadSegmentedButton").getSelectedKey();
			
			oUpdate.addSorters(aSorters);
			
			if(sSelMassMeterReadType === "ALL") {
				oUpdate.addFilter("MeterReadType", FilterOperator.NE, "");  
			} else {
				oUpdate.addFilter("MeterReadType", FilterOperator.EQ, sSelMassMeterReadType);  
			}
			
			oUpdate.endFilterAnd();
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
		},

		/**
	  	* Event is triggered before smart variant is fetched
	  	* @public
		*/
        onBeforeMassMeterReadVariantFetch: function() {
        	var oFilterData = this.getFilterBar().getFilterData();
			var sSelMassMeterReadType = this.byId("idMassMeterReadSegmentedButton").getSelectedKey();
			
			oFilterData._CUSTOM = {
				MeterReadType: (sSelMassMeterReadType && sSelMassMeterReadType !== "") ? sSelMassMeterReadType : "ALL"
			};
			
			this.getFilterBar().setFilterData(oFilterData);
        },
        
        /**
	  	* Event is triggered after smart variant is loaded
	  	* @public
		*/
        onAfterMassMeterReadVariantLoad: function() {
			var oFilterData = this.getFilterBar().getFilterData();
			var aOwnMarketPartnerKeys = [];
			var sSelMassMeterReadType;
			
			if(oFilterData.OwnMarketPartner && jQuery.isArray(oFilterData.OwnMarketPartner.items)) {
				var aOwnMarketPartnerItems = oFilterData.OwnMarketPartner.items;
				for(var intI = 0; intI < aOwnMarketPartnerItems.length; intI++) {
					aOwnMarketPartnerKeys.push(aOwnMarketPartnerItems[intI].key);
				}
			}
			
			if(oFilterData._CUSTOM) {
				sSelMassMeterReadType = oFilterData._CUSTOM.MeterReadType
			}
			
			this.byId("idOwnMarketPartner").setSelectedKeys(aOwnMarketPartnerKeys);
			this.byId("idMassMeterReadSegmentedButton").setSelectedKey(sSelMassMeterReadType || "ALL");
        },
		
		/**
         * Event is triggered before data Refreshing of VizFrame Graph
         * @param {object} oEvent                   Data refresh event
         * @public
		 */
        onMeterReadGraphDataRefresh: function(oEvent) {
        	var oDateTimeFormat = DateFormat.getDateInstance({
				pattern: "'datetime'''yyyy-MM-dd'T'HH:mm:ss''",
				calendarType: CalendarType.Gregorian
			});
			var oDateTimeFormatMs = DateFormat.getDateInstance({
				pattern: "'datetime'''yyyy-MM-dd'T'HH:mm:ss.SSS''",
				calendarType: CalendarType.Gregorian
			});
			var oDate = new Date(new Date().getTime() - 2505600000);
			var sDate = (oDate.getMilliseconds() > 0) ? oDateTimeFormatMs.format(oDate, true) : oDateTimeFormat.format(oDate, true);
			
			oEvent.getSource().getBindingInfo("data").binding.sFilterParams = "$filter=UploadDate%20gt%20" + encodeURL(sDate);
        },
        
        /**
         * Event is triggered on Data point selection in VizFrame Graph
         * @param {object} oEvent            Data point selection event
         * @public
		 */
        onMeterReadGraphDataPointSelection: function(oEvent) {
			var oSelectedDataPoint = oEvent.getParameter("data")[0].data;
			var oBindingData = oEvent.getSource().getAggregation("dataset").getBindingInfo("data").binding;
			var oBindingContext = JSON.parse(oBindingData.aLastContextData[oSelectedDataPoint._context_row_number]).UploadDate;
			var oUploadDate = new Date(new Date(oBindingContext).toDateString());
			var oFilterData = jQuery.extend(true, {}, this.getFilterBar().getFilterData());
			
			oFilterData.UploadDate = jQuery.extend(true, {}, this._getFilterUploadDate(oUploadDate));
			this.getFilterBar().setFilterData(oFilterData, true);
			
			var oSegmentedButtons = this.byId("idMassMeterReadSegmentedButton");
			var sSelSegmentedKey = this._getMeterReadTypeKey(oSelectedDataPoint.measureNames);
			
			oSegmentedButtons.setSelectedKey(sSelSegmentedKey);
			this.getSmartTable().rebindTable(true);
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
			this.mSingles.nav.parseNavigation().done(function(oAppState) {
				if(!jQuery.isEmptyObject(oAppState)) {
					this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
					this.getSmartTable().rebindTable(true);
				}
			}.bind(this));
		},
		
		/**
         * Event is triggered when Meter Type Segmented Button selection is changed
         * @params {object} oEvent  Segmented button selection change event
         * @public
         */
        onMeterTypeSelectionChange: function(oEvent) {
			this.getSmartTable().rebindTable(true);
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
				this.mSingles.message.info({
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
			
			this.mSingles.nav.storeInnerAppState(oCurrentAppState);
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
        },
        
        /**
         * Function returns Upload date for filter bar as per selected data point in Mass meter read graph
         * @param   {object} oUploadDate       Upload date
         * @private
         * @returns {object}                   Upload date for filter bar
		 */
        _getFilterUploadDate: function(oUploadDate) {
        	return {
				conditionTypeInfo: {
					name: "sap.ui.comp.config.condition.DateRangeType",
					data: {
						operation: "DATE",
						value1: oUploadDate,
						value2: null,
						key: "UploadDate",
						tokenText: "",
						calendarType: CalendarType.Gregorian
					}
				},
				ranges: [{
					operation: FilterOperator.BT,
					value1: oUploadDate,
					value2: new Date(oUploadDate.getTime() + 86399999),
					tokenText: "",
					exclude: false,
					keyField: "UploadDate"
				}],
				items: []
			};
        },
        
        /**
         * Function returns Meter read type key as per selected Meter read type
         * @param   {string} sMeterReadType       Meter read type
         * @private
         * @returns {string}                      Meter read type key
		 */
        _getMeterReadTypeKey: function(sMeterReadType) {
        	switch (sMeterReadType) {
				case "Total": return "ALL";
				case "Energy Values": return "ENERVAL";
				case "Interim": return "INTERIM";
				case "Interval": return "INTERVAL";
				case "Periodical": return "PERIODICAL";
			}
        }
    });
});