# Decisions

## Public, Protected, Private

We would need something like that:
* Public: other views calling the controller of our view
* Protected: inheriting stuff from reuse lib
* Private: reulib internals

yet there is nothing like that in JS and the "", "_", "__" is not really understood.

there is only "" and "_" (understood at SAP). As such we use this to express "public/protected" and "private" because
the differentiation between privte and the rest is the most important one.

Is a function in reuse that is used in the view public or private?
Public. Because otherwise reuse consumers would not be allowed to use it.
"_" now has the meaning: hands off!


## Why Actions?

* public
  * cross controller reuse
  * smaller controllers ~ more modular code
    * configuration for actions (without blowing up all the controllers)
  * (framework based action enable/visible)
* internal
    * removed CRUD from inheritance chain
    * replaces CrudTable.dialogClass/dialogProvider
    * replaces Draft.js
    * replaces Dialog.js
    * promises instead of after/before callbacks
    * 1 delete for list report, crud table and object page

## Determine Action in View

How to map the view control to the action to execute?

Options
* control id
    * (-) inplace tut net in 160 ?!?!
        * could not repro in 1.62.1
    * (-) showDraftStatusExpanded/showDraftStatusSnapped
        * so be it
        * consider "actions" a mapping of ids to actions
* custom data
    * (-) not so easy to retrieve the control
* this new UI5 feature of parametrized event handlers
    * no, did not find in docu, maybe 1.63?
    * can add this later as option but release dependency is too high


## Events on section controllers

Options:
* (i) event modelContextChange on sap.ui.base.ManagedObject
    * generic UI5 event fired on changing binding context
    * can be used to understand that the parent binding has changed
    * some extra work to suppress duplicate events => fixable
    * BUT fired AFTER the data has been loaded
    * (--) read calls are put to the a next batch only (performance)
    * for smart table this happens anyway ... but this mechanism should work for any use case
* (ii) register sub controllers in object page config
    * 
    ```JavaScript
    ObjectPageNoDraftController.prototype.onInit.call(this, {
    subControllers: [this.byId('PartnersTable').getController()]
  });
    ```
    * (--) this will not work for lazy loaded sections (tabs)
* (iii) register sub controllers in sub controller onInit
    * (--) this will not work for lazy loaded sections (tabs)