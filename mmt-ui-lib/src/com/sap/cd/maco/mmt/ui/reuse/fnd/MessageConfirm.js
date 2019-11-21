/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/FragmentController', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(
  FragmentController,
  Assert
) {
  'use strict';

  return FragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.MessageConfirm', {
    constructor: function(params) {
      FragmentController.call(this, {
        id: 'confirm',
        fragmentName: 'com.sap.cd.maco.mmt.ui.reuse.fnd.MessageConfirm',
        component: params.component,
        view: params.view
      });
    },

    open: function(params) {
      // check params
      Assert.ok(params, 'Failed to open confirm popover. params missing');
      Assert.ok(params.byControl, 'Failed to open confirm popover. byControl missing');
      Assert.ok(params.messageText, 'Failed to open confirm popover. messageText missing');
      Assert.ok(params.buttonText, 'Failed to open confirm popover. buttonText missing');

      this.byId('label').setText(params.messageText);
      this.byId('button').setText(params.buttonText);

      this.getFragment().openBy(params.byControl);

      this._bConfirmed = false;

      return new Promise(
        function(resolve, reject) {
          this._fnResolve = resolve;
          this._fnReject = reject;
        }.bind(this)
      );
    },

    _onConfirm: function() {
      this._bConfirmed = true;
      this.getFragment().close();
    },

    _onAfterClose: function() {
      if (this._bConfirmed) {
        this._fnResolve();
      } else {
        this._fnReject();
      }
    }
  });
});
