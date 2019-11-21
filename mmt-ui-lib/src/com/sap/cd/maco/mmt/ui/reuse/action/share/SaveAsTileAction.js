/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'sap/ushell/ui/footerbar/AddBookmarkButton',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],

  function(BaseAction, bundle, UI5Metadata, AddBookmarkButton, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.share.SaveAsTileAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // get bookmark
            var oBookmark;
            if (UI5Metadata.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.listReport.ListReportController')) {
              oBookmark = this._getBookmarkListReport(oParams);
            } else if (UI5Metadata.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageController')) {
              oBookmark = this._getBookmarkObjectPage(oParams);
            } else {
              Assert.ok(false, 'unhandled controller class (must be list report or object page): ' + oParams.controller);
              reject();
            }

            // call bookmark "service"
            // (tried called the real service in the first place but this does not bring up the dialog)
            var oButton = new AddBookmarkButton(oBookmark);
            oButton.firePress();
          }.bind(this)
        );
      },

      _getBookmarkListReport: function(oParams) {
        return {
          url: document.location.hash,
          title: this.getConfigText('appTitleMsgKey', '?'),
          serviceUrl: this._getServiceUrl(oParams)
        };
      },

      _getBookmarkObjectPage: function(oParams) {
        // check
        this.assertContextParam(oParams);
        var oObject = oParams.contexts[0].getObject();
        Assert.ok(
          oObject.hasOwnProperty(this.oConfig.objectTextProperty),
          'cannot save as tile. the object has no text property: ' + this.oConfig.objectTextProperty
        );

        var oResult = {
          url: document.location.hash,
          title: oObject[this.oConfig.objectTextProperty]
        };

        if (this.oConfig.objectIdProperty) {
          oResult.subtitle = oObject[this.oConfig.objectIdProperty];
        }

        return oResult;
      },

      /**
       * the way this logic works it will be empty if the search has not been triggered yet ...
       * ... but it behaves the same way in a Fiori Element 1.60
       */
      _getServiceUrl: function(oParams) {
        // skip?
        if (oParams.hasOwnProperty('setServiceUrl') && !oParams.setServiceUrl) {
          return null;
        }

        var oTable = oParams.controller.getSmartTable().getTable();
        var oBinding = oTable.getBinding('rows') || oTable.getBinding('items');
        if (!oBinding) {
          Assert.ok(false, 'no binding for table: ' + oTable);
        }
        var sResult = (oBinding && oBinding.getDownloadUrl()) || '';
        if (sResult) {
          sResult += '&$top=0&$inlinecount=allpages';
        }
        return sResult;
      }
    });
  }
);
