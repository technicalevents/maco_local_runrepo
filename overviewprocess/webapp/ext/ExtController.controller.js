sap.ui.define([],
  function() {
    'use strict';

    sap.ui.controller(
      "com.sap.cd.maco.monitor.ui.app.overviewprocesses.ext.ExtController",
      {

        /******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * LifeCycle method Called when MessageListReport controller is instantiated.
		 * @public
		 */
        onInit: function() {
        },
        
		/**
		 * LifeCycle Method
		 */
		onAfterRendering: function(oEvent) {
			this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
		}
      }
    );
  }
);
