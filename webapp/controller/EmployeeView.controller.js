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

          let oSkillModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/Skill.json"));
          this.getView().setModel(oSkillModel, "skill");

          //get router to pass data
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteEmployeeView").attachPatternMatched(this._onObjectMatched, this);

          //set the skills table title.
          /**let oTitle = this.getView().byId("skillsTableTitleId");
          const oTable = this.getView().byId("skillsTableEmpView");
          const oItems = oTable.getBinding("items");
          let sktext = oTitle.getText();
          let listlength = Object.keys(oItems.oList).length;
          console.log(oItems.oList);
          sktext += "(" + listlength + ")";
          oTitle.setText(sktext);*/
        },

        _onObjectMatched(oEvent){
          let oModel = this.getOwnerComponent().getModel();
          let args = oEvent.getParameter("arguments");
          let eid_arg = args["employeeID"];
          let sReadUri = oModel.createKey("/", {
            EmployeeID: eid_arg
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