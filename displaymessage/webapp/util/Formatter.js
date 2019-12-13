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
      }
	};
});