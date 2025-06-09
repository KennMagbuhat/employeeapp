sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.MainView", {
        onInit: function () {
            const oTable = this.byId("employeeTable");
            const oPage = this.byId("page");
     
            const fnUpdateTitle = () => {
              const iLength = oTable.getBinding("items")?.getLength() || 0;
              oPage.setTitle(`Employees (${iLength})`);
            };
     
            const oBinding = oTable.getBinding("items");
     
            if (oBinding) {
              oBinding.attachChange(fnUpdateTitle); // dynamic updates
            } else {
              // fallback if binding isn't ready yet
              oTable.attachEventOnce("updateFinished", fnUpdateTitle);
            }
        },

        onAdd: function () {
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("msgAddClicked"));

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteAddView");
        },

        onDelete: function () {
            const oTable = this.getView().byId("employeeTable");
            const aSelectedItems = oTable.getSelectedItems();
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
        
            // Check if at least one row is selected
            if (aSelectedItems.length === 0) {
                MessageToast.show(oBundle.getText("selectOne"));
                return;
            }
        
            MessageBox.confirm(oBundle.getText("deleteContent"), {
                title: oBundle.getText("deleteTitle"),
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const oModel = this.getView().getModel(); 
        
                        aSelectedItems.forEach((oItem) => {
                            const oContext = oItem.getBindingContext();
                            const sPath = oContext.getPath();
        
                            oModel.remove(sPath, {
                                success: () => {
                                    MessageToast.show(oBundle.getText("deletedSuccess"));
                                },
                                error: (oError) => {
                                    MessageToast.show(oBundle.getText("deleteFailed"));
                                    console.error(oError);
                                }
                            });
                        });
        
                        oTable.removeSelections(true);
                    } else {
                        MessageToast.show(oBundle.getText("deleteCancel"));
                    }
                }
            });
        },            

        onSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
            const oTable = this.getView().byId("employeeTable");
            const oBinding = oTable.getBinding("items");

            let aFilters = [];

            if (sQuery) {
                const isNumeric = !isNaN(sQuery);

                const aInnerFilters = [
                    new Filter("EmployeeID", FilterOperator.Contains, sQuery),
                    new Filter("FirstName", FilterOperator.Contains, sQuery),
                    new Filter("LastName", FilterOperator.Contains, sQuery),
                    new Filter("DateHire", FilterOperator.Contains, sQuery),
                    new Filter("CareerLevel", FilterOperator.Contains, sQuery),
                    new Filter("CurrentProject", FilterOperator.Contains, sQuery)
                ];

                if (isNumeric) {
                    aInnerFilters.push(
                        new Filter("Age", FilterOperator.EQ, parseInt(sQuery, 10))
                    );
                }

                aFilters.push(new Filter({
                    filters: aInnerFilters,
                    and: false // OR logic
                }));
            }

            oBinding.filter(aFilters);
        },

        onViewEmployeePage: function (oEvent) {
            const oTable = this.getView().byId("employeeTable");
            const oBinding = oTable.getBinding("items");
            const oItem = oEvent.getSource().getParent();
            const oContext = oItem.getBindingContext();
            const sEmployeeID = oContext.getProperty("EmployeeID");

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteEmployeeView", {
                employeeID: sEmployeeID
            });
        }
    });
});
