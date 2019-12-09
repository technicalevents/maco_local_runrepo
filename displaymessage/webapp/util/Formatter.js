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
     * Formatter method returns formatted message text
     * @param   {string} 	sExternalPayload	 External Payload (Message Text)
     * @public
     * @returns {string} 	    	             Formatted External Payload (Formatted Message Text)
     */
      externalPayload: function(sExternalPayload) {
        var sFormattedExternalPayload = "";
        
        if (sExternalPayload) {
          sFormattedExternalPayload = sExternalPayload.replace(new RegExp("'", 'g'), "' \n");
        }
        
        return sFormattedExternalPayload;
      },
      
    /**
     * Formatter method returns name of Start Partner(Sender)
     * @param   {string} 	sDir	 Direction('s' for sender and 'r' for receiver)
     * @param   {string} 	sFrom  Sender
     * @param   {string} 	sTo	   Receiver
     * @public
     * @returns {string} 	    	 Start Partner
     */		
      partnerStart: function(sDir, sFrom, sTo) {
        if (sDir === Constants.FLOW_TYPE.OUTBOUND) {
          return sFrom;
        } else {
          return sTo;
        }
      },

    /**
     * Formatter method returns name of End Partner(Receiver)
     * @param   {string} 	sDir	 Direction('s' for sender and 'r' for receiver)
     * @param   {string} 	sFrom  Sender
     * @param   {string} 	sTo	   Receiver
     * @public
     * @returns {string} 	    	 End Partner
     */
      partnerEnd: function(sDir, sFrom, sTo) {
        if (sDir === Constants.FLOW_TYPE.OUTBOUND) {
          return sTo;
        } else {
          return sFrom;
        }
      },

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
			 * Formatter method to handle label and visibility for multiple document
			 * @param   {object} aLinkedDocument            Array of linked document
			 * @param   {string} sTecBusinessObjectType     Technical Business Object Type
			 * @public
			 * @returns {integer}                            Document Count
			 */
      multipleDocumentLabelnNumber: function(aLinkedDocument, sTecBusinessObjectType) {
        var iProcessDocument = 0;
        var iControlDocument = 0;
        var iAperakDocument = 0;
        var iMultipleDocumentNumber = 0;
        
        if(aLinkedDocument) {
          for(var intI = 0; intI < aLinkedDocument.length; intI++) {
            switch (aLinkedDocument[intI].TecBusinessObjectType) {
              case Constants.BO_OBJECT_TYPE.CONTRL_MSG:
                iControlDocument++;          
                break;
                  
              case Constants.BO_OBJECT_TYPE.APERAK_MSG:
                iAperakDocument++;   
                break;
                  
              case Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT:
                iProcessDocument++;  
                break;	
                  
              default:
                break;
            }
          }
        }
        
        switch (sTecBusinessObjectType) {
          case Constants.BO_OBJECT_TYPE.CONTRL_MSG:
            iMultipleDocumentNumber = iControlDocument;
            break;
              
          case Constants.BO_OBJECT_TYPE.APERAK_MSG:
            iMultipleDocumentNumber = iAperakDocument;   
            break;
              
          case Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT:
            iMultipleDocumentNumber = iProcessDocument; 
            break;	
              
          default:
            break;
        }
        
        return iMultipleDocumentNumber;
      }
	};
});