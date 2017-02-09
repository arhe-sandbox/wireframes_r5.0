(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.GroupHealthPlanTypeEnum = {
        Dental: 0,
        Medical: 1,
        Post65Medical: 2,
        PrescriptionDrug: 3,
        Vision: 3 
    };

    ns.GroupHealthPlanTypeEnumName = {
        Dental: "Dental",
        Medical: "Medical",
        Post65Medical: "Post65 Medical",
        PrescriptionDrug: "Prescription Drug",
        Vision: "Vision"
    };

} (EXCHANGE));