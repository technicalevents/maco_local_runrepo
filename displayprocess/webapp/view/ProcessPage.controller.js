sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter"
  ],function(ObjectPageNoDraftController, Formatter) {
    "use strict";

    return ObjectPageNoDraftController.extend(
      "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.ProcessPage",
      {
        formatter: Formatter,

        /**
         * Lifecycle method - triggered on initialization of ProcessPage Controller
         */
        onInit: function() {
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
            actions: this.getOwnerComponent().mActions
          });
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
          // Set first tab 'FlowTab' as by default on click of process in process list app
          this.byId("idProcessObjectPage").setSelectedSection(this.getView().getId() + "--idFlowTab");
        	
          this.getViewModel().setProperty("/IsAssociatedTabVisible", false);

          var sBindingPath = this.getView().getModel().createKey("/xMP4GxC_Linked_Associated_Proc", 
                          {ProcessDocumentKey: oRouteParams.ProcessDocumentKey}) + "/Set";
          var oAssociatedSmartTable = this.byId("idAssociatedProcessSmartTable");

          oAssociatedSmartTable.setTableBindingPath(sBindingPath);
          oAssociatedSmartTable.rebindTable();
                  
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
         * Method will be triggered once data has been recevied for associated process table
         * @param {object} oResponseData   Response Data
         * @public
         */
        onAssociatedProcessDataReceived: function(oResponseData) {
          var oAssocaitedProcessData = oResponseData.getParameter("mParameters").data;
          var iAssociatedProcessCount;
          
          if(oAssocaitedProcessData) {
            if(oAssocaitedProcessData.__count) {
              iAssociatedProcessCount = Number(oAssocaitedProcessData.__count);
            }
          } else {
            iAssociatedProcessCount = 0;
          }
          
          if(iAssociatedProcessCount) {
            this.getViewModel().setProperty("/IsAssociatedTabVisible", iAssociatedProcessCount > 0);
          }
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
                                                    
          return this.mSingles.transaction.whenRead({
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

          var oBindingContext = this.getView().byId("idProcessObjectPage").getBindingContext();
          var sOwnerUUID = oBindingContext.getObject("OwnerUUIDText") + " (" + oBindingContext.getObject("OwnerUUID") + ")";

          if (!oResult.data.results){
            aProcess = [oResult.data];
          } else if (oResult && oResult.data){
            aProcess = oResult.data.results;
          }
          
          for(var intI = 0; intI < aProcess.length; intI++) {
          	if(aProcess[intI].MarketPartner !== "") {
          		aMarketPartner.push(aProcess[intI].MarketPartnerText + " (" + aProcess[intI].MarketPartner + ")");
          	}
          }

          if(aMarketPartner.length > 1 && aMarketPartner.indexOf(sOwnerUUID) >= 0) {
          	aMarketPartner.splice(aMarketPartner.indexOf(sOwnerUUID), 1);
          }

          var sMarketPartner = aMarketPartner.join(", ");
          var oModel = this.getViewModel();
          oModel.setProperty("/MarketPartner", sMarketPartner);
        }
    });
});