sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/formatter/criticality",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
  "sap/base/strings/formatMessage"
], function(Criticality, Constants, formatMessage) {
  "use strict";
  return {

    // formatter for Status criticality
    criticality: Criticality,
    formatMessage: formatMessage,
  
    /**
     * Formatter function for getting Icon for process steps
     * @param {string} sBusinessObjectType  Business Object type
     * @param {string} sDirection           Direction
     * @param {string} sStepID              Process Step Id
     * @public
     * @return {string} icon name for given Business Object type
     */
    processStepIcon: function(sBusinessObjectType, sDirection, sStepID) {
      var sIcon;
      
      if(sStepID === Constants.PROCESS_LIST_HEADER_ACTION.CLOSE_LATEST_DEADLINE) {
      	sIcon = "sap-icon://date-time";
      } else if(sBusinessObjectType === Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT) {
        sIcon = "sap-icon://cloud";
      } else if (sBusinessObjectType === Constants.BO_OBJECT_TYPE.EXCEPTION_DOCUMENT) {
        sIcon = "sap-icon://user-edit";
      } else if (sBusinessObjectType === Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT && 
        sDirection === Constants.FLOW_TYPE.OUTBOUND) {
        sIcon = "sap-icon://close-command-field";
      } else if (sBusinessObjectType === Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT && 
        sDirection === Constants.FLOW_TYPE.INBOUND) {
        sIcon = "sap-icon://open-command-field";
      }

      if (!sIcon) {
        sIcon = "sap-icon://sys-help";
      }
      return sIcon;
    },
    
    /**
     * Formatter function for getting status for process steps
     * @param   {string} 	sBusinessObjectType	 Business Object Type
     * @param   {string} 	sUserDecision		     User Decision text
     * @param   {string} 	sTransDocStatus  	   Transfer Document Status
     * @public
     * @returns {string} 	    	               Formatted Status
     */
    formatProcessStepStatus: function(sBusinessObjectType, sUserDecision, sTransDocStatus) {
      var sStatus = "";
      
      if (sBusinessObjectType === Constants.BO_OBJECT_TYPE.EXCEPTION_DOCUMENT) {
        sStatus = sUserDecision;
      } else if (sBusinessObjectType === Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT) {
        sStatus = sTransDocStatus;
      }
      
      return sStatus;
    }  
  };
});