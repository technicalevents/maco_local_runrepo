sap.ui.define([], function () {
	"use strict";
    return Object.freeze({
        BO_OBJECT_TYPE: {
            APERAK_MSG: "BO_CP_APERAK",
            CONTRL_MSG: "BO_CP_CONTRL",
            EXCEPTION_DOCUMENT: "ExceptionDoc",
            PROCESS_DOCUMENT: "PDoc",
            TRANSFER_DOCUMENT: "TransDoc"
        },

        SEMANCTIC_OBJECT: {
            TRANSFER_DOCUMENT: "Message",
            PROCESS_DOCUMENT: "Process"
        },

        SEMANTIC_ACTION: {
            DISPLAY: "display"
        },

        FLOW_TYPE: {
            OUTBOUND: "O",
            INBOUND: "I"
        }
     });
});