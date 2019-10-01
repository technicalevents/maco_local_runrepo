sap.ui.define(['sap/ui/core/Control', 'sap/m/Button', 'sap/m/MessagePopover', 'sap/m/MessageItem', 'sap/ui/model/Filter'], function(
  Control,
  Button,
  MessagePopover,
  MessageItem,
  Filter
) {
  'use strict';

  return Control.extend('com.sap.cd.maco.mmt.ui.reuse.message.MessageButton', {
    metadata: {
      properties: {},
      aggregations: {
        _button: {
          type: 'sap.m.Button',
          multiple: false,
          visibility: 'hidden'
        },
        _popover: {
          type: 'sap.m.MessagePopover',
          multiple: false,
          visibility: 'hidden'
        }
      },
      events: {}
    },

    init: function() {
      var oButton = new Button({
        text: {
          path: 'message>/',
          formatter: this._formatText
        },
        tooltip: '{i18n-reuse>messageButtonTooltip}',
        iconFirst: true,
        type: 'Emphasized',
        icon: 'sap-icon://message-popup',
        visible: {
          path: 'message>/',
          formatter: this._formatVisible
        },
        press: this._onPress.bind(this)
      });
      this.setAggregation('_button', oButton);
    },

    _formatText: function(aMessages) {
      var iCount = 0;
      for (var i = 0; i < aMessages.length; i++) {
        if (!aMessages[i].technical) {
          iCount++;
        }
      }
      return iCount;
    },

    _formatVisible: function(aMessages) {
      for (var i = 0; i < aMessages.length; i++) {
        if (aMessages[i].technical === false) {
          return true;
        }
      }
      return false;
    },

    _onPress: function(oEvent) {
      this.showPopover();
    },

    showPopover: function() {
      // lazy instantiation of popover
      var oPopover = this.getAggregation('_popover');
      if (!oPopover) {
        oPopover = new MessagePopover({});
        oPopover.bindAggregation('items', {
          path: 'message>/',
          filters: [new Filter('technical', 'EQ', false)],
          template: new MessageItem({
            title: '{message>message}',
            type: '{message>type}'
          })
        });
        this.setAggregation('_popover', oPopover);
      }

      // if called from controller the button might be not rendered yet
      // solution: let's wait a while. so messy.
      setTimeout(
        function() {
          var oButton = this.getAggregation('_button');
          oPopover.openBy(oButton);
        }.bind(this),
        0
      );
    },

    renderer: function(oRM, oControl) {
      oRM.write('<span');
      oRM.writeControlData(oControl);
      oRM.writeClasses();
      oRM.write('>');
      oRM.renderControl(oControl.getAggregation('_button'));
      oRM.write('</span>');
    }
  });
});
