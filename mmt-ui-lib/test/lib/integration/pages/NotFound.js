sap.ui.define(['sap/ui/test/Opa5', 'sap/ui/test/matchers/I18NText'], function(Opa5, I18NText) {
  'use strict';
  Opa5.createPageObjects({
    onTheNotFoundPage: {
      actions: {},
      assertions: {
        iShouldSeeNotFoundPage: function() {
          return this.waitFor({
            controlType: 'sap.m.MessagePage',
            matchers: [
              new I18NText({
                modelName: 'i18n',
                key: 'NO_FOUND',
                propertyName: 'text'
              })
            ],
            success: function(oMessagePage) {
              Opa5.assert.ok(oMessagePage, 'The not found page was successfully displayed');
            },
            errorMessage: 'The not found page was not displayed'
          });
        }
      }
    }
  });
});
