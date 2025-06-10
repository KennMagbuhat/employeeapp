sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/routing/History",
  "sap/m/MessageBox",
 "sap/ui/model/Filter",
 "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageToast, History, MessageBox) {
   "use strict";
 
 return Controller.extend("sapips.training.employeeapp.controller.EmployeeEditView", {
   onInit() {
       const oView = this.getView();

       const oRouter = this.getOwnerComponent().getRouter();
       oRouter.getRoute("RouteEmployeeEditView")
           .attachPatternMatched(this._onObjectMatched, this);

       const oSkillModel = new JSONModel();
       oSkillModel.loadData(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mockdata/SkillList.json"));
       oView.setModel(oSkillModel, "skill");

       oView.setModel(new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mockdata/ProficiencyList.json")), "proficiency");
       oView.setModel(new JSONModel({ skills: [] }), "skillsTableModel");
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
   },

   onAddSkill: function () {
       if (!this.oDialog) {
           this.oDialog = this.loadFragment({
               name: "sapips.training.employeeapp.fragment.SkillDialog"
           });
        }
        this.oDialog.then(oDialog => oDialog.open());
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

   onBack: function () {
       const oHistory = History.getInstance();
       const sPreviousHash = oHistory.getPreviousHash();

       if (sPreviousHash !== undefined) {
           window.history.go(-1);
       } else {
           this.getOwnerComponent().getRouter().navTo("RouteMainView", {}, true);
       }
   },
   onSaveDialogPress: function () {
       const oView = this.getView();
       const oBundle = oView.getModel("i18n").getResourceBundle();
       const oSkillCombo = oView.byId("idComboSkill");
       const oProfCombo = oView.byId("idComboProficient");

       const sSkillKey = oSkillCombo.getSelectedKey();
       const sSkillText = oSkillCombo.getSelectedItem()?.getText() || "";
       const sProfKey = oProfCombo.getSelectedKey();
       const sProfText = oProfCombo.getSelectedItem()?.getText() || "";

       if (!sSkillKey || !sProfKey) {
           MessageToast.show(oBundle.getText("inputProf"));
           return;
       }

       const oSkillsModel = oView.getModel("skillsTableModel");
       const aSkills = oSkillsModel.getProperty("/skills") || [];

       aSkills.push({
           SkillId: sSkillKey,
           SkillName: sSkillText,
           ProficiencyId: sProfKey,
           ProficiencyLevel: sProfText
       });

       oSkillsModel.setProperty("/skills", aSkills);

       oSkillCombo.setSelectedKey("");
       oProfCombo.setSelectedKey("");
       oView.byId("addSkillDialog").close();
   },

   onCancelDialogPress: function () {
       this.getView().byId("addSkillDialog").close();
   },

   onDeleteSkill: function () {
       const oView = this.getView();
       const oBundle = oView.getModel("i18n").getResourceBundle();
       const oTable = oView.byId("skillsTableEdit");
       const oSelectedItems = oTable.getSelectedItems();

       if (oSelectedItems.length === 0) {
           MessageToast.show(oBundle.getText("msgNoItemSelected"));
           return;
       }

       const aSelectedSkillIDs = oSelectedItems.map(item =>
           item.getBindingContext("skillsTableModel").getObject().SkillId
       );

       MessageBox.confirm(oBundle.getText("deleteContentSkill"), {
           title: oBundle.getText("deleteTitleSkill"),
           onClose: (sAction) => {
               if (sAction === MessageBox.Action.OK) {
                   const oSkillsModel = oView.getModel("skillsTableModel");
                   let aSkills = oSkillsModel.getProperty("/skills");

                   aSkills = aSkills.filter(skill => !aSelectedSkillIDs.includes(skill.SkillId));
                   oSkillsModel.setProperty("/skills", aSkills);
                   oTable.removeSelections(true);
                   MessageToast.show(oBundle.getText("msgDeleteClicked"));
               } else {
                   MessageToast.show(oBundle.getText("msgDeleteCancelled"));
               }
           }
       });
   },

   _clearEntries: function () {
       this.byId("idInptFNameEdit").setValue("");
       this.byId("idInptLNameEdit").setValue("");
       this.byId("idInptAgeEdit").setValue("");
       this._setDefaultHireDate(); // Reset to today's date again
       this.byId("idComboCareerEdit").setSelectedKey("");
       this.byId("idComboCurrentPEdit").setSelectedKey("");
       this.getView().getModel("skillsTableModel").setProperty("/skills", []);
   },

   _setDefaultHireDate: function () {
       const oDatePicker = this.byId("idDateHireEdit");
       const oToday = new Date();
       const oMaxDate = new Date();
       oMaxDate.setFullYear(oToday.getFullYear() + 1);

       oDatePicker.setDateValue(oToday);
       oDatePicker.setMaxDate(oMaxDate);
   },

   onPressUpdate: function () {
       const oView = this.getView();
       const oBundle = oView.getModel("i18n").getResourceBundle();
       const oModel = oView.getModel();
       
       // Input fields
       const sEmployeeID     = oView.byId("idInptEIdEdit").getValue().trim();
       const sFirstName      = oView.byId("idInptFNameEdit").getValue().trim();
       const sLastName       = oView.byId("idInptLNameEdit").getValue().trim();
       const sAge            = oView.byId("idInptAgeEdit").getValue().trim();
       const sDateHire       = oView.byId("idDateHireEdit").getValue().trim();
       
       // ComboBoxes
       const oCareerCombo       = oView.byId("idComboCareerEdit");
       const oProjectCombo      = oView.byId("idComboCurrentPEdit");
       const sCareerLevelKey    = oCareerCombo.getSelectedKey();
       const sCurrentProjectKey = oProjectCombo.getSelectedKey();
       
       // Skills model
       const aSkills = oView.getModel("skillsTableModel").getProperty("/skills") || [];
       

       // VALIDATION
       const validations = [
           { condition: !sFirstName, messageKey: "inputFname" },
           { condition: !sLastName, messageKey: "inputLName" },
           { condition: !sAge || isNaN(sAge) || Number(sAge) <= 0, messageKey: "inputAge" },
           { condition: !sDateHire, messageKey: "inputDateHire" },
           { condition: !sCareerLevelKey, messageKey: "inputCareerL" },
           { condition: !sCurrentProjectKey, messageKey: "inputCurrentP" },
           { condition: aSkills.length === 0, messageKey: "inputProf" }
       ];
       
       // Check if all fields are empty
       const allEmpty = validations.every(v => v.condition);
       
       if (allEmpty) {
           MessageToast.show(oBundle.getText("allFields"));
           return;
       }
       
       // Validate each individual field
       for (let i = 0; i < validations.length; i++) {
           if (validations[i].condition) {
               MessageToast.show(oBundle.getText(validations[i].messageKey));
               return;
           }
       }

       // Prevents errors if sFirstName or sLastName is undefined
       const oUpdateEmployee = {
           EmployeeID: sEmployeeID,
           FirstName: sFirstName?.trim() || "",
           LastName: sLastName?.trim() || "",
           Age: Number(sAge) || 0,
           DateHire: sDateHire || null,
           CareerLevel: oCareerCombo.getSelectedItem()?.getText() || "",
           CurrentProject: oProjectCombo.getSelectedItem()?.getText() || ""
       };

       const sEmployeePath = `/Employee('${sEmployeeID}')`; // must use the entity key!

       oModel.update(sEmployeePath, oUpdateEmployee, {
           success: () => {
               MessageToast.show(oBundle.getText("updatedEmployee"));
               this._clearEntries();
               oModel.refresh(); // Refreshes model to reflect the updated data
               this.getOwnerComponent().getRouter().navTo("RouteMainView");
           },
           error: (oError) => {
               MessageToast.show(oBundle.getText("failedUpdateEmployee"));
               console.error("Update failed:", oError);
           }
       });    
   }
});
});
