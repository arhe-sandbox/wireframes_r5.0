(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.Pre65TransitionViewModel = function Pre65TransitionViewModel() {
        if (!(this instanceof Pre65TransitionViewModel)) {
            return new Pre65TransitionViewModel();


        }
        var self = this;
        self.orange_lbl = ko.observable('');
        self.b4Continue_lbl = ko.observable('');
        self.confirm_lbl = ko.observable('');
        self.dob_lbl = ko.observable('');

        self.smoker_lbl = ko.observable('');
        self.nonsmoker_lbl = ko.observable('');
        self.over65_lbl = ko.observable('');
        self.under65_lbl = ko.observable('');
        self.male_lbl = ko.observable('');
        self.female_lbl = ko.observable('');
        self.edit_lbl = ko.observable('');
        self.editInformation_lbl = ko.observable('');

        self.over65HraTextWithAmount = ko.observable('');
        self.under65HraTextWithAmount = ko.observable('');

        self.viewOver65_lbl = ko.observable('');
        self.selectUnder65_lbl = ko.observable('');
        self.errorMsg_lbl = ko.observable('');

        self.over65 = ko.observableArray([]);
        self.under65 = ko.observableArray([]);
        self.isPre65 = ko.observable(false);
        self.isAgeIn = ko.observable(false);        

        self.AgentAccessScriptForFirstTime_Lbl = ko.observable('');
        self.AgentAccessScriptForReturningCustomer_Lbl = ko.observable('');
        self.SelfServiceScriptForReturningCustomer_Lbl = ko.observable('');
        self.IsReturningUser = ko.observable(false);
        self.DisplayAgentAccessScript = ko.observable(false);
        self.AgentTopScript_Lbl = ko.observable('');

        self.IseHealthSiteDeactivate = ko.observable(false);
        self.EnrollmenteHealthLink_Lbl = ko.observable('');

        self.DisplayUnder65Btn = ko.computed({
            read: function () {
                if (EXCHANGE.user.UserSession.IsAgentAccess() && self.DisplayAgentAccessScript()) {
                    return false;
                }
                if (EXCHANGE.user.UserSession.IsAgentAccess() && self.IsReturningUser()) {
                    return false;
                }
                if (self.IseHealthSiteDeactivate())
                { return false; }
                return true;
            },
            owner: this,
            deferEvaluation: true
        });
              

        Pre65TransitionViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoself = this;

            $.each(viewModel.Over65, function (index, over65) {
                over65.DateOfBirth = moment(over65.DateOfBirth).format("MM/DD/YYYY");
                protoself.over65.push(over65);

            });

            $.each(viewModel.Under65, function (index, under65) {
                under65.DateOfBirth = moment(under65.DateOfBirth).format("MM/DD/YYYY");
                protoself.under65.push(under65);

            });

            protoself.orange_lbl(viewModel.Orange_lbl);
            protoself.b4Continue_lbl(viewModel.B4Continue_lbl);
            protoself.confirm_lbl(viewModel.Confirm_lbl);
            protoself.over65HraTextWithAmount(viewModel.Over65HraTextWithAmount);
            protoself.under65HraTextWithAmount(viewModel.Under65HraTextWithAmount);

            protoself.dob_lbl(viewModel.DOB_lbl);

            protoself.smoker_lbl(viewModel.Smoker_lbl);
            protoself.nonsmoker_lbl(viewModel.Nonsmoker_lbl);
            protoself.over65_lbl(viewModel.Over65_lbl);
            protoself.under65_lbl(viewModel.Under65_lbl);
            protoself.male_lbl(viewModel.Male_lbl);
            protoself.female_lbl(viewModel.Female_lbl);
            protoself.edit_lbl(viewModel.Edit_lbl);
            protoself.editInformation_lbl(viewModel.EditInformation_lbl);
            protoself.viewOver65_lbl(viewModel.ViewOver65_lbl);
            protoself.selectUnder65_lbl(viewModel.SelectUnder65_lbl);
            protoself.errorMsg_lbl(viewModel.ErrorMessage_lbl);
            protoself.isPre65(EXCHANGE.user.UserSession.UserProfile.isPre65());
            protoself.isAgeIn(EXCHANGE.user.UserSession.UserProfile.isAgeIn());           

            protoself.AgentAccessScriptForFirstTime_Lbl(viewModel.AgentAccessScriptForFirstTime_Lbl);
            protoself.AgentAccessScriptForReturningCustomer_Lbl(viewModel.AgentAccessScriptForReturningCustomer_Lbl);
            protoself.SelfServiceScriptForReturningCustomer_Lbl(viewModel.SelfServiceScriptForReturningCustomer_Lbl);
            protoself.IsReturningUser(viewModel.IsReturningUser);
            protoself.AgentTopScript_Lbl(viewModel.AgentTopScript_Lbl);

            protoself.IseHealthSiteDeactivate(viewModel.IseHealthSiteDeactivate);
            protoself.EnrollmenteHealthLink_Lbl(viewModel.EnrollmenteHealthLink_Lbl);

            return protoself;
        };

    };

} (EXCHANGE));
