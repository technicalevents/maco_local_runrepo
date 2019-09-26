sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
    "sap/ui/model/Sorter",
    "sap/ui/thirdparty/jszip",
	"sap/ui/core/util/File",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, messageFormatter, Constants, Utility, Sorter, 
			JSZip, File, SelectionVariant, Filter, FilterOperator) {
    'use strict';

    return ActionSmartTableController.extend(
      'com.sap.cd.maco.monitor.ui.app.displaymessages.view.MessageListReport',
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
          ActionSmartTableController.prototype.onInit.call(this, {
            entitySet: 'xMP4GxC_TransferDoc_UI',
            actions: {},
            controls: {
              table: 'idMessageSmartTable'
            }
          });
          
          this.getThisModel().setProperty("/DownloadBtnEnable", false);
          this.getThisModel().setProperty("/tileCustomUrl", this.getSaveTileCustomUrl);
          this.getThisModel().setProperty("/tileServiceUrl", this.getSaveTileServiceUrl.bind(this));
        },
        
      /******************************************************************* */
      /* PUBLIC METHODS */
      /******************************************************************* */

      /**
	   * Event is triggered when Back button is triggered
       * @param {object} oEvent BackButton Event
       * @public
       */
      onMessageRowSelect: function(oEvent) {
          var oObject = oEvent.getSource().getBindingContext().getObject();

          this.oRouter.navTo('messagePage', {
            TransferDocumentKey: oObject.TransferDocumentKey
          });
        },
        
        /**
	   * Event is triggered when message table selection is changed by user interaction
       * @param {object} oEvent    Table Selction Change event
	   * @public
	   */
        onMessageTableSelChange: function(oEvent) {
        	this.handleDownloadBtnEnable(oEvent.getSource());
        },
        
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
          
          this.storeCurrentAppState();
        },
        
        /**
		 * Function is triggered once Message table is updated
		 * @param {object} oEvent     Message Table Update Event
		 * @public
		 */
        onMessageTableUpdateFinish: function(oEvent) {
        	this.handleDownloadBtnEnable(oEvent.getSource());
        },
        
        /**
		 * Function handle enablity of download button on table selection change and table updation
		 * @param {object} oEvent     Message Table Control
		 * @public
		 */
        handleDownloadBtnEnable: function(oTableCntrl) {
        	var aSelectedContexts = oTableCntrl.getSelectedContexts();
        	var bDownloadBtnEnable = false;
        	
        	if(aSelectedContexts.length > 0) {
        		bDownloadBtnEnable = true;
        	}
        	
        	this.getThisModel().setProperty("/DownloadBtnEnable", bDownloadBtnEnable);
        },
        
        /**
		 * Function is triggered on click of Download button in List Page
		 * @public
		 */
		onPressDownload: function() {
			var aSelectedContexts = this.getView().byId("idMessageTable").getSelectedContexts();
			var aExternalUUIDFilter = [];
			var oFinalFilter;
			
			for(var intI = 0; intI < aSelectedContexts.length; intI++) {
				aExternalUUIDFilter.push(new Filter("ExternalUUID", FilterOperator.EQ, aSelectedContexts[intI].getObject().ExternalUUID));
			}
			
			oFinalFilter = new Filter(aExternalUUIDFilter, false);
			
			this.oTransaction.whenRead({
				path: "/xMP4GxC_TransferDoc_UI",
				busyControl: this.getView(),
				filters: [oFinalFilter],
				urlParameters : {
					$select: "ExternalUUID,ExternalPayload"
				}
			}).then(this._onSucessLoadMessageListData.bind(this));
		},

        /**
         * Event is triggered when FilterBar is initialized. 
         * This method will set Recently used FilterData in FilterBar
         * @public
         */
        onFilterBarInitialized: function() {
          var oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
          var oSmartTable = this.getView().byId("idMessageSmartTable");

          this.oNav.parseNavigation().done(function(oAppState) {
            if(!jQuery.isEmptyObject(oAppState)) {
              oSmartFilterBar.setDataSuiteFormat(oAppState.selectionVariant, true);
              oSmartTable.rebindTable(true);
            }
          }.bind(this));
        },
        
        /**
         * Event Handler - Function is triggered on click of (Message / Processes) link in Timeline item
         * @param {sap.ui.base.Event} oEvent Link Click event object
         * @public
         */
        onNavToProcess: function(oEvent) {
          var oObject = oEvent.getSource().getBindingContext().getObject();
          var oParam = {
          	semanticObject: Constants.SEMANCTIC_OBJECT.PROCESS_DOCUMENT,
          	action: Constants.SEMANTIC_ACTION.DISPLAY,
          	params: {
          		ProcessDocumentKey: oObject.ProcessDocumentKey,
          		ProcessID: oObject.ProcessID
          	}
          };
          
          this.oNav.navExternal(oParam);
        },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable Data
         * @public
         */
        onRefresh: function() {
          this.getView().byId("idMessageSmartTable").rebindTable(true);
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
		* Function to Get the URL that the tile should point to
    	* @public
        * @returns {string} Url of Application for save as tile action
    	*/
        getSaveTileCustomUrl: function () {
            return document.URL;
        },
        
        /**
		* Function to Get the Service URL to show count in Tile
    	* @public
        * @returns {string} sQueryUri   Url of Application for count
    	*/
        getSaveTileServiceUrl: function () {
        	var sAppId = this.getOwnerComponent().getManifestEntry("/sap.app/id").split(".").join("");
        	var sServiceUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/Main/uri");
        	
        	// ensure trailing '/'
			sServiceUrl = /\/$/.test(sServiceUrl) ? sServiceUrl : sServiceUrl + "/";
			// ensure leading '/'
			sServiceUrl = /^\//.test(sServiceUrl) ? sServiceUrl : "/" + sServiceUrl;
			
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
        	
        	var oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
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
            var oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
			var oSmartFilterUiState = oSmartFilterBar.getUiState();
			var oSmartTable = this.getView().byId("idMessageSmartTable");
			var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
			var oCurrentAppState = {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: oSmartTable.getCurrentVariantId(),
				valueTexts: oSmartFilterUiState.getValueTexts()
			};
            this.oNav.storeInnerAppState(oCurrentAppState);
        },
        
        /******************************************************************* */
		/* PRIVATE METHODS */
		/******************************************************************* */
        
        /**
		 * Function is called when data read call is succesfull
		 * @param {object} oResult   Message List Data
		 * @private
		 */
        _onSucessLoadMessageListData: function(oResult) {
        	var aMessageListData = oResult.data.results;
			var oJSZip = new JSZip();
			var sFolderName = "Market Message " + new Date().toLocaleDateString();
			
			for(var intI = 0; intI < aMessageListData.length; intI++) {
				oJSZip.file(aMessageListData[intI].ExternalUUID + ".txt", aMessageListData[intI].ExternalPayload);
			}
			
			var oContent = oJSZip.generate({type:"blob"});
			File.save(oContent, sFolderName,"zip","application/zip");
        }
      }
    );
  }
);
