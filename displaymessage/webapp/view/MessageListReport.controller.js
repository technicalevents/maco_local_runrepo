sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
    "com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
    "sap/ui/model/Sorter",
    "sap/ui/generic/app/navigation/service/SelectionVariant"
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, messageFormatter, 
            Sorter, SelectionVariant) {
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
	  	* Event is triggered before export of Records 
        * @param {object} oEvent Table Export event
	  	* @public
		*/
        onBeforeExport: function(oEvent){
        	oEvent.getParameter("exportSettings").dataSource.count = 10000;
        	this.oMessage.info({
						msg: this.oBundle.getText("EXCEL_DOWNLOAD_INFO_MSG")
					});
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
          var oI18nText = messageFormatter.formatTechnicalBusinessMsgId(sTechnicalId, sExBusinessMsgId);
          return oResourceBundle.getText(oI18nText.i18nFormat, oI18nText.i18nData);
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
