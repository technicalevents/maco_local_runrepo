sap.ui.define(
  [
    'sap/ui/model/FilterOperator',
    'com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate'
  ],
  function(FilterOperator, SmartTableController, SmartTableBindingUpdate) {
    'use strict';

    return SmartTableController.extend(
      'com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.CertificatesTable',
      {
        onInit: function() {
          SmartTableController.prototype.onInit.call(this, {
            controls: {
              table: 'smartTable'
            },
            entitySet: 'Certificates',
            actions: {
              create: this.getOwnerComponent().actions.certificate.create,
              delete: this.getOwnerComponent().actions.certificate.delete
            },
            tableAccessControl: {
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
            ObjectId: this.oRouteArgs.ObjectId,
            //CertificateName: certificateName,
            ValidFrom: new Date(),
            ValidTo: new Date(Date.UTC(9999, 11, 31))
          };
          /* var certificateName = this._oRouteArgs.ObjectId +
             validFrom.getFullYear() +
             validFrom.getMonth() +
             validFrom.getDay()
         */
        },

        onBeforeRebindTable: function(oEvent) {
          var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
          if (!this.oRouteArgs) {
            oUpdate.prevent();
          } else {
            oUpdate.addFilter('ObjectId', FilterOperator.EQ, this.oRouteArgs.ObjectId);
            oUpdate.endFilterAnd();
          }
        },

        beforeExport: function(oEvent) {
          var oSettings = oEvent.getParameter('exportSettings');
          oSettings.dataSource.sizeLimit = 10000;
        }
      }
    );
  }
);
