(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.ApplicationStatusEnum = {
        OutstandingAtCustomer: 0,
        ReceivedAtAgency: 1,
        SubmittedToInsurer: 2,
        ReceivedByInsurer: 3,
        Enrolled: 4,
        DisEnrolled: 5,
        IncompleteAtInsurer: 6,
        Denied: 7,
        IncompleteAtAgency: 8,
        VerifiedByAgency: 9,
        ReadyToSend: 10,
        Error: 11,
        SubmittedToInsurerIncomplete: 12,
        VerifiedByAgencyIncomplete: 13
    };

    ns.ApplicationStatusEnumName = {
        OutstandingAtCustomer: "OutstandingAtCustomer",
        ReceivedAtAgency: "ReceivedAtAgency",
        SubmittedToInsurer: "SubmittedToInsurer",
        ReceivedByInsurer: "ReceivedByInsurer",
        Enrolled: "Enrolled",
        DisEnrolled: "DisEnrolled",
        IncompleteAtInsurer: "IncompleteAtInsurer",
        Denied: "Denied",
        IncompleteAtAgency: "IncompleteAtAgency",
        VerifiedByAgency: "VerifiedByAgency",
        ReadyToSend: "ReadyToSend",
        Error: "Error",
        SubmittedToInsurerIncomplete: "SubmittedToInsurerIncomplete",
        VerifiedByAgencyIncomplete: "VerifiedByAgencyIncomplete"
    };

    ns.SignatureTypeEnum = {
        Voice: 0,
        Wet: 1,
        Electronic: 2
    };

    ns.SignatureTypeEnumName = {
        Voice: "Voice",
        Wet: "Wet",
        Electronic: "Electronic"
    };

} (EXCHANGE));