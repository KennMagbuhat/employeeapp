sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller) => {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.MainView", {
        onInit() {
        },

        onAdd: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("msgAddClicked"));
        },
      
        onDelete: function () {
          var oBundle = this.getView().getModel("i18n").getResourceBundle();
          MessageToast.show(oBundle.getText("msgDeleteClicked"));
        }
    });
});