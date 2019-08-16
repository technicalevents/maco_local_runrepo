sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "com/sap/cd/maco/mmt/ui/reuse/nav/Navigation"
  ],
  function(JSONModel, Navigation) {
    'use strict';

    sap.ui.controller(
      'com.sap.cd.maco.monitor.ui.app.overviewmessages.ext.ExtController',
      {

        /******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * LifeCycle method Called when MessageListReport controller is instantiated.
		 * @public
		 */
        onInit: function() {
        	// Navigation Object
            this.oNav = new Navigation(this.getOwnerComponent());
        },
        
		/**
		 * LifeCycle Method
		 */
		onAfterRendering: function(oEvent) {
			this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
		},
		
		/**
	     * Determines which function should be called for the custom parameter
	     */
		onCustomParams: function() {
			var oFilterData = this.byId("ovpGlobalFilter").getDataSuiteFormat();
			var mInnerAppData = {
				selectionVariant: oFilterData
			};
			this.oNav.storeInnerAppState(mInnerAppData);
		}
      }
    );
  }
);

