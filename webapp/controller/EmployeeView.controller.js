sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], (Controller, History) => {
  "use strict";

  return Controller.extend("sapips.training.employeeapp.controller.EmployeeView", {
      onInit() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("RouteEmployeeView")
              .attachPatternMatched(this._onObjectMatched, this);
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
          var sSKill = "/Skill('" + sEmployeeID + "')";
          var oSkillView = this.getView.byID("skillsTableEmpView");
          oView.bindElement({
            path: sSKill,
            events: {
                dataRequested: function () {
                    oSkillView.setBusy(true);
                },
                dataReceived: function () {
                    oSkillView.setBusy(false);
                }
            }
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