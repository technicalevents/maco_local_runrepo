sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jszip",
	"sap/ui/core/util/File",
	"sap/m/MessageBox"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, messageFormatter, Constants, Sorter, JSONModel, Hasher, JSZip, File, MessageBox) {
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

          if(!sap.ui.getCore().getModel("DisplayMessageApp")) {
            // Create a JSON Model
            var oDisplayMsgAppModel = new JSONModel({
                FilterData: {}
            });
            oDisplayMsgAppModel.setDefaultBindingMode("OneWay");
            sap.ui.getCore().setModel(oDisplayMsgAppModel, "DisplayMessageApp");
          }
          
          this.getThisModel().setProperty("/DownloadBtnVisible", false);
          this.getThisModel().setProperty("/tileCustomUrl", this.getSaveTileCustomUrl);
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
          this._setFilterDataProperty();

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
        	this.handleDownloadBtnVisible(oEvent.getSource());
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
        },
        
        /**
		 * Function is triggered once Message table is updated
		 * @param {object} oEvent     Message Table Update Event
		 * @public
		 */
        onMessageTableUpdateFinish: function(oEvent) {
        	this.handleDownloadBtnVisible(oEvent.getSource());
        },
        
        /**
		 * Function handle visibility of download button on table selection change and table updation
		 * @param {object} oEvent     Message Table Control
		 * @public
		 */
        handleDownloadBtnVisible: function(oTableCntrl) {
        	var aSelectedContexts = oTableCntrl.getSelectedContexts();
        	var bDownloadBtnVisible = false;
        	
        	if(aSelectedContexts.length > 0) {
        		bDownloadBtnVisible = true;
        	}
        	
        	this.getThisModel().setProperty("/DownloadBtnVisible", bDownloadBtnVisible);
        },
        
        /**
		 * Function is triggered on click of Download button in List Page
		 * @public
		 */
		onPressDownload: function() {
			var aSelectedContexts = this.getView().byId("idMessageTable").getSelectedContexts();
			var oSelectedObject = {};
			var oJSZip = new JSZip();
			var bRecordExceedLimit = false;
			var sFolderName = "Market Message " + new Date().toLocaleDateString();
			
			for(var intI = 0; intI < aSelectedContexts.length && !bRecordExceedLimit; intI++) {
				oSelectedObject = aSelectedContexts[intI].getObject();
				oJSZip.file(oSelectedObject.ExternalUUID + ".txt", oSelectedObject.ExternalPayload);
				
				if(Object.keys(oJSZip.files).length > 50) {
					bRecordExceedLimit = true;
					delete oJSZip.files[oSelectedObject.ExternalUUID + ".txt"];
				}
			}
			
			if(bRecordExceedLimit) {
				// Download confirmation popup
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				
				MessageBox.confirm(oResourceBundle.getText("MESSAGE_LIST_DOWNLOAD_TEXT"), {
					title: oResourceBundle.getText("MESSAGE_LIST_DOWNLOAD_TITLE"),
					onClose: function(oAction) {
						if (oAction === MessageBox.Action.OK) {
							var oContent = oJSZip.generate({type:'blob'});
							File.save(oContent, sFolderName,"zip","application/zip");
						}
					}.bind(this)
				});
			} else {
				var oContent = oJSZip.generate({type:'blob'});
				File.save(oContent, sFolderName,"zip","application/zip");
			}
		},

        /**
         * Event is triggered when FilterBar is initialized. 
         * This method will set Recently used FilterData in FilterBar
         * @public
         */
        onFilterBarInitialized: function() {
          var oFilterData = jQuery.extend(true, {}, sap.ui.getCore().getModel("DisplayMessageApp").getProperty("/FilterData"));
          var oSmartFilterBar = this.getView().byId("idMessageSmartFilterBar");
          var oSmartTable = this.getView().byId("idMessageSmartTable");
          
          oSmartFilterBar.setFilterData(oFilterData);

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
          this._setFilterDataProperty();

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

        /******************************************************************* */
        /* PRIVATE METHODS */
        /******************************************************************* */
        
        /**
         * Method will retrieve filter data from filterbar and set in JSON Model
         * @public
         */
        _setFilterDataProperty: function() {
        	var oFilterData = jQuery.extend(true, {}, 
                            this.getView().byId("idMessageSmartFilterBar").getFilterData());
            sap.ui.getCore().getModel("DisplayMessageApp").setProperty("/FilterData", oFilterData);
        }
      }
    );
  }
);
