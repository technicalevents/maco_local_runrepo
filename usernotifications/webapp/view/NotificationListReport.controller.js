sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/model/Sorter",
	"sap/base/strings/formatMessage"
  ], function(ListReportNoDraftController, SmartTableBindingUpdate, SelectionVariant, Sorter, formatMessage) {
    "use strict";
    return ListReportNoDraftController.extend("com.sap.cd.maco.selfservice.ui.app.usernotifications.view.NotificationListReport",
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
			ListReportNoDraftController.prototype.onInit.call(this, {
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
			oUpdate.addSorters([new Sorter("CreationDate", true)]);
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
        },
        
		/**
		 * Event is triggered when FilterBar is initialized. 
		 * This method will set Recently used FilterData in FilterBar
		 * @public
		 */
		onFilterBarInitialized: function() {
			this.mSingles.nav.parseNavigation().done(function(oAppState) {
				if(!jQuery.isEmptyObject(oAppState)) {
					this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
				}
			}.bind(this));
		},
		
		/**
		 * Event is triggered before export of Records 
		 * @param {object} oEvent Table Export event
		 * @public
		 */
		onBeforeExport: function (oEvent) {
			var iCount = oEvent.getParameter("exportSettings").dataSource.count;
			if (iCount > 500) {
				oEvent.getParameter("exportSettings").dataSource.count = 500;
				this.mSingles.message.info({
					msgKey: "EXCEL_DOWNLOAD_INFO_MSG"
				});
			}
		},
		
		/**
		 * Event is triggered before create notification dialog box is opened
		 * @param {object} oParams      Dialog box binding parameters
		 * @public
		 */
		onBeforeActionCreateNotification: function(oParams) {
			oParams.properties = {
				CreationDate: new Date()
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
			var sRoleText = oEvent.getSource().getBindingContext().getObject("Roles").split(",").join(", ");
			if (!this._oRolePopover) {
				this._oRolePopover = sap.ui.xmlfragment(this.createId("RolePopover"),
					"com.sap.cd.maco.selfservice.ui.app.usernotifications.view.RolePopover", this);
				this.getView().addDependent(this._oRolePopover);
			}
			this.byId(sap.ui.core.Fragment.createId("RolePopover", "idRoleText")).setText(sRoleText);
			this._oRolePopover.openBy(oEvent.getSource());
		},
        
        /**
         * Function will store application's current state on change in message list
         * @public
         */
        storeCurrentAppState: function() {
			var oSmartFilterUiState = this.getFilterBar().getUiState();
			var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
			var oCurrentAppState = {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: this.getSmartTable().getCurrentVariantId(),
				valueTexts: oSmartFilterUiState.getValueTexts()
			};
			
			this.mSingles.nav.storeInnerAppState(oCurrentAppState);
        }
    });
});