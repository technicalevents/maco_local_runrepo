sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter"
  ],
  function(ObjectPageNoDraftController, Formatter) {
    "use strict";

    return ObjectPageNoDraftController.extend(
      "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.ProcessPage",
      {
        formatter: Formatter,

        /**
         * Lifecycle method - triggered on initialization of ProcessPage Controller
         */
        onInit: function() {
          var oComponentActions = this.getOwnerComponent().actions;
        	
          ObjectPageNoDraftController.prototype.onInit.call(this, {
            routes: {
              parent: "listReport",
              this: "processPage",
              child: null
            },
            entitySet: "xMP4GxC_ProcActivityHeader_UI",
            i18n: {
              notFoundMsg: this.notFoundMsg.bind(this)
            },
            controls: {
              objectPage: "idProcessObjectPage"
            },
            actions: {
              reportExecution: oComponentActions.reportExecution,
              share: oComponentActions.share,
              navToProcessAction: oComponentActions.navToProcessAction
            }
          });
          
          this.oTransaction.whenRead({
			path: "/xMP4GxC_System_Details",
			busyControl: this.getView()
		  }).then(function(oData) {
		  	this.getThisModel().setProperty("/SystemDetails", oData.data.results[0]);
		  }.bind(this));
        },
        
        /******************************************************************* */
        /* PUBLIC METHODS */
        /******************************************************************* */

        /**
         * Event Handler - Triggered before Binding is started on parent view (Process Page)
         * @public
         * @param {object} oRouteParams Route parameters of Process Page
         */
        onBeforeBind: function(oRouteParams){
        	this.getThisModel().setProperty("/ProcessDocumentKey", oRouteParams.ProcessDocumentKey);
        	this.byId("idAssociatedProcessSmartTable").rebindTable();                             
        	
        	this._whenProcessDataRead(oRouteParams.ProcessDocumentKey)
            	.then(this._onSucessProcessDataRead.bind(this));
            
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
         * Function returns no found message in case of some errors
         * @public
         * @returns {string} No found message
         */
        notFoundMsg: function() {
          return this.oBundle.getText("PROCESS_NOT_FOUND_TXT", [this.oRouteArgs.Id]);
        },
        
        /**
	  	 * Event is triggered before data loading of smart table
	  	 * @public
		 */
        onBeforeRebindTable: function() {
        	var sProcessDocumentKey = this.getThisModel().getProperty("/ProcessDocumentKey");
        	var sBindingPath = this.getView().getModel().createKey("/xMP4GxC_Linked_Associated_Proc", {ProcessDocumentKey: sProcessDocumentKey}) + "/Set";
        	this.byId("idAssociatedProcessSmartTable").setTableBindingPath(sBindingPath);
        	// this.byId("idAssociatedProcessSmartTable").setTableBindingPath("/xMP4GxC_Linked_Associated_Proc(ProcessDocumentKey=guid'"+ sProcessDocumentKey + "')/Set");
        },

        /******************************************************************* */
        /* PRIVATE METHODS */
        /******************************************************************* */
        
        /**
         * Function is used to trigger call to fetch data for the selected Process
         * @private
         * @param {string} sProcessDocumentKey Selected Process Id
         * @returns {Promise} Promise object of data read call
         */
        _whenProcessDataRead: function(sProcessDocumentKey) {
          var sKey = this.getView().getModel().createKey("/xMP4GxC_ProcActivityHeader_UI", 
                                                    {ProcessDocumentKey: sProcessDocumentKey});
                                                    
          return this.oTransaction.whenRead({
                path: sKey + "/to_PrMkPartner",
                busyControl: this.getView()
          });
        },
        
        /**
         * Function is called when data read call is succesfull
         * @private
         * @param {object} oResult Process Step Data object
         */
        _onSucessProcessDataRead: function(oResult){
          if(!oResult && !oResult.data){
            return;
          }

          var aProcess, aMarketPartner = [];

          if (!oResult.data.results){
            aProcess = [oResult.data];
          } else if (oResult && oResult.data){
            aProcess = oResult.data.results;
          }
          
          for(var intI = 0; intI < aProcess.length; intI++) {
          	if(aProcess[intI].MarketPartner !== "") {
          		aMarketPartner.push(aProcess[intI].MarketPartner);
          	}
          }

          var sMarketPartner = aMarketPartner.join(", ");
          var oModel = this.getThisModel();
          oModel.setProperty("/MarketPartner", sMarketPartner);
        }
      }
    );
  }
);