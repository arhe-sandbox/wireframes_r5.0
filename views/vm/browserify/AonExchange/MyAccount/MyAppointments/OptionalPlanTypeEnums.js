(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.OptionalPlanTypeEnum = {
        Dental: 0,
        Vision: 1,
        Both: 2,
        Other: 3      
    };

    ns.OptionalPlanTypeEnumName = {
        Dental: "Dental",
        Vision: "Vision",
        Both: "Dental and Vision",
        Other: "No Optional Plan"
    };

} (EXCHANGE));