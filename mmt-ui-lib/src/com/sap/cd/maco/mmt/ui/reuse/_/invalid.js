sap.ui.define(['sap/m/Dialog', 'sap/m/Text', 'sap/m/Button', 'sap/ui/core/Icon', 'sap/m/HBox', 'sap/m/VBox'], function(
  Dialog,
  Text,
  Button,
  Icon,
  HBox,
  VBox
) {
  'use strict';

  return {
    show: function(oError) {
      setTimeout(function() {
        var oIcon = new Icon({
          src: 'sap-icon://collision',
          size: '4rem',
          color: 'rgb(187,15,23)'
        });
        oIcon.addStyleClass('sapUiSmallMarginEnd');
        var oMoreText = new Text({ text: 'more details in the browser console' });
        oMoreText.addStyleClass('sapUiSmallMarginTop');
        var oDialog = new Dialog({
          type: 'Message',
          icon: 'sap-icon://xxx', // disables the icon
          title: 'Invalid Usage of Reuselib',
          content: [
            new HBox({
              items: [
                oIcon,
                new VBox({
                  items: [new Text({ text: oError.message }), oMoreText]
                })
              ]
            })
          ],
          endButton: new Button({
            text: 'Close',
            press: function() {
              oDialog.close();
            }
          })
        });
        oDialog.open();
      }, 0);

      throw oError;
    }
  };
});
