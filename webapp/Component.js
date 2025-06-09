sap.ui.define([
    "sap/ui/core/UIComponent",
    "sapips/training/employeeapp/model/models",
    "sapips/training/employeeapp/localService/mockserver"
], (UIComponent, models,mockserver) => {
    "use strict";

    return UIComponent.extend("sapips.training.employeeapp.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            //Start the mock OData Service
            this.initializeODataService();
        },
                   /**
             * //TODO: Initialization will be transferred once the actual oData Service connection becomes available.
             * 
             * Initialize the Mock Service using the GEMS BCRA Metadata
             */
        initializeODataService: function () {
            mockserver.init();

            var oModel = new sap.ui.model.odata.v2.ODataModel({
                serviceUrl: "/sap/opu/odata/sap/EMPLOYEE_SRV"
            });
            this.setModel(oModel);
      }
    });
});