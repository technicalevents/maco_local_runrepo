sap.ui.define(
	[
	  "com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	  "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
	  "sap/ui/model/Context",
	  "sap/ui/model/Filter",
	  "sap/ui/model/FilterOperator"
	],
	function(ObjectPageNoDraftController, Constants, messageFormatter, Context, Filter, FilterOperator) {
	  "use strict";
  
	  return ObjectPageNoDraftController.extend(
		"com.sap.cd.maco.monitor.ui.app.displaymessages.view.MessagePage",
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
		   * LifeCycle method Called when MessagePage controller is instantiated.
		   * @public
		   */
			onInit: function() {
				var oComponentActions = this.getOwnerComponent().actions;

				ObjectPageNoDraftController.prototype.onInit.call(this, {
					routes: {
						parent: "listReport",
						this: "messagePage"
					},
					entitySet: "xMP4GxC_TransferDoc_UI",
					i18n: {
						notFoundMsg: this.notFoundMsg.bind(this)
					},
					controls: {
						objectPage: "objectPage"
					},
					actions: {
						singleDownload: oComponentActions.singleDownload,
						share: oComponentActions.share,
						multipleDoc: oComponentActions.multipleDoc,
						navListToProcessApp: oComponentActions.navListToProcessApp
					}
				});
			},
	
			/******************************************************************* */
			/* PUBLIC METHODS */
			/******************************************************************* */
	
			/**
			 * Method is triggered when there is no messages in message list.
			 * @public
			 */
			notFoundMsg: function() {
			  return this.oBundle.getText("MSG_NOT_FOUND_TITLE");
			},
			
			/**
			 * Method will be triggered once object page binding is done with entitySet
			 * @param {object} oRouteParams        Route Parameters
			 * @param {object} oTransferDocument   TransferDocument 
			 * @public
			 */
			onAfterBind: function(oRouteParams, oTransferDocument) {				
				this._whenLinkTransferDocumentsRead(oRouteParams)
				.then(this._onSucessLinkTransferDocumentsRead.bind(this));
				
				var aProcessDocumentKey = oTransferDocument.ProcessDocumentKey.split(",");
				var oModel = this.getThisModel();
				
				oModel.setProperty("/LinkedProcessDocuments", aProcessDocumentKey);
				oModel.setProperty("/TransferDocumentKey", oRouteParams.TransferDocumentKey);
				
				if(aProcessDocumentKey.length > 1) {
					this.byId("idLinkedProcessSmartTable").rebindTable();
				}
			},
			
			/**
			 * Method will be triggered before object page binding is done with entitySet
			 * @public
			 */
			 onBeforeBind: function() {
				this.oComponent.getService("ShellUIService").then(
					function(oService) {
						oService.setTitle(this.oBundle.getText("SINGLE_MSG_TITLE"));
						var oSapApp = this.oComponent.getManifestEntry("sap.app");
						var oIntent = oSapApp.crossNavigation.inbounds.intent1;
						var sIntent = "#" + oIntent.semanticObject + "-" + oIntent.action;
						oService.setHierarchy([
							{
								title: this.oBundle.getText("APP_TITLE"),
								intent: sIntent
							}
						]);
					}.bind(this),
					function(oError) {
						jQuery.sap.log.error("Cannot get ShellUIService", oError);
					}
				);
			},
			
			/**
			 * Method will be triggered before Rebinding Smart Table
			 * @param {object} oEvent   Rebinding table event
			 * @public
			 */
        	onBeforeRebindTable: function(oEvent) {
        		var oSmartTable = this.byId("idLinkedProcessSmartTable");
        		var oModel = this.getThisModel();
        		var aLinkedProcessDocument = oModel.getProperty("/LinkedProcessDocuments");
        		var sTransferDocumentKey = oModel.getProperty("/TransferDocumentKey");
        		
        		if(aLinkedProcessDocument && aLinkedProcessDocument.length > 0) {
        			oSmartTable.setTableBindingPath("/xMP4GxC_TransferDoc_UI(TransferDocumentKey=guid'"+ sTransferDocumentKey + "')/to_linkedTransferPdoc");
        			var oParams = oEvent.getParameter("bindingParams");
	        		if(oParams) {
	        			oParams.parameters.select = "ProcessDocumentNumber,ProcessIDDescription,ProcessClusterDescriptionISL,OwnerUUID,ProcessDate," + 
	        										"ProcessTimestamp,ProcessStatusDescription,StatusCriticality,ProcessDocumentKey,ProcessID";
	        		}
        		}
			},
			
			/**
			 * Formatter method to handle label for multiple document
			 * @param   {object} aLinkedDocument            Array of linked document
			 * @param   {string} sTecBusinessObjectType     Technical Business Object Type
			 * @public
			 * @returns {string}                            Label for multiple document
			 */
        	formatMultipleDocumentLabel: function(aLinkedDocument, sTecBusinessObjectType) {
				return this.oBundle.getText("MULTI_DOCUMENT_TXT", [
						messageFormatter.multipleDocumentLabelnNumber(aLinkedDocument, sTecBusinessObjectType)]);
			},
			
			/**
			 * Formatter method to handle visibility for multiple document
			 * @param   {object} aLinkedDocument            Array of linked document
			 * @param   {string} sTecBusinessObjectType     Technical Business Object Type
			 * @public
			 * @returns {string}                            Visibility for multiple document
			 */
			formatMultipleDocumentVisible: function(aLinkedDocument, sTecBusinessObjectType) {
				return (messageFormatter.multipleDocumentLabelnNumber(aLinkedDocument, sTecBusinessObjectType)) > 1 ? true : false;
			},

			/**
			 * Function will be triggered on click of Process Link
			 * @param {object} oEvent    Link click event
			 * @public
			 */
			onCrossAppNavigation: function(oEvent) {
				var oAction;
				var sPath = oEvent.getSource().getBinding("text").getPath();
				var sDocType = oEvent.getSource().data("docType");
				var oComponentActions = this.getOwnerComponent().actions;
				
				if(sDocType === "Process") {
					oAction = oComponentActions.navObjectToProcessApp;
				} else if(sDocType === "Message") {
					oAction = oComponentActions.navObjectToMessageApp;
				} else {
					throw new Error("undefined mapping for object type: " + sDocType);
				}
				
				var oParams = {
				    busyControl: this.getView(),
				    contexts: [new Context(this.getThisModel(), sPath.substring(0, sPath.lastIndexOf("/")))]
				};
				oAction.execute(oParams);
			},
			
			/******************************************************************* */
			/* PRIVATE METHODS */
			/******************************************************************* */
			
			/**
			 * Function is used to trigger call to fetch Linked transfer document data for the selected transfer document
			 * @param  {object}  oRouteParams    Route Parameters
			 * @private
			 * @returns {Deferred.promise{}}      Promise object of data read call else Navigation to MessageNotFound Page
			 */
			_whenLinkTransferDocumentsRead: function(oRouteParams) {
				var sTransferDocumentKey = oRouteParams.TransferDocumentKey;
				
				if(sTransferDocumentKey) {
					var sKey = this.getView().getModel().createKey("/xMP4GxC_TransferDoc_UI", 
			    						{TransferDocumentKey: sTransferDocumentKey});
			    						
					return this.oTransaction.whenRead({
						path: sKey + "/to_linkedTransferDocument",
						busyControl: this.getView()
					});
				} else {
					// show message
                    this.oNav.navNotFound({
						msg: this.notFoundMsg()
					});
				}
			},
	
			/**
			 * Function is called when data read call is succesfull
			 * @param {object} oResult   Linked transfer documents
			 * @private
			 */
			_onSucessLinkTransferDocumentsRead: function(oResult){
				var oModel = this.getThisModel();
				
				if(!oResult && !oResult.data){
					oModel.setProperty("/LinkedDocuments", {});
					oModel.setProperty("/LinkedTransferDocuments", []);
					return;
				}
				
				var aLinkedTransferDocuments;
				var oLinkedDocuments = {};
				
				if (!oResult.data.results){
					aLinkedTransferDocuments = [oResult.data];
				} else if (oResult && oResult.data){
					aLinkedTransferDocuments = oResult.data.results;
				}
				
				for(var intI = 0; intI < aLinkedTransferDocuments.length; intI++) {
					switch (aLinkedTransferDocuments[intI].TecBusinessObjectType) {
						case Constants.BO_OBJECT_TYPE.CONTRL_MSG:
							oLinkedDocuments.ControlMessage = aLinkedTransferDocuments[intI];            
							break;
								
						case Constants.BO_OBJECT_TYPE.APERAK_MSG:
							oLinkedDocuments.AperakMessage = aLinkedTransferDocuments[intI];    
							break;
								
						case Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT:
							oLinkedDocuments.ProcessDocument = aLinkedTransferDocuments[intI];    
							break;
								
						case Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT:
							oLinkedDocuments.TransferDocument = aLinkedTransferDocuments[intI];    
							break;	
								
						default:
							break;
					}
				}
				
				oModel.setProperty("/LinkedDocuments", jQuery.extend(true, {}, oLinkedDocuments));
				oModel.setProperty("/LinkedTransferDocuments", jQuery.extend(true, [], aLinkedTransferDocuments));
			}
		}
	  );
	}
  );
  