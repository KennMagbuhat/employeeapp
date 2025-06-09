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
        },
        onAdd: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("msgAddClicked"));

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteAddView");
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
        
            var aFilters = [];
        
            if (sQuery) {
                const isNumeric = !isNaN(sQuery);
        
                const aInnerFilters = [
                    new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("DateHire", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("CareerLevel", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("CurrentProject", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
        
                if (isNumeric) {
                    aInnerFilters.push(
                        new sap.ui.model.Filter("Age", sap.ui.model.FilterOperator.EQ, parseInt(sQuery, 10))
                    );
                }
        
                aFilters.push(new sap.ui.model.Filter({
                    filters: aInnerFilters,
                    and: false // OR
                }));
            }
        
            oBinding.filter(aFilters);
        },
        
        onViewEmployeePage: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext();
            var sEmployeeID = oContext.getProperty("EmployeeID");
          
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("employeePage", {
              employeeId: sEmployeeID
            });
git add controller/MainView.controller.js manifest.json          }
    });
});
