
sap.ui.define([
    "sap/ui/core/util/MockServer",
    "sap/base/Log"
], function(MockServer) {
    "use strict";

    return {
        init: function() {
            var oMockServer = new MockServer({
                rootUri: "/"
            });
            oMockServer.simulate("../localService/metadata.xml", {
                sMockdataBaseUrl: "../localService/mockdata/",
                bGenerateMissingMockData: true
            });
            oMockServer.start();
            jQuery.sap.log.info("Mock server started");

            // var oUriParameters = jQuery.sap.getUriParameters();
            // MockServer.config({
            //     autoRespond: true,
            //     autoRespondAfter: oUriParameters.get("serverDelay") || 999
            // });

            // var sPath = jQuery.sap.getModulePath("localservice");
            // oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata/mock_data.json");

            // oMockServer.start();
            // jQuery.sap.log.info("Mock server started");
            
        }
    };
});
