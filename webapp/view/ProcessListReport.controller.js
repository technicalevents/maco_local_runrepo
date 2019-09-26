sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
    "sap/ui/model/Sorter"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, Formatter, SelectionVariant, Utility, Sorter) {
    "use strict";

    return ActionSmartTableController.extend(
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
          ActionSmartTableController.prototype.onInit.call(this, {
            entitySet: "xMP4GxC_ProcessHeader_UI",
            actions: {},
            controls: {
              table: "idProcessSmartTable"
            }
          });
          
          this.getThisModel().setProperty("/tileCustomUrl", this.getSaveTileCustomUrl);
          this.getThisModel().setProperty("/tileServiceUrl", this.getSaveTileServiceUrl.bind(this));
        },
        
        /******************************************************************* */
        /* PUBLIC METHODS */
        /******************************************************************* */

        /**
         * Event Handler - Triggered on selecting a to see more details
         * @param {sap.ui.base.Event} oEvent Row selection event object
         */
        onProcessRowSelect: function(oEvent) {
          var oObject = oEvent
            .getSource()
            .getBindingContext()
            .getObject();
          this.oRouter.navTo("processPage", {
            ProcessDocumentKey: oObject.ProcessDocumentKey,
            ProcessID:	oObject.ProcessID
          });
        },
        
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
         * Event Handler on press of Execute Transfer Document button
         * @public
         */
        onPressExecuteMessageAggregation: function() {
        },
        
       /**
		* Function to Get the URL that the tile should point to
    	* @public
        * @returns {string} Url of Application for save as tile action
    	*/
        getSaveTileCustomUrl: function () {
            return document.URL;
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
         * Function to Get the Service URL to show count in Tile
        * @public
        * @returns {string} sQueryUri   Url of Application for count
        */
        getSaveTileServiceUrl: function () {
          var sServiceUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/Main/uri");
        	
        	// ensure trailing '/'
          sServiceUrl = /\/$/.test(sServiceUrl) ? sServiceUrl : sServiceUrl + "/";
          // ensure leading '/'
          sServiceUrl = /^\//.test(sServiceUrl) ? sServiceUrl : "/" + sServiceUrl;

          var sAppId = this.getOwnerComponent().getManifestEntry("/sap.app/id").split(".").join("");
          
          sServiceUrl = sAppId + sServiceUrl;
          
          // ensure trailing '/'
          sServiceUrl = /\/$/.test(sServiceUrl) ? sServiceUrl : sServiceUrl + "/";
          // ensure leading '/'
          sServiceUrl = /^\//.test(sServiceUrl) ? sServiceUrl : "/" + sServiceUrl;
              
          var oDataModel = this.getView().getModel();
          var sEntitySet = this.getThisModel().getProperty("/entitySet");
          var aSmartTableQueryUrlParam = [];
          var sQueryUri = sServiceUrl + sEntitySet;
          
          aSmartTableQueryUrlParam.push("$top=0");
          
          var oSmartFilterBar = this.getView().byId("idProcessSmartFilterBar");
          var aFilters = oSmartFilterBar.getFilters();
              
          if (aFilters && aFilters.length > 0) {
            aSmartTableQueryUrlParam.push(Utility.createODataFilterString(oDataModel, sEntitySet, aFilters));
          }
          
          var sSearchQuery = oSmartFilterBar.getBasicSearchValue();
          
          if(sSearchQuery){
            aSmartTableQueryUrlParam.push("$search=" + encodeURI(sSearchQuery));
          }
          
          aSmartTableQueryUrlParam.push("$inlinecount=allpages");
          
          if (aSmartTableQueryUrlParam.length > 0) {
            sQueryUri += "?" + aSmartTableQueryUrlParam.join("&");
          }
        
          return sQueryUri;
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
