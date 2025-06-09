sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, History, MessageBox) {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.AddView", {
        onInit: function () {
            const oView = this.getView();
        

        
            const oSkillModel = new JSONModel();
            oSkillModel.loadData(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mockdata/SkillList.json"));
            oView.setModel(oSkillModel, "skill");
        
            oView.setModel(new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mockdata/ProficiencyList.json")), "proficiency");
            oView.setModel(new JSONModel({ skills: [] }), "skillsTableModel");
        
            const oDatePicker = oView.byId("idDateHire");
            const oToday = new Date();
        
            const oMaxDate = new Date();
            oMaxDate.setFullYear(oToday.getFullYear() + 1);
        
            oDatePicker.setDateValue(oToday); 
            oDatePicker.setMaxDate(oMaxDate); 
        },        

        onAdd: function () {
            if (!this.oDialog) {
                this.oDialog = this.loadFragment({
                    name: "sapips.training.employeeapp.fragment.SkillDialog"
                });
            }
            this.oDialog.then(oDialog => oDialog.open());
        },

        onSaveDialogPress: function () {
            const oView = this.getView();
            const oBundle = oView.getModel("i18n").getResourceBundle();
            const oSkillCombo = oView.byId("idComboSkill");
            const oProfCombo = oView.byId("idComboProficient");

            const sSkillKey = oSkillCombo.getSelectedKey();
            const sSkillText = oSkillCombo.getSelectedItem() ? oSkillCombo.getSelectedItem().getText() : "";
            const sProfKey = oProfCombo.getSelectedKey();
            const sProfText = oProfCombo.getSelectedItem() ? oProfCombo.getSelectedItem().getText() : "";

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
            const oTable = oView.byId("skillsTable");
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

        onPressSave: function () {
            const oView = this.getView();
            const oBundle = oView.getModel("i18n").getResourceBundle();
            const oModel = oView.getModel();

            const sFirstName = oView.byId("idInptFName").getValue().trim();
            const sLastName = oView.byId("idInptLName").getValue().trim();
            const sAge = oView.byId("idInptAge").getValue().trim();
            const sDateHire = oView.byId("idDateHire").getValue();
            const oCareerCombo = oView.byId("idComboCareer");
            const oProjectCombo = oView.byId("idComboCurrentP");

            const sCareerLevelKey = oCareerCombo.getSelectedKey();
            const sCurrentProjectKey = oProjectCombo.getSelectedKey();

            const aSkills = oView.getModel("skillsTableModel").getProperty("/skills") || [];

            if (!sFirstName && !sLastName && !sAge && !sDateHire && !sCareerLevelKey && !sCurrentProjectKey && aSkills.length === 0) {
                MessageToast.show(oBundle.getText("allFields"));
                return;
            }

            if (!sFirstName) {
                MessageToast.show(oBundle.getText("inputFname"));
                return;
            }
            if (!sLastName) {
                MessageToast.show(oBundle.getText("inputLName"));
                return;
            }
            if (!sAge || isNaN(sAge) || Number(sAge) <= 0) {
                MessageToast.show(oBundle.getText("inputAge"));
                return;
            }
            if (!sDateHire) {
                MessageToast.show(oBundle.getText("inputDateHire"));
                return;
            }
            if (!sCareerLevelKey) {
                MessageToast.show(oBundle.getText("inputCareerL"));
                return;
            }
            if (!sCurrentProjectKey) {
                MessageToast.show(oBundle.getText("inputCurrentP"));
                return;
            }
            if (aSkills.length === 0) {
                MessageToast.show(oBundle.getText("inputProf"));
                return;
            }

            const oNewEmployee = {
                EmployeeID: "EID_" + Date.now(),
                FirstName: sFirstName,
                LastName: sLastName,
                Age: Number(sAge),
                DateHire: sDateHire,
                CareerLevel: oCareerCombo.getSelectedItem().getText(),
                CurrentProject: oProjectCombo.getSelectedItem().getText()
            };

            oModel.create("/Employee", oNewEmployee, {
                success: () => {
                    MessageToast.show(oBundle.getText("addedEmployee"));
                    this._clearEntries();
                    oModel.refresh();
                    this.getOwnerComponent().getRouter().navTo("RouteMainView");
                },
                error: (oError) => {
                    MessageToast.show(oBundle.getText("failedAddEmployee"));
                    console.error(oError);
                }
            });
        },

        _clearEntries: function () {
            this.byId("idInptFName").setValue("");
            this.byId("idInptLName").setValue("");
            this.byId("idInptAge").setValue("");
            this.byId("idDateHire").setDateValue(null);
            this.byId("idComboCareer").setSelectedKey("");
            this.byId("idComboCurrentP").setSelectedKey("");
            this.getView().getModel("skillsTableModel").setProperty("/skills", []);
        },

        onAddAnother: function () {
            this._clearEntries();
        },

        onCancel: function () {
            this._clearEntries();
            this.getOwnerComponent().getRouter().navTo("RouteMainView", {}, true);
        },

        onBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteMainView", {}, true);
            }
        }
    });
});
