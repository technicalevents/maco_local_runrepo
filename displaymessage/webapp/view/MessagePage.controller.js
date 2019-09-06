sap.ui.define(
	[
	  "com/sap/cd/maco/mmt/ui/reuse/objectPage/ObjectPageNoDraftController",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	  "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
	  "sap/ui/core/util/File"
	],
	function(ObjectPageNoDraftController, Constants, Utility, messageFormatter, File) {
	  'use strict';
  
	  return ObjectPageNoDraftController.extend(
		'com.sap.cd.maco.monitor.ui.app.displaymessages.view.ProcessPage',
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
			  ObjectPageNoDraftController.prototype.onInit.call(this, {
				entitySet: 'xMP4GxC_TransferDoc_UI',
				controls: {
				  objectPage: 'objectPage'
				},
				routes: {
				  this: 'messagePage'
				},
				notFoundMsg: this.notFoundMsg.bind(this),
				actions: {}
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
			 * Method will e triggered once object page binding is done with entitySet
			 * @param {object} oRouteParams    Route Parameters
			 * @param {object} oMessageData    Message Data
			 * @public
			 */
			onAfterBind: function(oRouteParams, oMessageData) {
				var oMessageData = {
					ExternalUUID: oMessageData.ExternalUUID,
					ExternalPayload: oMessageData.ExternalPayload
				};
				
				this.getThisModel().setProperty("/MessageData", oMessageData);
				
				this._whenLinkTransferDocumentsRead(oRouteParams)
				.then(this._onSucessLinkTransferDocumentsRead.bind(this));
			},
			
			/**
			 * Event Handler - Function is triggered on click of Process link in Message Header
			 * @param {sap.ui.base.Event} oEvent Link Click event object
			 * @public
			 */
			onNavigateToProcessDocument: function(oEvent) {
				var sLinkedDocumentNumber = oEvent.getSource().getText();
				this.navigateToLinkedDocument(sLinkedDocumentNumber, "LinkDocumentNumber");
			},
			
			/**
			 * Event Handler - Function is triggered on click of Message link in Message Header
			 * @param {sap.ui.base.Event} oEvent Link Click event object
			 * @public
			 */
			onNavigateToMessageDocument: function(oEvent) {
				var sLinkedDocumentNumber = oEvent.getSource().getText();
				this.navigateToLinkedDocument(sLinkedDocumentNumber, "ExternalUUID");
			},
			
			/**
			 * Function is triggered on click of (Message / Processes) link in Message Header
			 * @param {string} sLinkedDocumentNumber   Linked Document Number
			 * @param {string} sProperty               Property name
			 * @public
			 */
			navigateToLinkedDocument: function(sLinkedDocumentNumber, sProperty) {
				var aLinkedTransferDocuments = this.getThisModel().getProperty("/linkedTransferDocuments");
				var oLinkedTransferDocument = Utility.getObjectWithAttr(aLinkedTransferDocuments, 
											sProperty, sLinkedDocumentNumber);
				
				if(oLinkedTransferDocument && !jQuery.isEmptyObject(oLinkedTransferDocument)) {
					var sBusinessObjectType = oLinkedTransferDocument.TecBusinessObjectType;
					var sLinkedDocumentKey = oLinkedTransferDocument.LinkDocumentKey; 
					var sProcessID = oLinkedTransferDocument.ProcessID;
					var oParam = {
						semanticObject: Utility.getSemanticObject(sBusinessObjectType),
						action: Constants.SEMANTIC_ACTION.DISPLAY,
						params: Utility.getNavigationParameters(sBusinessObjectType, sLinkedDocumentKey, sProcessID)                    
					};
					
					this.oNav.navExternal(oParam);
				}
			},
			
			/**
			 * Function is triggered on click of Download button in Master Page
			 * @public
			 */
			onPressDownload: function() {
				var oMessageData = this.getThisModel().getProperty("/MessageData");
				var sExternalPayload = oMessageData.ExternalPayload.replace(/\n/g, "");
			
				/* eslint-disable no-undef */
				var oArrayBuffer = new ArrayBuffer(sExternalPayload.length);
				var oArrayView = new Uint8Array(oArrayBuffer);
				/* eslint-enable no-undef */
	
				for (var iCharIdx = 0; iCharIdx !== sExternalPayload.length; iCharIdx++) {
					oArrayView[iCharIdx] = sExternalPayload.charCodeAt(iCharIdx) & 0xFF;
				}
	
				var oData =  new Blob([oArrayBuffer]);
				var sFileName = oMessageData.ExternalUUID;
				var sFileExtension = "txt";
	
				File.save(oData, sFileName, sFileExtension);
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
				var oLinkedDocumentIds = {
					controlMessage: "",
					aperakMessage: "",
					processDocument: ""
				};
				
				oModel.setProperty("/linkedDocumentIds", jQuery.extend(true, {}, oLinkedDocumentIds));
				oModel.setProperty("/linkedTransferDocuments", []);
				
				if(!oResult && !oResult.data){
				return;
				}
				
				var aLinkedTransferDocuments;
				
				if (!oResult.data.results){
					aLinkedTransferDocuments = [oResult.data];
				} else if (oResult && oResult.data){
					aLinkedTransferDocuments = oResult.data.results;
				}
				
				for(var intI = 0; intI < aLinkedTransferDocuments.length; intI++) {
					switch (aLinkedTransferDocuments[intI].TecBusinessObjectType) {
						case Constants.BO_OBJECT_TYPE.CONTRL_MSG:
							oLinkedDocumentIds.controlMessage = aLinkedTransferDocuments[intI].ExternalUUID;
							oLinkedDocumentIds.controlMessageTimeStamp = aLinkedTransferDocuments[intI].Timestamp;             
							break;
			
						case Constants.BO_OBJECT_TYPE.APERAK_MSG:
							oLinkedDocumentIds.aperakMessage = aLinkedTransferDocuments[intI].ExternalUUID; 
							oLinkedDocumentIds.aperakMessageTimeStamp = aLinkedTransferDocuments[intI].Timestamp;
							break;
							
						case Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT:
							oLinkedDocumentIds.processDocument = aLinkedTransferDocuments[intI].LinkDocumentNumber; 
							break;
							
						default:
							break;
					}
				}
				
				oModel.setProperty("/linkedDocumentIds", jQuery.extend(true, {}, oLinkedDocumentIds));
				oModel.setProperty("/linkedTransferDocuments", jQuery.extend(true, [], aLinkedTransferDocuments));
			}
		}
	  );
	}
  );
  