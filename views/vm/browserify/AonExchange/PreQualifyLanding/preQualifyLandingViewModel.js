(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PreQualifyLandingViewModel = function PreQualifyLandingViewModel() {
        if (!(this instanceof PreQualifyLandingViewModel)) {
            return new PreQualifyLandingViewModel();
        }
        var self = this;
        self.prequalheader = ko.observable("");
        self.question1 = ko.observable("");
        self.question2 = ko.observable("");
        self.question3 = ko.observable("");
        self.question4 = ko.observable("");
        self.question5 = ko.observable("");
        self.question6 = ko.observable("");
        self.welcomenews = ko.observable("");
        self.welcomeoption1 = ko.observable("");
        self.welcomeoption2 = ko.observable("");
        self.sorrynews = ko.observable("");
        self.sorrytryagain = ko.observable("");
        





        PreQualifyLandingViewModel.prototype.LoadFromJSON = function LoadFromJSON(jsonPreQualifyLandingViewModel) {

            var protoSelf = this;
            protoSelf.prequalheader(jsonPreQualifyLandingViewModel.PreQualHeader);
            protoSelf.question1(jsonPreQualifyLandingViewModel.Question1);
            protoSelf.question2(jsonPreQualifyLandingViewModel.Question2);
            protoSelf.question3(jsonPreQualifyLandingViewModel.Question3);
            protoSelf.question4(jsonPreQualifyLandingViewModel.Question4);
            protoSelf.question5(jsonPreQualifyLandingViewModel.Question5);
            protoSelf.question6(jsonPreQualifyLandingViewModel.Question6);
            protoSelf.welcomenews(jsonPreQualifyLandingViewModel.WelcomeNews);
            protoSelf.welcomeoption1(jsonPreQualifyLandingViewModel.WelcomeOption1);
            protoSelf.welcomeoption2(jsonPreQualifyLandingViewModel.WelcomeOption2);
            protoSelf.sorrynews(jsonPreQualifyLandingViewModel.SorryNews);
            protoSelf.sorrytryagain(jsonPreQualifyLandingViewModel.SorryTryAgain);

            return protoSelf;
        };
    };

} (EXCHANGE, this));
