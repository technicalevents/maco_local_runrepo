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
        var oComponentActions = this.getOwnerComponent().actions;
        
        this.getOwnerComponent().getModel().setSizeLimit(1200);
          
        ListReportNoDraftController.prototype.onInit.call(this, {
          entitySet: "xMP4GxC_TransferDoc_UI",
          actions: {
            multiDownload: oComponentActions.multiDownload,
            navToMessagePage: oComponentActions.navToMessagePage,
            navToProcessApp: oComponentActions.navToProcessApp,
            share: oComponentActions.share
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
            navToMessagePage: true,
            navToProcessApp: true
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

          // This method will add Current application state in URL
          this.storeCurrentAppState();
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
         * This method will refresh SmartTable Data
         * @public
         */
        onRefresh: function() {
          this._getSmartTable().rebindTable(true);
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
            this._oSmartTable = this.getView().byId("idMessageSmartTable");
          }
          
          return this._oSmartTable;
        },
        
        /**
         * Function will return instance of Smart Filter Bar Control
         * @public
         */
        _getSmartFilterBar: function() {
          if(!this._oSmartFilterBar) {
            this._oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
          }
          
          return this._oSmartFilterBar;
        }
      }
    );
  }
);
