(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.MyGuidedActionViewModel = function MyGuidedActionViewModel() {
        if (!(this instanceof MyGuidedActionViewModel)) {
            return new MyGuidedActionViewModel();
        }
        var self = this;
        self.Alert = ko.observable("");
        self.POA = ko.observable(new app.models.PoaViewModel());
        self.medCabinet = ko.observable(new app.models.MedCabVM());
        self.MyAppointmentsViewModel = ko.observable(new app.models.MyAppointmentsViewModel());
        self.CommunicationPreferencesViewModel = ko.observable(new app.models.CommunicationPreferencesViewModel());
        self.inlineErrorsExistPoa = ko.observable(false);
        self.inlineErrorsPoa = ko.observableArray([]);
        self.RecPlans = ko.observableArray([]);


        MyGuidedActionViewModel.MapGuidedAction = function MapGuidedAction(ActionId) {
            return app.enums.ActionNeededLinkEnum.PrescriptionRegime;
        };

        MyGuidedActionViewModel.prototype.clearInlineErrors = function clearInlineErrors(section) {
            if (section == 'aboutMe') {
                self.inlineErrorsExistAboutMe(false);
                self.inlineErrorsAboutMe([]);
            }
            if (section == 'username') {
                self.inlineErrorsExistUsername(false);
                self.inlineErrorsUsername([]);
            }
            if (section == 'password') {
                self.inlineErrorsExistPassword(false);
                self.inlineErrorsPassword([]);
            }
            if (section == 'poa') {
                self.inlineErrorsExistPoa(false);
                self.inlineErrorsPoa([]);
            }
        };



        MyGuidedActionViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr, section) {
            if (section == 'aboutMe') {
                self.inlineErrorsExistAboutMe(true);
                var errorListAboutMe = self.inlineErrorsAboutMe();
                errorListAboutMe.push(inlineErrorStr);
                self.inlineErrorsAboutMe(errorListAboutMe);
                return self;
            }
            else if (section == 'username') {
                self.inlineErrorsExistUsername(true);
                var errorListUsername = self.inlineErrorsUsername();
                errorListUsername.push(inlineErrorStr);
                self.inlineErrorsUsername(errorListUsername);
                return self;
            }
            else if (section == 'password') {
                self.inlineErrorsExistPassword(true);
                var errorListPassword = self.inlineErrorsPassword();
                errorListPassword.push(inlineErrorStr);
                self.inlineErrorsPassword(errorListPassword);
                return self;
            }
            else if (section == 'poa') {
                self.inlineErrorsExistPoa(true);
                var errorListPoa = self.inlineErrorsPoa();
                errorListPoa.push(inlineErrorStr);
                self.inlineErrorsPoa(errorListPoa);
                return self;
            }
            return self;
        };


        MyGuidedActionViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.Alert((viewModel.Alert));
            return protoSelf;
        };

        MyGuidedActionViewModel.prototype.loadPlansFromJSON = function loadPlansFromJSON(findRecommendations) {
            var protoself = this;
            protoself.RecPlans(findRecommendations.sPlanLists[0]);
            return protoself;
        };

        return self;
    };
} (EXCHANGE));