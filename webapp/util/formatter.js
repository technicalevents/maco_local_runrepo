sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/formatter/criticality",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
  "sap/m/LabelDesign",
  "sap/base/strings/formatMessage"
], function(Criticality, Constants, LabelDesign, formatMessage) {
  "use strict";
  return {

    // formatter for Status criticality
    criticality: Criticality,
    formatMessage: formatMessage,
  
    /**
     * Formatter function for getting Icon for process steps
     * @param {string} sBusinessObjectType Business Object type
     * @return {string} icon name for given Business Object type
     */
    processStepIcon: function(sBusinessObjectType) {
      var sIcon;

      if(sBusinessObjectType === "PDoc"){
        sIcon = "sap-icon://cloud";
      } else if (sBusinessObjectType === "ExceptionDoc"){
        sIcon = "sap-icon://employee";
      } else if (sBusinessObjectType === "TransDoc"){
        sIcon = "sap-icon://paper-plane";
      }

      if (!sIcon) {
        sIcon = "sap-icon://sys-help";
      }
      return sIcon;
    }    
  };
});