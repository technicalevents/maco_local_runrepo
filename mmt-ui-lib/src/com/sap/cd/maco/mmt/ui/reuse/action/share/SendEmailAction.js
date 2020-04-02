/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, UI5Metadata, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.share.SendEmailAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // get target text
            var sTargetText;
            if (UI5Metadata.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.listReport.ListReportController')) {
              sTargetText = this.getConfigText('appTitleMsgKey', '?');
            } else if (UI5Metadata.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageController')) {
              // check
              this.assertContextParam(oParams);
              var oObject = oParams.contexts[0].getObject();
              Assert.ok(
                oObject.hasOwnProperty(this.oConfig.objectTextProperty),
                'cannot save as tile. the object has no text property: ' + this.oConfig.objectTextProperty
              );
              Assert.ok(
                oObject.hasOwnProperty(this.oConfig.objectIdProperty),
                'cannot save as tile. the object has no id property: ' + this.oConfig.objectIdProperty
              );

              sTargetText = oObject[this.oConfig.objectTextProperty] + ' - ' + oObject[this.oConfig.objectIdProperty];
            } else {
              Assert.ok(false, 'unhandled controller class (must be list report or object page): ' + oParams.controller);
              reject();
            }

            // open email
            var sSubject = bundle.getText('shareSendEmailSubject', [sTargetText]);
            var sBody = window.location.href;
            sap.m.URLHelper.triggerEmail(null, sSubject, sBody, null, null);
          }.bind(this)
        );
      }
    });
  }
);
