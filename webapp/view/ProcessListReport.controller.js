sap.ui.define(
  [
    "com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
    "com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate",
    "com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
  ],
  function(ActionSmartTableController, SmartTableBindingUpdate, Formatter, Sorter, JSONModel) {
    "use strict";

    return ActionSmartTableController.extend(
      "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.ProcessListReport",
      {
      	
    /**
		 * Formatter Attribute.
		 * @public
		 */
        formatter: Formatter,
        /*aFilterParameters: ["ProcessStatus", 
        					"ProcessDate", 
        					"ProcessIDDescription", 
        					"ProcessClusterDescriptionISL",
        					"MarketPartner",
        					"OwnerUUID",
        					"BusinessObjectUUID",
        					"CommonAccessUUID"],*/
        aFilterParameters: [],
        
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
          var oParams = this.getOwnerComponent().getComponentData().startupParameters;
          
          
          var oFilterData = this._getFilterData(oParams); 
          this.getView().byId("idProcessSmartFilterBar").setFilterData(oFilterData);
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
         * @private
         */
        _setFilterDataProperty: function() {
        	var oFilterData = jQuery.extend(true, {}, 
                            this.getView().byId("idProcessSmartFilterBar").getFilterData());
            sap.ui.getCore().getModel("DisplayProcessApp").setProperty("/FilterData", oFilterData);
        },
        
        /**
         * Method to fetch filter information that will be applied on Filter Bar
         * @private
         * @param {sap.ui.base.Object} oParams Startup Parameters
         * @returns {sap.ui.base.Object} Filter Data 
         */
        _getFilterData: function(oParams){
        	var oStartupFilterData = this._getStartupParametersBasedFilterData(oParams);
        	var oFilterData = jQuery.extend(true, {}, 
        					sap.ui.getCore().getModel("DisplayProcessApp").getProperty("/FilterData"));
        	
        	
        	return jQuery.extend(true, oFilterData, oStartupFilterData);
        },
        
        /**
         * Method to fetch filter information from startup parameters
         * @private
         * @param {sap.ui.base.Object} oParams Startup Parameters
         * @returns {sap.ui.base.Object} Filter Data 
         */
        _getStartupParametersBasedFilterData: function(oParams){
        	var oStartupFilterData = {};
        	var oParams = this.getOwnerComponent().getComponentData().startupParameters;
        	
        	Object.keys(oParams).forEach(function(sKey){
        		if(this._isFilterPrameterExists(sKey)){
	        		oStartupFilterData[sKey] = {
		        		items: [{
		        				key: oParams[sKey][0]
		        			}]	
		        	};
        		}
        	}.bind(this));
        	
        	return oStartupFilterData;
        },
        
        /**
         * Method to check whether property exist in filter bar
         * @private
         * @param {string} sProperty Property to be checked
         * @returns {boolean} true if property is present filter bar
         */
        _isFilterPrameterExists: function(sProperty){
        	return this._getFilterParameters().indexOf(sProperty) >= 0;
        },
        
        /**
         * Method to get Filter parameter array from Filter Bar
         * @private
         * @returns {array} Filter Bar Parameters
         */
        _getFilterParameters: function(){
        	if(this.aFilterParameters,length === 0){
        		var aFilterItemsObjects = this.getView().byId("idProcessSmartFilterBar").getAllFilterItems();
        		
        		this.aFilterParameters = aFilterItemsObjects.map(function(oFilterItemsObject){
        			return 	oFilterItemsObject.getName();
        		});
        	}
        	
        	return this.aFilterParameters;
        }
      }
    );
  }
);
