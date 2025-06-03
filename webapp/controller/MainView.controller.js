sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",  
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.MainView", {
        onInit() {
            const oModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/EmployeeList.json"));
            this.getView().setModel(oModel);  // default model
        },

        onAdd: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("msgAddClicked"));

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("add");
        },

        onDelete: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            const oTable = this.getView().byId("employeeTable");
            const oSelectedItems = oTable.getSelectedItems();

            if (oSelectedItems.length === 0) {
                MessageToast.show(oBundle.getText("msgNoItemSelected"));
                return;
            }

            const aSelectedEmployeeIDs = oSelectedItems.map(item => item.getBindingContext().getObject().EmployeeID);

            MessageBox.confirm(
                oBundle.getText("deleteContent"),
                {
                    title: oBundle.getText("deleteTitle"),
                    onClose: (sAction) => {
                        if (sAction === MessageBox.Action.OK) {
                            const oModel = this.getView().getModel();
                            let aEmployees = oModel.getProperty("/");

                            aEmployees = aEmployees.filter(employee => !aSelectedEmployeeIDs.includes(employee.EmployeeID));

                            oModel.setProperty("/", aEmployees);

                            oTable.removeSelections(true); 

                            MessageToast.show(oBundle.getText("msgDeleteClicked"));
                        } else {
                            MessageToast.show(oBundle.getText("msgDeleteCancelled"));
                        }
                    }
                }
            );
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
