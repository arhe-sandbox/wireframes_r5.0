(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.Pre65MyAccountSidebarViewModel = function Pre65MyAccountSidebarViewModel() {
        if (!(this instanceof Pre65MyAccountSidebarViewModel)) {
            return new Pre65MyAccountSidebarViewModel();
        }
        var self = this;

        self.myAccount_lbl = ko.observable('');
        self.accountOverview_lbl = ko.observable('');

        self.applicationStatus_lbl = ko.observable('');

        self.signatureRequired_lbl = ko.observable('');
        self.isSignatureRequired = ko.observable(false);

        self.pleaseContactUs_lbl = ko.observable('');
        self.areApplicationsDeniedOrIncomplete = ko.observable(false);

        self.applicationsPending_lbl = ko.observable('');
        self.numberOfApplicationsPending = ko.observable('');
        self.formattedApplicationsPending_lbl = ko.computed({
            read: function () {
                return self.numberOfApplicationsPending() + " " + self.applicationsPending_lbl();
            },
            owner: this,
            deferEvaluation: true
        });
        self.areApplicationsPending = ko.observable(false);

        self.myCoverage_lbl = ko.observable('');

        self.myActionNeeded_lbl = ko.observable('');

        self.showNonRetailClientOptions = ko.computed({
            read: function () {
                var clients = app.user.UserSession.UserProfile.clients();
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].ClientTypeEnum != app.enums.ClientType.Retail) {
                        return true;
                    }
                }
                return false;
            },
            owner: this,
            deferEvaluation: true
        });

        self.showHraAllocation = ko.observable(false);

        self.numberOfNewAppointments = ko.observable('');
        self.myAppointments_lbl = ko.observable('');
        self.formattedMyAppointments_lbl = ko.computed({
            read: function () {
                if (self.numberOfNewAppointments() == 0) {
                    return self.myAppointments_lbl();
                }
                return self.myAppointments_lbl() + " (" + self.numberOfNewAppointments() + ")";
            },
            owner: this,
            deferEvaluation: true
        });

        self.myHraAllocation_lbl = ko.observable('');

        self.newMessages_lbl = ko.observable('');
        self.numberOfNewMessages = ko.observable('');
        self.formattedNewMessages_lbl = ko.computed({
            read: function () {
                return self.numberOfNewMessages() + " " + self.newMessages_lbl();
            },
            owner: this,
            deferEvaluation: true
        });
        self.areNewMessages = ko.observable(false);

        self.updateProfile_lbl = ko.observable('');
        self.communicationPreferences_lbl = ko.observable('');

        self.haveQuestions_lbl = ko.observable('');
        self.haveQuestionsDesc_lbl = ko.observable('');


        Pre65MyAccountSidebarViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.myAccount_lbl(viewModel.MyAccount_Lbl);
            protoSelf.accountOverview_lbl(viewModel.AccountOverview_Lbl);

            protoSelf.applicationStatus_lbl(viewModel.ApplicationStatus_Lbl);

            protoSelf.signatureRequired_lbl(viewModel.SignatureRequired_Lbl);
            protoSelf.isSignatureRequired(viewModel.IsSignatureRequired);

            protoSelf.pleaseContactUs_lbl(viewModel.PleaseContactUs_Lbl);
            protoSelf.areApplicationsDeniedOrIncomplete(viewModel.AreApplicationsDeniedOrIncomplete);

            protoSelf.applicationsPending_lbl(viewModel.ApplicationsPending_Lbl);
            protoSelf.numberOfApplicationsPending(viewModel.NumberOfApplicationsPending);
            protoSelf.areApplicationsPending(viewModel.areApplicationsPending);

            protoSelf.myCoverage_lbl(viewModel.MyCoverage_Lbl);

            protoSelf.myActionNeeded_lbl(viewModel.MyActionNeeded_Lbl);

            protoSelf.numberOfNewAppointments(viewModel.NumberOfNewAppointments);
            protoSelf.myAppointments_lbl(viewModel.MyAppointments_Lbl);

            protoSelf.myHraAllocation_lbl(viewModel.MyHraAllocation_Lbl);

            protoSelf.newMessages_lbl(viewModel.NewMessages_Lbl);
            protoSelf.numberOfNewMessages(viewModel.NumberOfNewMessages);
            protoSelf.areNewMessages(viewModel.AreNewMessages);

            protoSelf.updateProfile_lbl(viewModel.UpdateProfile_Lbl);
            protoSelf.communicationPreferences_lbl(viewModel.CommunicationPreferences_Lbl);

            protoSelf.haveQuestions_lbl(viewModel.HaveQuestions_Lbl);
            protoSelf.haveQuestionsDesc_lbl(viewModel.HaveQuestionsDesc_Lbl);

            protoSelf.showHraAllocation(viewModel.ShowHraAllocation);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));