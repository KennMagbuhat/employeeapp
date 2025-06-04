sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageToast, History) {
    "use strict";

    return Controller.extend("sapips.training.employeeapp.controller.AddView", {
        onInit: function () {
       
		},

        onSave: function () {
            var oView = this.getView();
            var sFirstName = oView.byId("firstNameInput").getValue();
            var sLastName = oView.byId("lastNameInput").getValue();

            if (!sFirstName || !sLastName) {
                MessageToast.show("Please fill out both fields.");
                return;
            }
            var oModel = this.getOwnerComponent().getModel();
            var aEmployees = oModel.getProperty("/Employees");

            aEmployees.push({
                EmployeeID: new Date().getTime(),
                FirstName: sFirstName,
                LastName: sLastName
            });

            oModel.setProperty("/Employees", aEmployees);
            MessageToast.show("Employee added successfully.");
        },

        onBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                oRouter.navTo("RouteMainView", {}, true);
            }
        },

        onFNameLiveChange: function(oEvent) {
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
        onLNameLiveChange: function(oEvent) {
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
        onAgeLiveChange: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
    
            var sFiltered = sValue.replace(/[^0-9]/g, '');
        
            if (sFiltered.length > 2) {
                sFiltered = sFiltered.slice(0, 2);
            }
        
            var iAge = parseInt(sFiltered, 10);
        
            if (sFiltered !== "" && (isNaN(iAge) || iAge < 0 || iAge > 90)) {
                sFiltered = sFiltered.slice(0, -1);
                oInput.setValue(sFiltered);
                oInput.setValueState("Error");
                oInput.setValueStateText("Age must be between 0 and 90.");
            } else {
                oInput.setValue(sFiltered);
                oInput.setValueState("None");
            }
        },
        onCareerLevelLiveChange: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
        
            var sFiltered = sValue.replace(/[^0-9]/g, '');
        
            if (sFiltered.length > 2) {
                sFiltered = sFiltered.slice(0, 2);
            }
            var iLevel = parseInt(sFiltered, 10);
        
            if (sFiltered === "") {
                oInput.setValue(sFiltered);
                oInput.setValueState("None");
            } else if (isNaN(iLevel) || iLevel < 1 || iLevel > 12) {
                sFiltered = sFiltered.slice(0, -1);
                oInput.setValue(sFiltered);
                oInput.setValueState("Error");
                oInput.setValueStateText("Career level must be between 1 and 12.");
            } else {
                oInput.setValue(sFiltered);
                oInput.setValueState("None");
            }
        }
                
        
    });
});
