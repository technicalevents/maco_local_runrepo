sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorListReportController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/model/Sorter",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/valueHelpFormatter"
],function(MonitorListReportController, SmartTableBindingUpdate, Sorter, ValueHelpFormatter) {
    "use strict";
    return MonitorListReportController.extend("com.sap.cd.maco.selfservice.ui.app.maintmsgcontacts.view.ContactListReport",{
    	
        /******************************************************************* */
        /* LIFECYCLE METHODS */
        /******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of ContactListReport Controller
         * @public
         */
        onInit: function() {
			MonitorListReportController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_Mantain_Contact_Info",
				actions: this.getOwnerComponent().mActions,
				routes: {
					parent: null,
					this: "listReport",
					child: "null"
				},
				controls: {
					table: "idContactSmartTable",
					variantManagement: "idContactVariantManagement",
					filterBar: "idContactSmartFilterBar"
				},
				tableAccessControl: {
					createContact: true
				},
				sizeLimit: 1500
			});
        },
        
        /******************************************************************* */
        /* PUBLIC METHODS */
        /******************************************************************* */
        
       /**
	  	* Event is triggered before data loading of smart table
        * @param {object} oEvent Table loading event
	  	* @public
		*/
        onBeforeRebindTable: function(oEvent) {
			var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
			var aSorters = [(new Sorter("OwnMarketPartner", true, function (oContext) {
				var sKey = oContext.getProperty("OwnMarketPartner");
				var sKeyText = oContext.getProperty("OwnMarketPartnerText");
				var sMarketRoleText = ValueHelpFormatter.marketRole(oContext.getProperty("MarketRole"));
				return {
					key: sKey,
					text: this.oBundle.getText("OWN_MKT_PARTNER_LBL", [sKeyText, sMarketRoleText, sKey])
				};
			}.bind(this)))];
			
			oUpdate.addSorters(aSorters);
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
        }
    });
});