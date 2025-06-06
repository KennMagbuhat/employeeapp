sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
  ], (Controller, JSONModel, History) => {
    "use strict";
  
    return Controller.extend("sapips.training.employeeapp.controller.EmployeeView", {
        onInit() {
          var oModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/EmployeeList.json"));
          this.getView().setModel(oModel);  // default model

          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteEmployeeView").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent){
          let oModel = this.getOwnerComponent().getModel();
          let args = oEvent.getParameter("arguments");
          let eid_arg = args["employeeID"];
          let read_arg = "(EmployeeID="+eid_arg+")";

          oModel.read(read_arg, {
             success: function(data){
              console.log(data);
             },
             error: function(data){
              console.log("nodata");
             }
          });
        },

        onCancel: function(){
          let oRouter = this.getOwnerComponent().getRouter();
          let sPreviousHash = History.getInstance().getPreviousHash();
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
              oRouter.navTo("RouteMainView", {}, true);
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