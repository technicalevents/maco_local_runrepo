sap.ui.define(['sap/ui/core/UIComponent', 'jquery.sap.global', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(UIComponent, jQuery, Assert) {
  'use strict';

  return UIComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.BaseComponent', {
    mActions: undefined,
    mSingles: undefined,

    init: function() {
      UIComponent.prototype.init.apply(this, arguments);
      this.mActions = {};
      this.mSingles = {};
    },

    exit: function() {
      this._destroyActions();
      this._destroySingles();
    },

    addSingle: function(sName, oSingle) {
      Assert.ok(!this.mSingles[sName], 'cannot add single ' + sName + '. the single has already been added');
      this.mSingles[sName] = oSingle;
    },

    _destroyActions: function() {
      for (var sAction in this.mActions) {
        var oAction = this.mActions[sAction];
        if (oAction && oAction.destroy) {
          try {
            oAction.destroy();
          } catch (e) {
            jQuery.sap.log.error('failed to destroy action ' + sAction + '. ' + e);
          }
        }
      }
    },

    _destroySingles: function() {
      for (var sSingle in this.mSingles) {
        var oSingle = this.mSingles[sSingle];
        if (oSingle && oSingle.destroy) {
          try {
            oSingle.destroy();
          } catch (e) {
            jQuery.sap.log.error('failed to destroy single ' + sSingle + '. ' + e);
          }
        }
      }
    }
  });
});
