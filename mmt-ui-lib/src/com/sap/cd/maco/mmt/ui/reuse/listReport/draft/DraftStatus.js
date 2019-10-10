sap.ui.define(['sap/ui/core/Control', 'sap/m/ObjectMarker'], function(Control, ObjectMarker) {
  'use strict';

  return Control.extend('com.sap.cd.maco.mmt.ui.reuse.draft.DraftStatus', {
    metadata: {
      properties: {},
      aggregations: {
        _marker: {
          type: 'sap.m.ObjectMarker',
          multiple: false,
          visibility: 'hidden'
        }
      },
      events: {
        press: {
          type: {
            type: 'string',
            domRef: 'string'
          }
        }
      }
    },

    init: function() {
      var oMarker = this._initMarker();
      this.setAggregation('_marker', oMarker);
    },

    _initMarker: function() {
      return new ObjectMarker({
        type: {
          parts: [{ path: 'IsActiveEntity' }, { path: 'HasDraftEntity' }, { path: 'DraftAdministrativeData' }],
          formatter: this._formatType
        },
        visible: {
          parts: [{ path: 'IsActiveEntity' }, { path: 'HasDraftEntity' }],
          formatter: this._formatVisible
        },
        additionalInfo: {
          parts: [{ path: 'IsActiveEntity' }, { path: 'DraftAdministrativeData' }],
          formatter: this._formatAdditionalInfo
        },
        press: this._firePress.bind(this)
      });
    },

    _firePress: function(oEvent) {
      var sType = oEvent.getParameter('type');
      this.firePress({ type: sType, domRef: oEvent.getSource().getDomRef() });
    },

    _formatType: function(bIsActiveEntity, bHasDraftEntity, oDraftAdministrativeData) {
      if (!oDraftAdministrativeData) {
        return sap.m.ObjectMarkerType.Draft;
      }
      if (!bIsActiveEntity) {
        // create draft for current user
        return sap.m.ObjectMarkerType.Draft;
      } else if (bHasDraftEntity && !oDraftAdministrativeData.InProcessByUser) {
        // edit draft but not locking
        return sap.m.ObjectMarkerType.UnsavedBy;
      } else if (bHasDraftEntity && oDraftAdministrativeData.InProcessByUser) {
        // edit draft that locks
        return sap.m.ObjectMarkerType.LockedBy;
      } else {
        // no draft! we only set some valid property to make the control happy. it will be hidden anyway.
        return sap.m.ObjectMarkerType.Draft;
      }
    },

    _formatVisible: function(bIsActiveEntity, bHasDraftEntity) {
      return !bIsActiveEntity || bHasDraftEntity;
    },

    _formatAdditionalInfo: function(bIsActiveEntity, oDraftAdministrativeData) {
      if (!oDraftAdministrativeData) {
        return false;
      }
      return bIsActiveEntity ? oDraftAdministrativeData.LastChangedByUser : '';
    },

    renderer: function(oRM, oControl) {
      // i just found no easier or more public way to pass the style classes
      // (i overwrote addStyleClass but it was called only once for the template of an aggregation)
      var oMarker = oControl.getAggregation('_marker');
      if (oControl.aCustomStyleClasses) {
        oControl.aCustomStyleClasses.forEach(function(sClass) {
          oMarker.addStyleClass(sClass);
        });
      }
      // render marker
      oRM.renderControl(oMarker);
    }
  });
});
