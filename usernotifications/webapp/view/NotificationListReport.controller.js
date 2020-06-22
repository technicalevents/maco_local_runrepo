sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorListReportController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/model/Sorter",
	"sap/base/strings/formatMessage",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(MonitorListReportController, SmartTableBindingUpdate, Sorter, formatMessage, Filter, FilterOperator) {
    "use strict";
    return MonitorListReportController.extend("com.sap.cd.maco.selfservice.ui.app.usernotifications.view.NotificationListReport",
      {
      	
      /**
       * Formatter Attribute.
       * @public
       */
        formatter: formatMessage,
        
        /******************************************************************* */
        /* LIFECYCLE METHODS */
        /******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of NotificationListReport Controller
         * @public
         */
        onInit: function() {
        	MonitorListReportController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_ManageNotification",
				actions: this.getOwnerComponent().mActions,
				routes: {
					parent: null,
					this: "listReport",
					child: null
				},
				controls: {
					table: "idNotificationSmartTable",
					variantManagement: "idNotificationVariantManagement",
					filterBar: "idNotificationSmartFilterBar"
				},
				tableAccessControl: {
					createNotification: true
				}
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
			var sRole = this.getFilterBar().getFilterData().Roles;
			oUpdate.addSorters([new Sorter("CreationDate", true)]);
			
			if(sRole) {
				oUpdate.updateFilter(new Filter("Roles", FilterOperator.Contains, sRole));
			}
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
        },
		
		/**
		 * Event is triggered before create notification dialog box is opened
		 * @param {object} oParams      Dialog box binding parameters
		 * @public
		 */
		onBeforeActionCreateNotification: function(oParams) {
			oParams.properties = {
				Priority: "LOW"
			};
		},
		
		/**
		 * Formatter method to format Role count from Role string
		 * @param {string} sRoles     Roles string
		 * @public
		 * @returns                   Roles count
		 */
		formatRoleCount: function(sRoles) {
			var aRoles = sRoles.split(",");
			if(!jQuery.isEmptyObject(sRoles) && aRoles.length > 0) {
				var sI18nText = (aRoles.length > 1) ? "ROLE_LINK_PLURAL_LBL" : "ROLE_LINK_SINGLE_LBL";
				return this.oBundle.getText(sI18nText, [aRoles.length]);
			}
			return sRoles;
		},
		
		/**
		 * Formatter method to format visiblity of Role text or Role link
		 * @param {string} sRoles     Roles string
		 * @public
		 * @returns                   Visiblity of Role text or Role link
		 */
		formatRoleLinkVisible: function(sRoles) {
			return sRoles.split(",").length > 0 ? true : false;
		},
		
		/**
		 * Event is triggered on press of Role link
		 * @param {object} oEvent      Link press event
		 * @public
		 */
		onRoleLinkPress: function(oEvent) {
			var aPopoverRoles = oEvent.getSource().getBindingContext().getObject("Roles").split(",");
			if (!this._oRolePopover) {
				this._oRolePopover = sap.ui.xmlfragment(this.createId("RolePopover"),
					"com.sap.cd.maco.selfservice.ui.app.usernotifications.view.RolePopover", this);
				this.getView().addDependent(this._oRolePopover);
			}
			this.getViewModel().setProperty("/PopoverRoles", aPopoverRoles);
			this._oRolePopover.openBy(oEvent.getSource());
		}
    });
});