sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/controller/base/BaseFragmentController', 'sap/ui/model/json/JSONModel', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'],
  function(BaseFragmentController, JSONModel, bundle) {
    'use strict';

    return BaseFragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.DraftStatus', {
      constructor: function(oComponent) {
        BaseFragmentController.call(this, {
          id: 'draftStatusPopover',
          fragmentName: 'com.sap.cd.maco.mmt.ui.reuse.action.draft.DraftStatusPopover',
          component: oComponent
        });
      },

      onInit: function() {
        BaseFragmentController.prototype.onInit.apply(this, arguments);

        var oFragmentModel = new JSONModel({
          title: '',
          text1: '',
          text2: '',
          date2: ''
        });
        this.getFragment().setModel(oFragmentModel, 'draftPopover');
      },

      close: function() {
        this.getFragment().close();
      },

      open: function(oByControl, oContext) {
        var sPath = oContext.getPath() + '/DraftAdministrativeData';
        var oObject = oContext.getObject();
        var oAdmin = this.oModel.getProperty(sPath);

        // set model
        var oModel = this.getFragment().getModel('draftPopover');
        if (oObject.HasDraftEntity && !oAdmin.InProcessByUser) {
          // unsaved by other user
          oModel.setProperty('/title', bundle.getText('draftPopoverUnsavedChanges'));
          oModel.setProperty('/text1', bundle.getText('draftPopoverUnsavedTitle', oAdmin.LastChangedByUser));
          oModel.setProperty('/text2', bundle.getText('draftPopoverLastChanges'));
          oModel.setProperty('/date2', oAdmin.LastChangeDateTime);
        } else if (oObject.HasDraftEntity && oAdmin.InProcessByUser) {
          // locked by other user
          oModel.setProperty('/title', bundle.getText('draftPopoverLocked'));
          oModel.setProperty('/text1', bundle.getText('draftPopoverLockTitle', oAdmin.LastChangedByUser));
          oModel.setProperty('/text2', bundle.getText('draftPopoverLastChanges'));
          oModel.setProperty('/date2', oAdmin.LastChangeDateTime);
        } else if (!oObject.IsActiveEntit) {
          // draft by user
          oModel.setProperty('/title', bundle.getText('draftPopoverDraft'));
          oModel.setProperty('/text1', '');
          oModel.setProperty('/text2', bundle.getText('draftPopoverLastChanges'));
          oModel.setProperty('/date2', oAdmin.LastChangeDateTime);
        } else {
          throw Error('unhandled state');
        }

        // open
        this.getFragment().openBy(oByControl);
      }
    });
  }
);
