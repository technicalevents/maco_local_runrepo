sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, Formatter, Sorter, JSONModel, Hasher) {
    "use strict";

    return ActionSmartTableController.extend(
      "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.ProcessListReport",
      {
      	
    /**
		 * Formatter Attribute.
		 * @public
		 */
        formatter: Formatter,
        
    /******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of ProcessListReport Controller
         */
        onInit: function() {
          ActionSmartTableController.prototype.onInit.call(this, {
            entitySet: "xMP4GxC_ProcessHeader_UI",
            actions: {},
            controls: {
              table: "idProcessSmartTable"
            }
          });

          if(!sap.ui.getCore().getModel("DisplayProcessApp")) {
            // Create a JSON Model
            var oDisplayProcessAppModel = new JSONModel({
                FilterData: {}
            });
            oDisplayProcessAppModel.setDefaultBindingMode("OneWay");
            sap.ui.getCore().setModel(oDisplayProcessAppModel, "DisplayProcessApp");
          }
        },
        
        /******************************************************************* */
        /* PUBLIC METHODS */
        /******************************************************************* */

        /**
         * Event Handler - Triggered on selecting a to see more details
         * @param {sap.ui.base.Event} oEvent Row selection event object
         */
        onProcessRowSelect: function(oEvent) {
          this._setFilterDataProperty();

          var oObject = oEvent
            .getSource()
            .getBindingContext()
            .getObject();
          this.oRouter.navTo("processPage", {
            ProcessDocumentKey: oObject.ProcessDocumentKey,
            ProcessID:	oObject.ProcessID
          });
        },
        
       /**
	  	  * Event is triggered before data loading of smart table
        * @param {object} oEvent Table loading event
	  	  * @public
		    */
        onBeforeRebindTable: function(oEvent) {
          var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
          var aSorters = [];
          aSorters.push(new Sorter("ProcessTimestamp", true));
          aSorters.push(new Sorter("ProcessDocumentKey", true));
          oUpdate.addSorters(aSorters);
        },
        
        /**
	       * Event is triggered when FilterBar is initialized. 
	       * This method will set Recently used FilterData in FilterBar
	       * @public
	       */
        onFilterBarInitialized: function() {
          var oFilterData = jQuery.extend(true, {}, 
            sap.ui.getCore().getModel("DisplayProcessApp").getProperty("/FilterData"));
          var oSmartFilterBar = this.getView().byId("idProcessSmartFilterBar");
          var oSmartTable = this.getView().byId("idProcessSmartTable");
          
          oSmartFilterBar.setFilterData(oFilterData);

          this.oNav.parseNavigation().done(function(oAppState) {
            if(!jQuery.isEmptyObject(oAppState)) {
              oSmartFilterBar.setDataSuiteFormat(oAppState.selectionVariant, true);
              oSmartTable.rebindTable(true);
            }
          }.bind(this));
        },
        
       /**
		* Event is triggered when FilterBar is initialized.
		* This method will set Recently used FilterData in FilterBar
    	* @public
    	*/
        getSaveTileCustomUrl: function () {  //Set the URL that the tile should point to
            var sHash = Hasher.getHash();
            return sHash ? ("#" + sHash) : window.location.href;
         },

        /**
         * Event is triggered when SmartTable refresh button is pressed 
         * This method will refresh SmartTable DAa
         * @public
         */
        onRefresh: function() {
          this.getView().byId("idProcessSmartTable").rebindTable(true);
        },
        
        /******************************************************************* */
        /* PRIVATE METHODS */
        /******************************************************************* */
        
        /**
         * Method will retrieve filter data from filterbar and set in JSON Model
         * @public
         */
        _setFilterDataProperty: function() {
        	var oFilterData = jQuery.extend(true, {}, 
                            this.getView().byId("idProcessSmartFilterBar").getFilterData());
            sap.ui.getCore().getModel("DisplayProcessApp").setProperty("/FilterData", oFilterData);
        }
      }
    );
  }
);
