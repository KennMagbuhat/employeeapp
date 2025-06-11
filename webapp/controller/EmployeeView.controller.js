sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/model/json/JSONModel"
], (Controller, History, JSONModel) => {
  "use strict";

  return Controller.extend("sapips.training.employeeapp.controller.EmployeeView", {
      onInit() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteEmployeeView")
              .attachPatternMatched(this._onObjectMatched, this);

         // Load Skills List
         const oView = this.getView();
         const oSkillModel = new JSONModel();
         oView.setModel(oSkillModel, "skill");
         oView.setModel(new JSONModel({ skills: [] }), "skillsTableModel");
  
        // Load Proficiency List
         oView.setModel(new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mockdata/ProficiencyList.json")), "proficiency");
      },

      _onObjectMatched: function (oEvent) {
          const sEmployeeID = oEvent.getParameter("arguments").employeeID;

          const sPath = "/Employee('" + sEmployeeID + "')";
          const oView = this.getView();

          oView.bindElement({
              path: sPath,
              events: {
                  dataRequested: function () {
                      oView.setBusy(true);
                  },
                  dataReceived: function () {
                      oView.setBusy(false);
                  }
              }
          });
        this._loadAndFilterSkills(sEmployeeID);
      },

      _loadAndFilterSkills: function (sEmployeeID) {
        var oView = this.getView();

        // Create and load temporary model
        var oTempModel = new sap.ui.model.json.JSONModel();
        oTempModel.loadData(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mockdata/Skill.json"));

        oTempModel.attachRequestCompleted(function () {
            var aAllSkills = oTempModel.getData(); // array

            console.log("All Skills Loaded:", aAllSkills);
            console.log("EmployeeId to filter:", sEmployeeID);

            // Filter by EmployeeId
            var aFilteredSkills = aAllSkills.filter(function (oSkill) {
                return String(oSkill.EmployeeId).trim() === String(sEmployeeID).trim();
            });

            console.log("Filtered Skills:", aFilteredSkills);

            // Set filtered skills to view model
            var oSkillsModel = new sap.ui.model.json.JSONModel({ skills: aFilteredSkills });
            oView.setModel(oSkillsModel, "skillsTableModel");
        });
    },

      onCancel: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          const sPreviousHash = History.getInstance().getPreviousHash();

          if (sPreviousHash !== undefined) {
              window.history.go(-1);
          } else {
              oRouter.navTo("RouteMainView", {}, true);
          }
      },

      onToEdit: function () {
          const sPath = this.getView().getBindingContext().getPath();
          const eid = sPath.match(/\('(.+)'\)/)[1];

          this.getOwnerComponent().getRouter().navTo("RouteEmployeeEditView", {
              employeeID: eid
          });
      }
  });
});