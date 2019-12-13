sap.ui.define(
	[
	  "com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	  "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
	  "sap/ui/model/Context"
	],
	function(ObjectPageNoDraftController, Constants, messageFormatter, Context) {
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
						navObjectTableToProcessApp: oComponentActions.navObjectTableToProcessApp
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
				var oModel = this.getThisModel();
				oModel.setProperty("/LinkedDocuments", {});
				oModel.setProperty("/LinkedTransferDocuments", []);
				oModel.setProperty("/TransferDocumentKey", oRouteParams.TransferDocumentKey);
				
				this._whenLinkTransferDocumentsRead(oRouteParams);
				
				if(oTransferDocument.ProcessDocumentKey === "00000000-0000-0000-0000-000000000000") {
					this.byId("idLinkedProcessSmartTable").rebindTable();
				} else {
					oModel.setProperty("/LinkedDocuments/ProcessDocCount", 1);
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
			 * @public
			 */
        	onBeforeRebindTable: function() {
        		var sTransferDocumentKey = this.getThisModel().getProperty("/TransferDocumentKey");
        		
        		if(sTransferDocumentKey) {
        			this.byId("idLinkedProcessSmartTable").setTableBindingPath("/xMP4GxC_GetLinkedPdocDetails(TransferDocumentKey=guid'"+ sTransferDocumentKey + "')/Set");
        		}
			},
			
			/**
			 * Method will be triggered once data has been recevied for process document table
			 * @param {object} oResponseData   Response Data
			 * @public
			 */
			onProcessDocDataReceived: function(oResponseData) {
				var oProcessDocData = oResponseData.getParameter("mParameters").data;
				var iProcessDocCount;
				
				if(oProcessDocData) {
					if(oProcessDocData.__count) {
						iProcessDocCount = Number(oProcessDocData.__count);
					}
				} else {
					iProcessDocCount = 0;
				}
				
				if(iProcessDocCount) {
					this.getThisModel().setProperty("/LinkedDocuments/ProcessDocCount", iProcessDocCount);
				}
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
					var sLinkedDocumentKey = this.getView().getModel().createKey("/xMP4GxC_LinkedDocuments_UI", 
			    						{TransferDocumentKey: sTransferDocumentKey});
			    						
					this.oTransaction.whenRead({
						path: sLinkedDocumentKey + "/Set",
						busyControl: this.getView()
					}).then(this._onSucessLinkTransferDocumentsRead.bind(this));
					
					var sExternalPayloadKey = this.getView().getModel().createKey("/xMP4GxC_TransferDoc_UI", 
			    						{TransferDocumentKey: sTransferDocumentKey});
					this.oTransaction.whenRead({
						path: sExternalPayloadKey,
						urlParameters: {
							$select: "ExternalPayload"
						},
						busyControl: this.getView()
					}).then(this._onSucessExternalPayloadRead.bind(this));
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
				var aLinkedTransferDocuments = oModel.getProperty("/LinkedTransferDocuments");
				var oLinkedDocuments = oModel.getProperty("/LinkedDocuments");
		        var iControlDocument = 0;
		        var iAperakDocument = 0;
				
				if (oResult && oResult.data && !oResult.data.results){
					aLinkedTransferDocuments = [oResult.data];
				} else if (oResult && oResult.data){
					aLinkedTransferDocuments = oResult.data.results;
				}
				
				for(var intI = 0; intI < aLinkedTransferDocuments.length; intI++) {
					if(aLinkedTransferDocuments[intI].TecBusinessObjectType === Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT) {
						if(aLinkedTransferDocuments[intI].SemanticType === Constants.BO_OBJECT_TYPE.APERAK_DOC) {
							oLinkedDocuments.AperakMessage = aLinkedTransferDocuments[intI];   
							iAperakDocument++;
						} else if(aLinkedTransferDocuments[intI].SemanticType === Constants.BO_OBJECT_TYPE.CONTRL_DOC) {
							oLinkedDocuments.ControlMessage = aLinkedTransferDocuments[intI];  
							iControlDocument++;
						} else {
							oLinkedDocuments.OriginalMessage = aLinkedTransferDocuments[intI];
						}
					} else if(aLinkedTransferDocuments[intI].TecBusinessObjectType === Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT) {
						oLinkedDocuments.ProcessDocument = aLinkedTransferDocuments[intI];   
					}
				}
				
				oLinkedDocuments.AperakDocCount = iAperakDocument;
				oLinkedDocuments.ContrlDocCount = iControlDocument;
				
				oModel.setProperty("/LinkedDocuments", oLinkedDocuments);
				oModel.setProperty("/LinkedTransferDocuments", aLinkedTransferDocuments);
			},
			
			/**
			 * Function is called when data read call is succesfull
			 * @param {object} oResult   Linked transfer documents
			 * @private
			 */
			_onSucessExternalPayloadRead: function(oResponseData) {
				var sExternalPayload = oResponseData.data.ExternalPayload;
				var sFormattedExternalPayload = "";
        
		        if(sExternalPayload) {
		          sFormattedExternalPayload = sExternalPayload.replace(new RegExp("'", 'g'), "' \n");
		        }
		        
				this.getThisModel().setProperty("/ExternalPayload", sFormattedExternalPayload);
			}
		}
	  );
	}
  );
  