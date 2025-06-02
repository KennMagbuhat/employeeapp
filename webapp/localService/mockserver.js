
sap.ui.define([
    "sap/ui/core/util/MockServer"
], function(MockServer) {
    "use strict";

    return {
        init: function() {
            var oMockServer = new MockServer({
                rootUri: "/sap/opu/odata/sap/ZMOCK_SERVICE/"
            });

            var oUriParameters = jQuery.sap.getUriParameters();
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: oUriParameters.get("serverDelay") || 1000
            });

            var sPath = jQuery.sap.getModulePath("mockserver");
            oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mock_data.json");

            oMockServer.start();
            jQuery.sap.log.info("Mock server started");
        }
    };
});
