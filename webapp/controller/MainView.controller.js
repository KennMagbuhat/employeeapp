sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.MainView", {
        onInit() {
            const oModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/EmployeeList.json"));
            this.getView().setModel(oModel);  // default model
        },

        onAdd: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("msgAddClicked"));
        },
      
        onDelete: function () {
          var oBundle = this.getView().getModel("i18n").getResourceBundle();
          MessageToast.show(oBundle.getText("msgDeleteClicked"));
        },

        onSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
            const oTable = this.getView().byId("employeeTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter([
                    new sap.ui.model.Filter({
                        path: "FirstName",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery
                    })
                    ]);
            }
        }
    });
});