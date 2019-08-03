sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/objectPage/ObjectPageController',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/message/CallWithMessageHandling'
  ],
  function(ObjectPageController, bundle, CallWithMessageHandling) {
    'use strict';

    return ObjectPageController.extend('com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageNoDraftController', {
      onInit: function(config) {
        // super
        ObjectPageController.prototype.onInit.apply(this, arguments);

        // initial mode
        this.setMode('Display');

        // init current route
        this._sCurrentRoute = null;

        // register for any route event
        this.oRouter.attachRouteMatched(this._anyRouteMatched.bind(this));
      },

      /**
       * Resets model changes when navigating away from this object page
       */
      _anyRouteMatched: function(oEvent) {
        var sMyRoute = this.oConfig.routes.this;
        var sNewRoute = oEvent.getParameter('name');
        var bLeavingThisObjectPage = this._sCurrentRoute === sMyRoute && sNewRoute !== sMyRoute;
        var bModelChanged = this.oModel.hasPendingChanges();
        var oRouteArgs = oEvent.getParameters().arguments;
        var bCreate = this._isCreate(oRouteArgs);
        if (bLeavingThisObjectPage && !bCreate && bModelChanged) {
          this.oModel.resetChanges();
          this.oMessage.warning({
            msg: bundle.get().getText('objectPageResetChangesByNav')
          });
        }
        this._sCurrentRoute = sNewRoute;
      },

      setMode: function(sMode) {
        // check mode
        this.oAssert.ok(sMode === 'Create' || sMode === 'Update' || sMode === 'Display', 'cannot set mode. the mode ' + sMode + ' is not supported');

        // keep member
        this._sMode = sMode;

        // update this model
        var oThisModel = this.getThisModel();
        oThisModel.setProperty('/IsCreate', sMode === 'Create');
        oThisModel.setProperty('/IsUpdate', sMode === 'Update');
        oThisModel.setProperty('/IsCreateOrUpdate', sMode === 'Create' || sMode === 'Update');
        oThisModel.setProperty('/IsDisplay', sMode === 'Display');
      },

      getMode: function() {
        return this._sMode;
      },

      //~~~~ must implement of object page ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _onBeforeBind: function() {
        var bCreate = this._isCreate(this.oRouteArgs);
        if (bCreate) {
          // set mode
          this.setMode('Create');

          // reset message handling
          // for update done in UpdateAction but for create it has to be done here
          var oCallWith = new CallWithMessageHandling(this);
          oCallWith.reset();
        } else {
          // set mode
          this.setMode('Display');
        }
      },

      _getBindingParameters: function() {
        var bCreate = this._isCreate(this.oRouteArgs);
        if (bCreate) {
          return {};
        } else {
          var aExpands = this.getBindingExpands();
          var aSelects = this.getBindingSelects();
          this.oAssert.array(aExpands, 'ObjectPageController cannot bind. getBindingExpands must return an array');
          this.oAssert.array(aSelects, 'ObjectPageController cannot bind. getBindingSelects must return an array');
          var sExpand = aExpands.toString();
          var sSelect = aSelects.toString();
          return {
            expand: sExpand,
            select: sSelect
          };
        }
      },

      _getBindingPath: function() {
        var sCreateId = this._getCreateId(this.oRouteArgs);
        if (sCreateId) {
          return '/' + this.oConfig.entitySet + "('" + sCreateId + "')";
        } else {
          return this.getBindingPath();
        }
      },

      //~~~~ can implement of object page ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _getNotFoundText: function() {
        // set mode
        var bCreate = this._isCreate(this.oRouteArgs);
        if (bCreate) {
          return bundle.get().getText('objectPageNotFoundCreate');
        } else {
          return this._getConfigText('notFoundMsg', 'objectPageNotFound', this.oRouteArgs);
        }
      },

      //~~~~ rest ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _isCreate: function(oRouteArgs) {
        return !!this._getCreateId(oRouteArgs);
      },

      _getCreateId: function(oRouteArgs) {
        var sCreateId = null;
        for (var sProp in oRouteArgs) {
          var sValue = oRouteArgs[sProp];
          if (sValue.startsWith('~~~')) {
            sCreateId = sValue.substring(3, sValue.length);
            break;
          }
        }
        return sCreateId;
      }
    });
  }
);
