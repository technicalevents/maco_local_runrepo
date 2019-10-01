sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, Formatter, SelectionVariant, Utility, Constants, Sorter, MessageToast) {
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
         * Event Handler on press of Execute Message Aggragation button
         * @param {sap.ui.base.Event} oEvent   Buttion press event
         * @public
         */
        onPressExecuteMessageAggregation: function(oEvent) {
			// create send aggregation action sheet only once
			if (!this._oSendAggregationActionSheet) {
				this._oSendAggregationActionSheet = sap.ui.xmlfragment(
					"com.sap.cd.maco.monitor.ui.app.displayprocesses.view.SendAggregationActionSheet",
					this
				);
				this.getView().addDependent(this._oSendAggregationActionSheet);
			}

			this._oSendAggregationActionSheet.openBy(oEvent.getSource());
        },
        
        /**
         * Event Handler on selection item from Action Sheet
         * @param {sap.ui.base.Event} oEvent   Buttion press event
         * @public
         */
        onSendAggregationItemPressed: function(oEvent) {
			var oProcessDocumentKey = Utility.generateGuid();
        	var oData = {
        		ProcessDocumentKey: oProcessDocumentKey,
        		Action: Constants.PROCESS_LIST_HEADER_ACTION.EXECUTE_MESSAGE_AGGREGATION,
        		Action_Item: oEvent.getSource().data("processId")
        	};
        	
        	var sKey = this.getView().getModel().createKey("/xMP4GxC_Proc_Detail_Action_UI", 
                                                    {ProcessDocumentKey: oProcessDocumentKey});
                                                    
            this.getOwnerComponent().getMessageManager().removeAllMessages();
                                                    
            this.getView().getModel().update(sKey, oData, 
	        	{success: function() {
	        		this._successRelativeReportExecution();
	        	}.bind(this)
        	});
        },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable DAa
         * @public
         */
        onRefresh: function(oEvent) {
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
        },
        
        /**
         * Function is called when relative report is executed
         * @private
         */
        _successRelativeReportExecution: function() {
        	var aMessageData = this.getOwnerComponent().getMessageManager().getMessageModel().getData();
        	if(jQuery.isArray(aMessageData)) {
    			MessageToast.show(aMessageData[0].message);
        	}
        }
      }
    );
  }
);
