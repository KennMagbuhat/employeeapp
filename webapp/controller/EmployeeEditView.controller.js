sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
  ], (Controller, JSONModel, History) => {
    "use strict";
  
    return Controller.extend("sapips.training.employeeapp.controller.EmployeeEditView", {
        onInit() {
          var oModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/EmployeeList.json"));
          this.getView().setModel(oModel, "empList");  // default model

          var oSkillModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/Skill.json"));
          this.getView().setModel(oSkillModel, "empSkills");

          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteEmployeeView").attachMatched(this._onRouteMatched, this);

        },

        onCancel: function(){
          let oRouter = this.getOwnerComponent().getRouter();
          let sPreviousHash = History.getInstance().getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
              oRouter.navTo("RouteEmployeeView",{
                employeeID: eid
            });
          }
        },

        onToEdit: function(){
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteEmployeeEditView",{
            employeeID: eid
        });
        }

    });
  });