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
     * @public
     * @return {string} icon name for given Business Object type
     */
    processStepIcon: function(sBusinessObjectType, sDirection) {
      var sIcon;

      if(sBusinessObjectType === Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT) {
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
    }  
  };
});