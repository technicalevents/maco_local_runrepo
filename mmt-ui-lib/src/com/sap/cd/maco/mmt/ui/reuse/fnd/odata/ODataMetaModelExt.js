sap.ui.define(['sap/ui/base/EventProvider', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(EventProvider, Assert) {
  'use strict';

  return EventProvider.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.odata.ODataMetaModelExt', {
    constructor: function(oComponent) {
      this._oModel = oComponent.getModel();
      Assert.ok(this._oModel, 'cannot instantiate ODataMetaModelExt. model is not set');
    },

    _getMetaModel: function() {
      var oMeta = this._oModel.getMetaModel();
      Assert.ok(oMeta, 'failed to read metadata. meta model is not available yet. use promises');
      return oMeta;
    },

    getProperties: function(sEntitySet) {
      var oMeta = this._getMetaModel();
      var oEntitySet = oMeta.getODataEntitySet(sEntitySet);
      Assert.ok(oEntitySet, 'failed to read metadata. entity set ' + sEntitySet + 'not found');
      var oEntityType = oMeta.getODataEntityType(oEntitySet.entityType);
      Assert.ok(oEntityType, 'failed to read metadata. no entity type for entity set ' + sEntitySet);
      Assert.ok(oEntityType.property, 'failed to read metadata. no properites for entity set ' + sEntitySet);
      return oEntityType.property;
    },

    getKeyArray: function(sEntitySet) {
      var oMeta = this._getMetaModel();
      var oEntitySet = oMeta.getODataEntitySet(sEntitySet);
      Assert.ok(oEntitySet, 'failed to read metadata. entity set ' + sEntitySet + 'not found');
      var oEntityType = oMeta.getODataEntityType(oEntitySet.entityType);
      Assert.ok(oEntityType, 'failed to read metadata. no entity type for entity set ' + sEntitySet);
      Assert.ok(oEntityType.key, 'failed to read metadata. no key for entity set ' + sEntitySet);
      Assert.ok(oEntityType.key.propertyRef, 'failed to read metadata. no key for entity set ' + sEntitySet);
      var aKeys = [];
      for (var i = 0; i < oEntityType.key.propertyRef.length; i++) {
        var oKey = oEntityType.key.propertyRef[i];
        aKeys.push(oKey.name);
      }
      return aKeys;
    },

    getGuid: function(sEntitySet) {
      var oMeta = this._getMetaModel();
      var oEntitySet = oMeta.getODataEntitySet(sEntitySet);
      Assert.ok(oEntitySet, 'failed to read metadata. entity set ' + sEntitySet + 'not found');
      var oEntityType = oMeta.getODataEntityType(oEntitySet.entityType);
      Assert.ok(oEntityType, 'failed to read metadata. no entity type for entity set ' + sEntitySet);
      Assert.ok(oEntityType.key, 'failed to read metadata. no key for entity set ' + sEntitySet);
      Assert.ok(oEntityType.key.propertyRef, 'failed to read metadata. no key for entity set ' + sEntitySet);
      Assert.ok(oEntityType.property, 'failed to read metadata. no property for entity set ' + sEntitySet);
      var aKeys = [];
      for (var i = 0; i < oEntityType.key.propertyRef.length; i++) {
        var oKey = oEntityType.key.propertyRef[i];
        var oProperty = this._getProperty(sEntitySet, oEntityType, oKey.name);
        if (oProperty.type === 'Edm.Guid') {
          return oKey.name;
        }
      }
      Assert.ok(false, 'cannot determine guid for entityset ' + sEntitySet);
    },

    _getProperty: function(sEntitySet, oEntityType, sName) {
      for (var i = 0; i < oEntityType.property.length; i++) {
        var oProperty = oEntityType.property[i];
        if (oProperty.name === sName) {
          return oProperty;
        }
      }
      Assert.ok(false, 'cannot find property for ' + sName + ' in entity set ' + sEntitySet);
    }
  });
});
