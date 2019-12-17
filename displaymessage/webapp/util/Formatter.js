sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
  "com/sap/cd/maco/mmt/ui/reuse/formatter/criticality",
  "sap/base/strings/formatMessage"
], function (Constants, criticality, formatMessage) {
	"use strict";
	return {

    criticality: criticality,
		formatMessage: formatMessage,
    /******************************************************************* */
    /* PUBLIC METHODS */
    /******************************************************************* */

    /**
     * Formatter method returns icon between Start Partner(Sender) and End Partner(Receiver)
     * @param   {string} 	sDir	 Direction('s' for sender and 'r' for receiver)
     * @public
     * @returns {string} 	    	 SAP Icon
     */
      partnerIcon: function(sDir) {
        if (sDir === Constants.FLOW_TYPE.OUTBOUND) {
          return 'sap-icon://arrow-right';
        } else {
          return 'sap-icon://arrow-left';
        }
      },
      
    /**
     * Formatter method returns formatted Technical Id and External Business Message Id
     * @param   {string} 	sTechnicalId	     Technical Id
     * @param   {string} 	sExBusinessMsgId	 External Business Message Id
     * @public
     * @returns {object} 	    	             I18nFormat and I18nData
     */
      formatTechnicalBusinessMsgId: function(sTechnicalId, sExBusinessMsgId) {
          var oI18nText = {
          	i18nFormat: "FORMAT_TXT_LBL",
          	i18nData: [sTechnicalId]
          };
          
          if(sExBusinessMsgId && sExBusinessMsgId !== "null" && sExBusinessMsgId !== "") {
            oI18nText.i18nFormat = "FORMAT_AMID_TXT_LBL";
            oI18nText.i18nData.push(sExBusinessMsgId);
          }
          
          return oI18nText;
      }
	};
});