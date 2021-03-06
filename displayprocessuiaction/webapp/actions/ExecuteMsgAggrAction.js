sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
  "sap/m/MessageToast"
], function(BaseAction, Utility, Constants, MessageToast) {
  "use strict";

  return BaseAction.extend("com.sap.cd.maco.monitor.ui.app.processuiactions.actions.ExecuteMsgAggrAction",
    {
      /******************************************************************* */
      /* CONSTRUCTOR */
      /******************************************************************* */

      /**
       * Constructor
       */
      constructor: function(oComponent, oConfig) {
        var sCardinality = "1..35";
        BaseAction.call(this, oComponent, oConfig, sCardinality);
      },

      /******************************************************************* */
      /* PUBLIC METHODS */
      /******************************************************************* */

      /**
       * Function is triggered on click of Execute Message Aggregation button in List Page
       * @public
       */
      execute: function(oParams) {
        return new Promise(function(resolve, reject) {
          // store params for async usage
          this._oView = oParams.busyControl;
          this._oContext = oParams.contexts;
          
          // create message aggregation action sheet only once
          if (!this._oExecuteMsgAggrActionSheet) {
            this._oExecuteMsgAggrActionSheet = sap.ui.xmlfragment("com.sap.cd.maco.monitor.ui.app.processuiactions.actions.ExecuteMsgAggrActionSheet", this);
            oParams.busyControl.addDependent(this._oExecuteMsgAggrActionSheet);
          }
          this._oExecuteMsgAggrActionSheet.openBy(oParams.event.getSource());
          
          // done
          resolve({params: oParams});
        }.bind(this));
      },

      /**
       * Function is triggered on selection of item from Execute Message Aggregation action sheet
       * @param {sap.ui.base.Event} oEvent   Buttion press event
       * @public
       */
      onExecuteMsgAggrItemSelected: function(oEvent) {
        var oProcessDocumentKey = Utility.generateGuid();
        var aProcessDocumentNumber = [];
        
        for(var intI = 0; intI < this._oContext.length; intI++) {
          aProcessDocumentNumber.push(this._oContext[intI].getProperty("ProcessDocumentNumber"));
        }
        
        var oData = {
          ProcessDocumentKey: oProcessDocumentKey,
          MultipleKey: aProcessDocumentNumber.toString(),
          Action: Constants.PROCESS_LIST_HEADER_ACTION.EXECUTE_MESSAGE_AGGREGATION,
          Action_Item: oEvent.getSource().data("processId")
        };

        var sKey = this.oModel.createKey("/xMP4GxC_Proc_Detail_Action_UI", {ProcessDocumentKey: oProcessDocumentKey});

        this.oTransaction.whenUpdated({
          path: sKey,
          data: oData,
          busyControl: this._oView
        }).then(function(oResponse) {
          MessageToast.show(JSON.parse(oResponse.response.headers["sap-message"]).message);
        }.bind(this));
      }
    }
  );
}
);
