sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "sap/ui/model/Sorter",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "sap/ui/model/FilterOperator"
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, messageFormatter, 
            Constants, Sorter, SelectionVariant, FilterOperator) {
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
            navListToProcessApp: oComponentActions.navListToProcessApp,
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
            navListToProcessApp: true
          }
        });

        var oRoute = this.oRouter.getRoute("initial");
        oRoute.attachPatternMatched(this._onRoutePatternMatched, this);
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
         * Formatter method to handle visibility for multiple process document
         * @param   {string} sPDocNumber     Process Document Number
         * @public
         * @returns {boolean}                Whether multiple PDoc text should be visible or not 
         */
        formatMultiplePDocVisible: function(sPDocNumber) {
        	return sPDocNumber.split(",").length > 1 ? true : false;
        },
        
        /**
         * Formatter method to handle text for multiple process document
         * @param   {string} sPDocNumber     Process Document Number
         * @public
         * @returns {Text}                   Multiple PDoc text
         */
        formatMultiplePDocText: function(sPDocNumber) {
        	return this.oBundle.getText("MULTI_DOCUMENT_TXT", [sPDocNumber.split(",").length]);
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
       * Event is triggered when selection is changed in Smart Filter Bar
       * @public
       */
      onMessageFilterBarChanged: function() {
        var oFilterData = jQuery.extend(true, {}, this.getFilterBar().getFilterData());
        var aRanges = []; 
        var bIsFilterDataChanged = false;
        
        if(oFilterData.ProcessDocumentNumber) {
          aRanges = oFilterData.ProcessDocumentNumber.ranges;
          for(var intI = 0; intI < aRanges.length && aRanges[intI].operation === FilterOperator.EQ; intI++) {
            oFilterData.ProcessDocumentNumber.ranges[intI].operation = FilterOperator.Contains;
            oFilterData.ProcessDocumentNumber.ranges[intI].tokenText = "*" + aRanges[intI].tokenText.slice(1) +"*";
            bIsFilterDataChanged = true;
          }
          
          if(bIsFilterDataChanged) {
            this.getFilterBar().setFilterData(oFilterData, true);
          }
        }
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
