sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/base/strings/formatMessage"
  ], function(ListReportNoDraftController, SmartTableBindingUpdate, SelectionVariant, Sorter, FilterOperator, formatMessage) {
    "use strict";
    return ListReportNoDraftController.extend("com.sap.cd.maco.selfservice.ui.app.maintmsgcontacts.view.ContactListReport",
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
         * Lifecycle method - triggered on initialization of ProcessListReport Controller
         */
        onInit: function() {
			var oComponentActions = this.getOwnerComponent().actions;
			this.getOwnerComponent().getModel().setSizeLimit(1500);
			
			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_Mantain_Contact_Info",
				actions: {
					createContact: oComponentActions.createContact,
					updateContact: oComponentActions.updateContact,
					deleteContact: oComponentActions.deleteContact
				},
				routes: {
					parent: null,
					this: "listReport",
					child: "null"
				},
				controls: {
					table: "idContactSmartTable",
					variantManagement: "idContactVariantManagement",
					filterBar: "idContactSmartFilterBar"
				},
				tableAccessControl: {
					createContact: true
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
			var aSorters = [(new Sorter("OwnMarketPartner", true, function (oContext) {
				var sKey = oContext.getProperty("OwnMarketPartner");
				var sKeyText = oContext.getProperty("OwnMarketPartnerText");
				return {
					key: sKey,
					text: this.oBundle.getText("OWN_MARKET_PARTNER_TITLE", [sKeyText, sKey])
				};
			}.bind(this)))];
			
			oUpdate.addSorters(aSorters);
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
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
	  	* Event is triggered after smart variant is loaded
	  	* @public
		*/
        onAfterContactListVariantLoad: function() {
			var oFilterData = this.getFilterBar().getFilterData();
			var aOwnMarketPartnerKeys = [];
			
			if(oFilterData.OwnMarketPartner && jQuery.isArray(oFilterData.OwnMarketPartner.items)) {
				var aOwnMarketPartnerItems = oFilterData.OwnMarketPartner.items;
				for(var intI = 0; intI < aOwnMarketPartnerItems.length; intI++) {
					aOwnMarketPartnerKeys.push(aOwnMarketPartnerItems[intI].key);
				}
			}
			
			this.byId("idOwnMarketPartner").setSelectedKeys(aOwnMarketPartnerKeys);
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
				}
			}.bind(this));
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
        }
    });
});