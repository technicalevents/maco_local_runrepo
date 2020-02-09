sap.ui.define(
  [
    'sap/ui/model/FilterOperator',
    'com/sap/cd/maco/mmt/ui/reuse/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate'
  ],
  function(FilterOperator, SmartTableController, SmartTableBindingUpdate) {
    'use strict';

    return SmartTableController.extend(
      'com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.AS2Table',
      {
        onInit: function() {
          SmartTableController.prototype.onInit.call(this, {
            controls: {
              table: 'smartTable'
            },
            entitySet: 'ExtPartnerAS2Adapter',
            actions: this.getOwnerComponent().actions.as2,
            tableAccessControl: {
              update: true,
              delete: true
            }
          });
        },

        onBeforeBindObjectPage: function(oRouteArgs) {
          this.oRouteArgs = oRouteArgs;
          this.rebindTable();
        },

        onBeforeActionCreate: function(oParams, oEvent) {
          oParams.properties = {
            Pid: this.oRouteArgs.Pid,
            ValidFrom: new Date(),
            ValidTo: new Date(9999, 11, 32)
          };
        },

        onBeforeRebindTable: function(oEvent) {
          var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
          if (!this.oRouteArgs) {
            oUpdate.prevent();
          } else {
            oUpdate.addFilter('Pid', FilterOperator.EQ, this.oRouteArgs.Pid);
            oUpdate.endFilterAnd();
          }
        }
      }
    );
  }
);
