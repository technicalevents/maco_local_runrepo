sap.ui.define([],
function() {
  'use strict';

  sap.ui.controller(
    'com.sap.cd.maco.monitor.ui.app.overviewmessages.ext.ExtController',
    {

    /******************************************************************* */
    /* LIFECYCLE METHODS */
    /******************************************************************* */
      
    /**
     * LifeCycle Method
     */
    onAfterRendering: function() {
      this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
      this.getView().byId("sapOvpShareButton").setVisible(false);
    }
  });
});