/*global location*/
sap.ui.define(
  ['sap/ui/base/Object', 'sap/ui/core/Fragment', 'com/sap/cd/maco/mmt/ui/reuse/device/contentDensity', 'com/sap/cd/maco/mmt/ui/reuse/base/Assert'],
  function(Object, Fragment, contentDensity, Assert) {
    'use strict';

    return Object.extend('com.sap.cd.maco.mmt.ui.reuse.base.FragmentController', {
      _oOwnerComponent: undefined,
      _sFragmentId: undefined,
      _oFragment: undefined,

      /**
       * @param {object} [params] The parameters as object with:
       *   id : mandatory. id of the fragment instance
       *   fragmentName : mandatory. name of the fragment
       *   component : mandatory. the containing component
       *   view : optional. if you supply a view the fragment is added to the view, otherwise to the component
       */

      constructor: function(params) {
        // check params
        var oAssert = new Assert();
        oAssert.ok(params, 'Cannot instantiate FragmentController. params missing');
        oAssert.ok(params.component, 'Cannot instantiate FragmentController. component missing');
        oAssert.ok(params.id, 'Cannot instantiate FragmentController. id missing');
        oAssert.ok(params.fragmentName, 'Cannot instantiate FragmentController. fragmentName missing');
        // optional: view

        // keep reference to the "owner" component
        this._oOwnerComponent = params.component;

        // create id
        if (params.view) {
          this._sFragmentId = params.view.createId(params.id);
        } else {
          this._sFragmentId = this._oOwnerComponent.createId(params.id);
        }

        // running the xml fragment instantiation as owner of the component
        // allows us to later on access the owner component from nested view controller
        this._oOwnerComponent.runAsOwner(
          function() {
            this._oFragment = sap.ui.xmlfragment(this._sFragmentId, params.fragmentName, this);
          }.bind(this)
        );

        if (params.view) {
          // add fragment as dependent to view
          params.view.addDependent(this._oFragment);
        } else {
          // retrieve the "root" view of the component
          var oRootView;
          if (this._oOwnerComponent.getRootControl) {
            oRootView = this._oOwnerComponent.getRootControl(); // UI5 => 1.44
          } else {
            oRootView = this._oOwnerComponent.getAggregation('rootControl'); // UI5 < 1.42 (not really a public contract)
          }

          // add fragment to root view
          oRootView.addDependent(this._oFragment);
        }

        // Register other looks like onBeforeRendering, etc.
        this._oFragment.addEventDelegate(this, this);

        // add content density CSS class
        var sContentDensity = contentDensity.get();
        if (sContentDensity) {
          this._oFragment.addStyleClass(sContentDensity);
        }

        // Invoke lifecycle hook
        this.onInit();
      },

      /**
       *
       * @returns {null|*}
       */
      getFragment: function() {
        return this._oFragment;
      },

      /**
       *
       * @returns {undefined|*}
       */
      getFragmentId: function() {
        return this._sFragmentId;
      },

      /**
       *
       * @returns {*}
       */
      getOwnerComponent: function() {
        return this._oOwnerComponent;
      },

      /**
       * Destroys the objects and releases all object references.
       */
      destroy: function() {
        // Invoke lifecycle hook
        this.onExit();

        // destroy stuff
        if (this._oFragment) {
          this._oFragment.removeEventDelegate(this, this);
          this._oFragment.destroy();
        }

        // Reset properties
        this._oFragment = null;
        this._oOwnerComponent = null;

        // call overwritten destroy
        Object.prototype.destroy.apply(this, arguments);
      },

      /**
       * Utility function for accessing an element inside the fragment by its id.
       * @param {string} sId the id of the element inside the fragment.
       * @returns {sap.ui.core.Element} the element matching the id.
       */
      byId: function(sId) {
        return Fragment.byId(this._sFragmentId, sId);
      },

      /**
       * Utility function for creating an id for an element inside the fragment.
       * @param {string} sId the id of the element inside the fragment.
       * @returns {string} the id.
       */
      createId: function(sId) {
        return Fragment.createId(this._sFragmentId, sId);
      },

      /**
       * Hook method invoked once when the controller is created.
       */
      onInit: function() {},

      /**
       * Hook method invoked once when the controller is destroyed.
       */
      onExit: function() {},

      /**
       * Hook method invoked before the controller is rendered.
       */
      onBeforeRendering: function() {},

      /**
       * Hook method invoked after the controller is rendered.
       */
      onAfterRendering: function() {}
    });
  }
);
