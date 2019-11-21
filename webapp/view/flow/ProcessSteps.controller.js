sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/model/json/JSONModel",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
    "com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
    "sap/ui/model/Sorter"
  ],
  function(
    BaseViewController,
    formatter,
    JSONModel,
    Constants,
    Utility,
    Sorter
  ) {
    "use strict";

    return BaseViewController.extend(
      "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.flow.ProcessSteps",
      {
        formatter: formatter,

        /**
         * Lifecycle method - triggered on initialization of Process Step Controller
         */
        onInit: function() {
          BaseViewController.prototype.onInit.apply(this, arguments);

          // Attach parent context change
          this.attachParentContextChange(this.onParentContextChange.bind(this));

          // Create a JSON Model
          var oThisModel = new JSONModel({});
          oThisModel.setDefaultBindingMode("OneWay");

          // Setting model to view
          this.getView().setModel(oThisModel, "this");
        },

        /**
         * Event Handler - Triggered when Binding is completed on parent view (Process Page)
         * @public
         * @param {object} oContext Binding Context of Process Page
         */
        onParentContextChange: function(oContext) {
          var oProcess = oContext.getObject();
          this._whenProcessStepDataRead(oProcess.ProcessDocumentKey).then(
            this._onSucessProcessStepDataRead.bind(this)
          );
        },

        /**
         * Event Handler - Function is triggered on click of (Message / Processes) link in Timeline item
         * @param {sap.ui.base.Event} oEvent Link Click event object
         */
        navigateToBusinessObject: function(oEvent) {
          var oContext = oEvent.getSource().getBindingContext("this");
          var sObjectType = oContext.getObject().BusinessObjectType;
          var oActions = this.getOwnerComponent().actions;
          var oAction;

          if (sObjectType === Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT) {
            oAction = oActions.navToProcessAction;
          } else if (
            sObjectType === Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT ||
            sObjectType === Constants.BO_OBJECT_TYPE.APERAK_MSG ||
            sObjectType === Constants.BO_OBJECT_TYPE.CONTRL_MSG
          ) {
            oAction = oActions.navToMessageAction;
          } else {
            throw new Error(
              "failed to determine action for object type: " + sObjectType
            );
          }

          var oParams = {
            busyControl: this.getView(),
            contexts: [oContext]
          };
          oAction.execute(oParams);
        },

        /**
         * Formatter method returns formatted Process Activity Title
         * @param   {string} 	sLinkedDocNumber	 Linked Documber
         * @param   {string} 	sTechnicalMessageId	 Technical Message Id
         * @param   {string} 	sBusinessObjectType	 Business Object Type
         * @param   {string} 	sUserDecision		 User Decision text
         * @param   {boolean} 	bExternalMessage	 Message is External or not
         * @public
         * @returns {string} 	    	             Formatted title
         */
        formatProcessActivityTitle: function(
          sLinkedDocNumber,
          sTechnicalMessageId,
          sBusinessObjectType,
          sUserDecision,
          bExternalMessage
        ) {
          var oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
          var sI18nFormat;
          var aI18nData = [];
          var sProcessActivityTitle;

          if (
            sBusinessObjectType ===
              Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT &&
            bExternalMessage
          ) {
            sI18nFormat = "MARKET_MESSAGE_REFERENCE_LINK_LBL";
            aI18nData = [sTechnicalMessageId, sLinkedDocNumber];
            sProcessActivityTitle = oResourceBundle.getText(
              sI18nFormat,
              aI18nData
            );
          } else if (
            sBusinessObjectType === Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT
          ) {
            sI18nFormat = "MARKET_PROCESS_REFERENCE_LINK_LBL";
            aI18nData = [sLinkedDocNumber];
            sProcessActivityTitle = oResourceBundle.getText(
              sI18nFormat,
              aI18nData
            );
          } else if (
            sBusinessObjectType === Constants.BO_OBJECT_TYPE.EXCEPTION_DOCUMENT
          ) {
            sI18nFormat = "DECISION_LBL";
            sProcessActivityTitle = oResourceBundle.getText(sI18nFormat);
          } else {
            sProcessActivityTitle = "";
          }

          return sProcessActivityTitle;
        },

        /**
         * Function is used to trigger call to fetch Process Steps data for the selected Process
         * @private
         * @param {string} sProcessDocumentKey Selected Process Id
         * @returns {Promise} Promise object of data read call
         */
        _whenProcessStepDataRead: function(sProcessDocumentKey) {
          var sKey = this.getView()
            .getModel()
            .createKey("/xMP4GxC_Process_Activities_UI", {
              ProcessDocumentKey: sProcessDocumentKey
            });

          return this.oTransaction.whenRead({
            path: sKey + "/Set",
            busyControl: this.getView(),
            sorters: [
              new Sorter("ActivityTimestamp", true),
              new Sorter("ProcessEventKey", true)
            ]
          });
        },

        /**
         * Function is called when data read call is succesfull
         * @private
         * @param {object} oResult Process Step Data object
         */
        _onSucessProcessStepDataRead: function(oResult) {
          if (!oResult && !oResult.data) {
            return;
          }

          var aProcessSteps;

          if (!oResult.data.results) {
            aProcessSteps = [oResult.data];
          } else if (oResult && oResult.data) {
            aProcessSteps = oResult.data.results;
          }

          for (var intI = 0; intI < aProcessSteps.length; intI++) {
            aProcessSteps[
              intI
            ].BusinessObjectUUID = Utility.convertToGuidFormat(
              aProcessSteps[intI].BusinessObjectUUID
            );
          }

          var oModel = this.getThisModel();
          oModel.setProperty("/ProcessStepData", aProcessSteps);
        }
      }
    );
  }
);
