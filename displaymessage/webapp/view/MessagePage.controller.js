sap.ui.define(
	[
	  "com/sap/cd/maco/mmt/ui/reuse/objectPage/ObjectPageNoDraftController",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	  "com/sap/cd/maco/monitor/ui/app/displaymessages/util/Formatter",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToProcessAction",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMessageAction",
	  "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	  "sap/ui/model/Context"
	],
	function(ObjectPageNoDraftController, Constants, messageFormatter, 
				NavToProcessAction, NavToMessageAction, Utility, Context) {
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
						share: oComponentActions.share
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
			 * @param {object} oRouteParams    Route Parameters
			 * @public
			 */
			onAfterBind: function(oRouteParams) {				
				this._whenLinkTransferDocumentsRead(oRouteParams)
				.then(this._onSucessLinkTransferDocumentsRead.bind(this));
			},

			/**
			 * Function will be triggered on click of Process Link
			 * @param {object} oEvent    Link click event
			 * @public
			 */
			onCrossAppNavigation: function(oEvent) {
				var oAction;
				var sPath = oEvent.getSource().getBinding("text").getPath();
				var sSemanticOject = oEvent.getSource().data("docType");
				
				if(sSemanticOject === Constants.SEMANCTIC_OBJECT.PROCESS_DOCUMENT) {
					oAction = new NavToProcessAction(this.getOwnerComponent(), "LinkDocumentKey");
				} else if(sSemanticOject === Constants.SEMANCTIC_OBJECT.TRANSFER_DOCUMENT) {
					oAction = new NavToMessageAction(this.getOwnerComponent(), "LinkDocumentKey");
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
				oModel.setProperty("/LinkedDocuments", {});
				oModel.setProperty("/linkedTransferDocuments", []);
				
				if(!oResult && !oResult.data){
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
				oModel.setProperty("/linkedTransferDocuments", jQuery.extend(true, [], aLinkedTransferDocuments));
			}
		}
	  );
	}
  );
  