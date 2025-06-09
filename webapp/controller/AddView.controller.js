sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/ui/core/Core",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, History, Core, MessageBox) {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.AddView", {
        onInit: function () {
            var oCareerModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/CareerList.json"));
            this.getView().setModel(oCareerModel, "career");
        
            var oProjectModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/ProjectList.json"));
            this.getView().setModel(oProjectModel, "project");
        
            const oSkillModel = new JSONModel({ skill: [] });
            oSkillModel.loadData(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/Skill.json"));
            this.getView().setModel(oSkillModel, "skill");
        
            const oProfModel = new JSONModel(sap.ui.require.toUrl("sapips/training/employeeapp/localService/mainService/data/ProficiencyList.json"));
            this.getView().setModel(oProfModel, "proficiency");
        
            const oSkillsTableModel = new JSONModel({ skills: [] });
            this.getView().setModel(oSkillsTableModel, "skillsTableModel");
        
            // Set the default value for Date Hire to today's date
            var oDatePicker = this.getView().byId("idDateHire");
            var today = new Date();
            oDatePicker.setDateValue(today); // Set today's date as the default
        },
            

        onAdd: function () {
            if (!this.oDialog) {
                this.oDialog = this.loadFragment({
                    name: "sapips.training.employeeapp.fragment.SkillDialog"
                });
            }
            this.oDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onSaveDialogPress: function () {
            const oView = this.getView();
            const oDialog = oView.byId("addSkillDialog");
            const oSkillCombo = oView.byId("idComboSkill");
            const oProfCombo = oView.byId("idComboProficient");

            const sSelectedSkillKey = oSkillCombo.getSelectedKey();
            const sSelectedSkillText = oSkillCombo.getSelectedItem()?.getText();

            const sSelectedProfKey = oProfCombo.getSelectedKey();
            const sSelectedProfText = oProfCombo.getSelectedItem()?.getText();

            if (!sSelectedSkillKey || !sSelectedProfKey) {
                MessageToast.show("Please select both skill and proficiency.");
                return;
            }

            const oTable = oView.byId("skillsTable");
            const oModel = oTable.getModel("skillsTableModel") || new sap.ui.model.json.JSONModel({ skills: [] });
            const aSkills = oModel.getProperty("/skills") || [];

            aSkills.push({
                SkillId: sSelectedSkillKey,
                SkillName: sSelectedSkillText,
                ProficiencyId: sSelectedProfKey,
                ProficiencyLevel: sSelectedProfText
            });

            oModel.setProperty("/skills", aSkills);
            oTable.setModel(oModel, "skillsTableModel");

            // Clear combo box selections after adding the skill
            oSkillCombo.setSelectedKey(""); // Clear the Skill combo box
            oProfCombo.setSelectedKey(""); // Clear the Proficiency combo box

            oDialog.close();
        },

        onCancelDialogPress: function () {
            const oDialog = this.getView().byId("addSkillDialog");
            oDialog.close();
        },

        onDeleteSkill: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var oTable = this.getView().byId("skillsTable");
            var oSelectedItems = oTable.getSelectedItems();

            // Check if at least one skill is selected
            if (oSelectedItems.length === 0) {
                MessageToast.show(oBundle.getText("msgNoItemSelected"));
                return;
            }

            // Get selected skill IDs
            var aSelectedSkillIDs = oSelectedItems.map(function (item) {
                return item.getBindingContext("skillsTableModel").getObject().SkillId;
            });

            // Show a confirmation dialog to delete selected skills
            MessageBox.confirm(
                oBundle.getText("deleteContentSkill"),
                {
                    title: oBundle.getText("deleteTitleSkill"),
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            var oModel = this.getView().getModel("skillsTableModel");
                            var aSkills = oModel.getProperty("/skills");

                            // Filter out the selected skills to delete
                            aSkills = aSkills.filter(function (skill) {
                                return !aSelectedSkillIDs.includes(skill.SkillId);
                            });

                            // Update the model after deletion
                            oModel.setProperty("/skills", aSkills);

                            // Remove selections from the table
                            oTable.removeSelections(true);

                            // Show success message
                            MessageToast.show(oBundle.getText("msgDeleteClicked"));
                        } else {
                            // If the user cancels, show cancellation message
                            MessageToast.show(oBundle.getText("msgDeleteCancelled"));
                        }
                    }.bind(this)
                }
            );
        },

        onSave: function () {
            var oView = this.getView();
        
            var sFirstName = oView.byId("idInptFName").getValue();
            var sLastName = oView.byId("idInptLName").getValue();
            var sAge = oView.byId("idInptAge").getValue();
        
            var oDatePicker = oView.byId("idDateHire");
            var sDateHire = oDatePicker.getDateValue();
            var sDateHireISO = sDateHire ? sDateHire.toISOString().split('T')[0] : "";
        
            // Get today's date and the date one year ahead
            var today = new Date();
            var oneYearAhead = new Date();
            oneYearAhead.setFullYear(today.getFullYear() + 1);
        
            // Validate if Date Hire is not in the future more than 1 year
            if (sDateHire && sDateHire > oneYearAhead) {
                MessageToast.show("Date of Hire cannot be more than 1 year in the future.");
                return;
            }
        
            var oCareerCombo = oView.byId("idComboCareer");
            var sCareerKey = oCareerCombo.getSelectedKey();
            var sCareerText = oCareerCombo.getSelectedItem() ? oCareerCombo.getSelectedItem().getText() : "";
        
            var oProjectCombo = oView.byId("idComboCurrentP");
            var sProjectKey = oProjectCombo.getSelectedKey();
            var sProjectText = oProjectCombo.getSelectedItem() ? oProjectCombo.getSelectedItem().getText() : "";
        
            var oSkillsModel = oView.getModel("skillsTableModel");
            var aSkills = oSkillsModel ? (oSkillsModel.getProperty("/skills") || []) : [];
        
            // Check if all fields are filled and that at least one skill is selected
            if (!sFirstName || !sLastName || !sAge || !sDateHireISO || !sCareerKey || !sProjectKey) {
                sap.m.MessageToast.show("Please fill in all required fields.");
                return;
            }
        
            if (aSkills.length === 0) {
                sap.m.MessageToast.show("Employee must have at least one skill.");
                return;
            }
        
            var oNewEmployee = {
                EmployeeID: this._generateEmployeeID(),
                FirstName: sFirstName,
                LastName: sLastName,
                Age: parseInt(sAge, 10),
                DateHire: sDateHireISO,
                CareerLevel: sCareerText,
                CareerId: sCareerKey,
                CurrentProject: sProjectText,
                ProjectId: sProjectKey,
                Skills: aSkills
            };
        
            sap.ui.getCore().getEventBus().publish("employeeChannel", "employeeAdded", oNewEmployee);
            sap.m.MessageToast.show("Employee saved successfully.");
        
            // Clear fields after saving
            this._clearEntries();
        
            // Navigate back to main view
            this.getOwnerComponent().getRouter().navTo("RouteMainView", {}, true);
        },        

        _generateEmployeeID: function () {
            return "E" + Date.now();
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

        onCancel: function () {
            this._clearEntries();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainView", {}, true);
        },

        onBack: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMainView", {}, true);
            }
        },

        onFNameLiveChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
            var sFiltered = sValue.replace(/[^a-zA-Z]/g, '');

            if (sValue !== sFiltered) {
                oInput.setValue(sFiltered);
                oInput.setValueState("Warning");
                oInput.setValueStateText("Only alphabetical characters (A-Z, a-z) are allowed.");
            } else {
                oInput.setValueState("None");
            }
        },

        onLNameLiveChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
            var sFiltered = sValue.replace(/[^a-zA-Z]/g, '');

            if (sValue !== sFiltered) {
                oInput.setValue(sFiltered);
                oInput.setValueState("Warning");
                oInput.setValueStateText("Only alphabetical characters (A-Z, a-z) are allowed.");
            } else {
                oInput.setValueState("None");
            }
        },

        onAgeLiveChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
            if (!/^\d{0,2}$/.test(sValue)) {
                oInput.setValueState("Warning");
                oInput.setValueStateText("Age must be a valid number between 0 and 90.");
            } else {
                oInput.setValueState("None");
            }
        }
    });
});
