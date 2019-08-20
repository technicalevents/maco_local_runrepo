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
     * LifeCycle Method
     */
    onAfterRendering: function() {
      this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
    }

  });
});
