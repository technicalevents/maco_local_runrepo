sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/objectPage/ObjectPageNoDraftController",
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
          ObjectPageNoDraftController.prototype.onInit.call(this, {
            routes: {
              this: "processPage"
            },
            entitySet: "xMP4GxC_ProcActivityHeader_UI",
            notFoundMsg: this.notFoundMsg.bind(this),
            controls: {
              objectPage: "idProcessObjectPage"
            },
            actions: {}
          });
        },

        /**
         * Event Handler - Triggered before Binding is started on parent view (Process Page)
         * @public
         * @param {object} oRouteParams Route parameters of Process Page
         */
        onBeforeBind: function(oRouteParams){
          this.getThisModel().setProperty("/RouteParams", jQuery.extend(true, {}, oRouteParams));
          
          this._whenProcessDataRead(oRouteParams.ProcessDocumentKey)
            .then(this._onSucessProcessDataRead.bind(this));
        },
        
        /**
         * Event Handler on press of Deadline button
         * @public
         * @param {object} oRouteParams Route parameters of Process Page
         */
        onPressDeadline: function(oEvent) {
        	var oRouteParams = this.getThisModel().getProperty("/RouteParams");
        	var oDeadlineData = {
        		ProcessDocumentKey: oRouteParams.ProcessDocumentKey,
        		ProcessDocumentNumber: "",
        		Action: "Deadline",
        		ReturnMessage: ""
        	};
        	
        	this.getView().getModel().create("/xMP4GxC_Proc_Detail_Action_UI", oDeadlineData, 
	        	{success: function(oData) {
	        		
	        	}.bind(this),
	        	error: function(oError) {
	        		
	        	}.bind(this)
        	});
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
