; (function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.ProgressPageType = {
    	Overview: 0,
		FirstApplication: 1,
		SecondApplication: 2,
		NextSteps: 3
    };

    ns.ApplicationDisplayPageType = {
        Overview: 0,
        Application: 1,
        Review: 2,
        NextSteps: 3,
        Esign: 4
    };

    ns.ApplicationPageTypeEnum = {
        Profile: 0,
        Eligibility: 1,
        Application: 2          
    };

    ns.ValidationTypeEnum = {
        MinimumLength: 0,
        MaximumLength: 1,
        BankRoutingNumber: 2,
        Required: 3,
        Date: 4
    };
    ns.QuestionGroups = {
        None: "",
        Group1: "Group1",
        Group2: "Group2",
        Group3: "Group3",
        Group4: "Group4",
        Group5: "Group5"                
    };

} (EXCHANGE));