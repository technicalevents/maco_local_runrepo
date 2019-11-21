sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(ObjectPageController, bundle, Assert) {
    'use strict';

    return ObjectPageController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageDraftController', {
      onInit: function(oConfig) {
        // super
        ObjectPageController.prototype.onInit.apply(this, arguments);

        // check route
        var oRoute = this.oRouter.getRoute(this.oConfig.routes.this);
        var sPattern = oRoute.getPattern();
        Assert.ok(
          sPattern.indexOf('{IsActiveEntity}') !== -1,
          'cannot init ObjectPageDraftController. The route ' + this.oConfig.routes.this + ' must contain a parameter IsActiveEntity'
        );
        Assert.ok(
          sPattern.indexOf('{HasActiveEntity}') !== -1,
          'cannot init ObjectPageDraftController. The route ' + this.oConfig.routes.this + ' must contain a parameter HasActiveEntity'
        );
      },

      //~~~~ must implement ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _onBeforeBind: function() {
        var oThisModel = this.getThisModel();
        var bActive = 'true' === this.oRouteArgs.IsActiveEntity;
        var bDraft = 'true' !== this.oRouteArgs.IsActiveEntity;
        var bEditDraft = bDraft && 'true' === this.oRouteArgs.HasActiveEntity;
        var bCreateDraft = bDraft && 'true' !== this.oRouteArgs.HasActiveEntity;
        oThisModel.setProperty('/IsActiveEntity', bActive);
        oThisModel.setProperty('/IsDraftEntity', bDraft);
        oThisModel.setProperty('/IsEditDraftEntity', bEditDraft);
        oThisModel.setProperty('/IsCreateDraftEntity', bCreateDraft);
      },

      _getBindingPath: function() {
        return this.getBindingPath();
      },

      _getBindingParameters: function() {
        var aDraftExpands = ['DraftAdministrativeData'];
        var aDraftSelects = ['ActiveUUID', 'IsActiveEntity', 'HasDraftEntity', 'HasActiveEntity', 'DraftAdministrativeData'];
        var aExpands = this.getBindingExpands();
        var aSelects = this.getBindingSelects();
        Assert.array(aExpands, 'cannot bind ObjectPage. getBindingExpands must return an array');
        Assert.array(aSelects, 'cannot bind ObjectPage. getBindingSelects must return an array');
        var sExpand = this._mergeParams(aExpands, aDraftExpands);
        var sSelect = this._mergeParams(aSelects, aDraftSelects);
        return {
          expand: sExpand,
          select: sSelect
        };
      },

      _mergeParams: function(aAppParams, aMyParams) {
        for (var i = 0; i < aMyParams.length; i++) {
          var sParam = aMyParams[i] + '';
          if (aAppParams.indexOf(sParam) === -1) {
            aAppParams.push(sParam);
          }
        }
        return aAppParams.toString();
      }
    });
  }
);
