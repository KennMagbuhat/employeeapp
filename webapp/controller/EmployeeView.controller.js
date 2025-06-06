sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ], (Controller, JSONModel) => {
    "use strict";
  
    return Controller.extend("sapips.training.employeeapp.controller.EmployeeView", {
        onInit() {
          var oModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/EmployeeList.json"));
          this.getView().setModel(oModel);  // default model

          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteEmployeeView").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent){
          let args = oEvent.getParameter("arguments");
          let eid_arg = args["employeeID"];

          oModel.read("")
        }

    });
  });