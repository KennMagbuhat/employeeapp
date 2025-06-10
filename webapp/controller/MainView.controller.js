sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, Filter, FilterOperator, JSONModel) {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.MainView", {
        onInit: function () {
            const oTable = this.getView().byId("employeeTable");

            const oViewModel = new JSONModel({
                employeeTitle: this._generateEmployeeTitle(0)
            });
            this.getView().setModel(oViewModel, "viewModel");

            oTable.attachUpdateFinished(() => {
                this._updateEmployeeCount();
            });
        },

        _generateEmployeeTitle: function (iCount) {
            return "Employees (" + iCount + ")";
        },

        _updateEmployeeCount: function () {
            const oTable = this.getView().byId("employeeTable");
            const oBinding = oTable.getBinding("items");
            const iCount = oBinding ? oBinding.getLength() : 0;

            const oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/employeeTitle", this._generateEmployeeTitle(iCount));
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
                                    this._updateEmployeeCount();
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
                    aInnerFilters.push(new Filter("Age", FilterOperator.EQ, parseInt(sQuery, 10)));
                }

                aFilters.push(new Filter({
                    filters: aInnerFilters,
                    and: false
                }));
            }

            oBinding.filter(aFilters);
            this._updateEmployeeCount(); 
        },

        onViewEmployeePage: function (oEvent) {
            const oItem = oEvent.getSource().getParent();
            const sEmployeeID = oItem.getBindingContext().getProperty("EmployeeID");

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteEmployeeView", {
                employeeID: sEmployeeID
            });
        }
    });
});
