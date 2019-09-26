sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/objectPage/ObjectPageNoDraftController",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/m/MessageBox",
    "sap/ui/core/MessageType",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants"
  ],
  function(ObjectPageNoDraftController, Formatter, MessageBox, MessageType, Constants) {
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
         * Event Handler on press of Close Latest Deadline button
         * @public
         * @param {object} oRouteParams Route parameters of Process Page
         */
        onPressCloseLatestDeadline: function() {
        	this.headerActionButtonPressed(Constants.PROCESS_LIST_HEADER_ACTION.CLOSE_LATEST_DEADLINE);
        },
        
        /**
         * Event Handler on press of Execute Transfer Document button
         * @public
         */
        onPressExecuteTransferDocument: function() {
        	this.headerActionButtonPressed(Constants.PROCESS_LIST_HEADER_ACTION.EXECUTE_TRANSFER_DOCUMENT);
        },
        
        /**
         * Function is triggered when process page header action buttons are pressed
         * @public
         * @param {object} oRouteParams Route parameters of Process Page
         */
        headerActionButtonPressed: function(sAction) {
        	var oRouteParams = this.getThisModel().getProperty("/RouteParams");
        	var oData = {
        		// ProcessDocumentKey: oRouteParams.ProcessDocumentKey,
        		ProcessDocumentKey: this.generateGuid(),
        		Action: sAction,
        		Action_Item: ""
        	};
        	
        	var sKey = this.getView().getModel().createKey("/xMP4GxC_Proc_Detail_Action_UI", 
                                                    {ProcessDocumentKey: oRouteParams.ProcessDocumentKey});
                                                    
            this._getMessageModel().setData([]);
                                                    
            this.getView().getModel().update(sKey, oData, 
	        	{success: function() {
	        		this._successRelativeReportExecution();
	        	}.bind(this)
        	});
        },
        
        generateGuid: function() {
			function r() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(
					1);
			}
			return r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() +
				r();
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
        },
        
        /**
         * Function is used to get Message Model from Message Managewr
         * @private
         * @returns {object}     Message Model
         */
        _getMessageModel: function() {
        	if(!this._oMessageManager) {
        		this._oMessageManager = sap.ui.getCore().getMessageManager();
        	}
        	return this._oMessageManager.getMessageModel();
        },
        
        /**
         * Function is called when relative report is executed
         * @private
         */
        _successRelativeReportExecution: function() {
        	var aMessageData = this._getMessageModel().getData();
    		var oMessage = aMessageData[0];
    		if(oMessage.type === MessageType.Success) {
    			MessageBox.success(aMessageData[0].message);
    		} else if(oMessage.type === MessageType.Error) {
    			MessageBox.error(aMessageData[0].message);
    		}
        }
      }
    );
  }
);
