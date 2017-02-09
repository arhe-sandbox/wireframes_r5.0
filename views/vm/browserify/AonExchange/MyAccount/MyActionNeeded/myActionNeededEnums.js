;
(function (app) {
    var ns = app.namespace("EXCHANGE.enums");
    
    ns.ActionNeededAlertTypeEnum = {
        Informational: 0,
        ActionRequired: 1
    };

    ns.ActionNeededLinkEnum = {
        None: 0,
        ApplicationStatus: 1,
        CommunicationPreferences: 2,
        Appointments: 3,
        FindPlans: 4,
        Cart: 5,
        SavedPlans: 6,
        MyCoverage: 7,
        MyProfile: 8,
        HRAAllocation: 9,
        HelpMeChoose: 10,
        PrescriptionRegime: 11,
        ReadOnly: 12,
        POA:13,
        Physicians:14
    };

} (EXCHANGE));