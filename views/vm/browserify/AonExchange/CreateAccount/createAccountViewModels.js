(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.CreateAccountPersonalInfoViewModel = function CreateAccountPersonalInfoViewModel() {
        if (!(this instanceof CreateAccountPersonalInfoViewModel)) {
            return new CreateAccountPersonalInfoViewModel();
        }
        var self = this;

        // Not observables because they are basically "constants" that we've put
        // here just to encourage clients to use the same string that  
        // configurePanelType (further below) depends on. 
        self.INITIAL_PANEL_TYPE = "initial";
        self.MULTIMATCH_PANEL_TYPE = "multiple";
        self.FOUNDACCOUNT_PANEL_TYPE = "found";

        self.headerTitle_lbl = ko.observable('');
        self.createAccount_lbl = ko.observable('');
        self.step1_lbl = ko.observable('');
        self.enterName_lbl = ko.observable('');
        self.firstNameHint_lbl = ko.observable('');
        self.lastNameHint_lbl = ko.observable('');
        self.dateOfBirth_lbl = ko.observable('');
        self.enterEmail_lbl = ko.observable('');
        self.confirmEmail_lbl = ko.observable('');
        self.enterZip_lbl = ko.observable('');

        self.enterSsn_lbl = ko.observable('');
        self.enterNavId_lbl = ko.observable('');

        self.enterCounty_lbl = ko.observable('');

        // The county for the account being created
        self.county = ko.observable('');

        // The list of possible counties associated with the value of self.zip_tb
        self.countyList = ko.observableArray([]);

        // Depending on various factors regarding the zipcode, self.countyList could be empty, 
        // size 1, or size more than 1. The county dropdown should only be displayed to the 
        // user if there's an actual county choice to be made, i.e. there's more than one item 
        // in the county list. 
        self.showCountyList = ko.computed({
            read: function () {
                return self.countyList().length > 1;
            },
            owner: this,
            deferEvaluation: true
        });
        self.selectOne_lbl = ko.observable('');
        self.inlineAddrErrorCounty = ko.observable(false);

        self.enterPhone_lbl = ko.observable('');
        self.rightTitle_lbl = ko.observable('');
        self.rightB1Title_lbl = ko.observable('');
        self.rightB1Body_lbl = ko.observable('');
        self.rightB2Title_lbl = ko.observable('');
        self.rightB2Body_lbl = ko.observable('');
        self.privacyPolicy_lbl = ko.observable('');
        self.rightB3Title_lbl = ko.observable('');
        self.rightB3Body_lbl = ko.observable('');
        self.backBtn_lbl = ko.observable('');
        self.bottomCenter_lbl = ko.observable('');
        self.continue_lbl = ko.observable('');

        self.firstName_tb = ko.observable('');
        self.lastName_tb = ko.observable('');
        self.dateOfBirth = new app.models.DateOfBirthViewModel();

        self.email1_tb = ko.observable('');
        self.email2_tb = ko.observable('');
        self.zip_tb = ko.observable('');
        self.phone_tb = ko.observable('');
        self.ssn_tb = ko.observable('');
        self.navId_tb = ko.observable('');

        self.SubpanelTemplateName = ko.observable('');

        self.errors = ko.observableArray([]);
        self.hasErrors = ko.computed({
            read: function () {
                return self.errors().length > 0;
            }, owner: this
        });
        self.inlineErrorsHeader_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        self.matchPanelHeaderText = ko.observable('');
        self.hasMatchAlert = ko.observable(false);
        self.CRMAccountExists = ko.observable(false);
        self.matchAlertHeaderText = ko.observable('');
        self.matchAlertBodyText = ko.observable('');
        self.matchAlertListHtml = ko.observable('');

        self.hasMatchError = ko.observable(false);
        self.matchErrorHeaderText = ko.observable('');
        self.matchErrorBodyText = ko.observable('');
        self.matchErrorListHtml = ko.observable('');

        self.last4SsnLbl = ko.observable('');
        self.orText = ko.observable('');
        self.navigatorsIdLbl = ko.observable('');

        self.multiMatchHeader = ko.observable('');
        self.multiMatchSSNMessage = ko.observable('');
        self.multiMatchAonReireeId = ko.observable('');
        self.multiMatchContactUs = ko.observable('');


        self.connectToExistingAccount = ko.observable(false);

        CreateAccountPersonalInfoViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.headerTitle_lbl(viewModel.HeaderTitleLbl);
            protoSelf.createAccount_lbl(viewModel.CreateAccountLbl);
            protoSelf.step1_lbl(viewModel.Step1Lbl);
            protoSelf.enterName_lbl(viewModel.EnterNameLbl);
            protoSelf.firstNameHint_lbl(viewModel.FirstNameHintLbl);
            protoSelf.lastNameHint_lbl(viewModel.LastNameHintLbl);
            protoSelf.dateOfBirth_lbl(viewModel.DateOfBirthLbl);
            protoSelf.enterEmail_lbl(viewModel.EnterEmailLbl);
            protoSelf.confirmEmail_lbl(viewModel.ConfirmEmailLbl);
            protoSelf.enterZip_lbl(viewModel.EnterZipLbl);
            protoSelf.enterCounty_lbl(viewModel.EnterCountyLbl);
            protoSelf.selectOne_lbl(viewModel.CountySelectOne);
            protoSelf.enterPhone_lbl(viewModel.EnterPhoneLbl);
            protoSelf.rightTitle_lbl(viewModel.RightTitleLbl);
            protoSelf.rightB1Title_lbl(viewModel.RightB1TitleLbl);
            protoSelf.rightB1Body_lbl(viewModel.RightB1BodyLbl);
            protoSelf.rightB2Title_lbl(viewModel.RightB2TitleLbl);
            protoSelf.rightB2Body_lbl(viewModel.RightB2BodyLbl);
            protoSelf.privacyPolicy_lbl(viewModel.PrivacyPolicyLbl);
            protoSelf.rightB3Title_lbl(viewModel.RightB3TitleLbl);
            protoSelf.rightB3Body_lbl(viewModel.RightB3BodyLbl);
            protoSelf.backBtn_lbl(viewModel.BackBtnLbl);
            protoSelf.bottomCenter_lbl(viewModel.BottomCenterLbl);
            protoSelf.continue_lbl(viewModel.ContinueLbl);
            protoSelf.inlineErrorsHeader_lbl(viewModel.InlineErrorsHeaderLbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBodyLbl);

            protoSelf.matchPanelHeaderText(viewModel.MatchPanelHeaderText);
            protoSelf.matchAlertHeaderText(viewModel.MatchAlertHeaderText);
            protoSelf.matchAlertBodyText(viewModel.MatchAlertBodyText);
            protoSelf.matchAlertListHtml(viewModel.MatchAlertListHtml);
            protoSelf.matchErrorHeaderText(viewModel.MatchErrorHeaderText);
            protoSelf.matchErrorBodyText(viewModel.MatchErrorBodyText);
            protoSelf.matchErrorListHtml(viewModel.MatchErrorListHtml);

            protoSelf.last4SsnLbl(viewModel.Last4SsnLbl);
            protoSelf.orText(viewModel.OrText);
            protoSelf.navigatorsIdLbl(viewModel.NavigatorsIdLbl);

            protoSelf.multiMatchHeader(viewModel.MultiMatchHeader);
            protoSelf.multiMatchSSNMessage(viewModel.MultiMatchSSNMessage);
            protoSelf.multiMatchAonReireeId(viewModel.MultiMatchAonReireeId);
            protoSelf.multiMatchContactUs(viewModel.MultiMatchContactUs);


            // For these user-editable variables, prepopulate with values from the server; if the server
            // doesn't have legitimate values, it will send defaults.
            protoSelf.zip_tb(viewModel.ZipCode);
            protoSelf.countyList(viewModel.CountyList);
            protoSelf.county(viewModel.County);

            // The server provides (possibly default) values for the date-of-birth variables, just like with the above three variables. 
            protoSelf.dateOfBirth.loadFromJSON(viewModel.DateOfBirthViewModel, protoSelf.dateOfBirth.USE_SERVER_DATE_VALUES);

            // For these user-editable variables, the prepopulated value should always be the default 
            // value (which is the empty string), so the server doesn't need to send anything. The default
            // values can simply be provided as literals right here. 
            // 
            // It is not enough to rely on the initializations provided earlier in this file (when the observables  
            // were first assigned). This is because this loadFromJSON method might be called additional times, 
            // after the user has had a chance to edit the variables below. (See createAccount.js for details.) 
            // So, each call to this method should explicitly prepopulate the variables with defaults as seen below, 
            // so that there's a consistent default state produced by calling this method. 
            protoSelf.firstName_tb('');
            protoSelf.lastName_tb('');
            protoSelf.email1_tb('');
            protoSelf.email2_tb('');
            protoSelf.phone_tb('');
            protoSelf.ssn_tb('');
            protoSelf.navId_tb('');

            return protoSelf;
        };

    };

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.CreateAccountAuthViewModel = function CreateAccountAuthViewModel() {
        if (!(this instanceof CreateAccountAuthViewModel)) {
            return new CreateAccountAuthViewModel();
        }

        var self = this;

        self.headerTitleLbl = ko.observable('');
        self.createAccount_lbl = ko.observable('');
        self.step2_lbl = ko.observable('');
        self.enterUsername_lbl = ko.observable('');
        self.enterPassword_lbl = ko.observable('');
        self.confirmPassword_lbl = ko.observable('');
        self.rightTitle_lbl = ko.observable('');
        self.rightB1Title_lbl = ko.observable('');
        self.rightB1Body_lbl = ko.observable('');
        self.rightB2Title_lbl = ko.observable('');
        self.rightB2Body_lbl = ko.observable('');
        self.backBtn_lbl = ko.observable('');
        self.bottomCenter_lbl = ko.observable('');
        self.continue_lbl = ko.observable('');
        
        self.username_tb = ko.observable('');
        self.pw1_tb = ko.observable('');
        self.pw2_tb = ko.observable('');
        
        self.errors = ko.observableArray([]);
        self.hasErrors = ko.computed({
            read: function () {
                return self.errors().length > 0;
            }, owner: this
        });
        self.inlineErrorsHeader_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');
        
        self.backButtonClass = ko.observable('');
        self.continueButtonClass = ko.observable('');
        

        CreateAccountAuthViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            
            protoSelf.headerTitleLbl(viewModel.HeaderTitleLbl);
            protoSelf.createAccount_lbl(viewModel.CreateAccountLbl);
            protoSelf.step2_lbl(viewModel.Step2Lbl);
            protoSelf.enterUsername_lbl(viewModel.EnterUsernameLbl);
            protoSelf.enterPassword_lbl(viewModel.EnterPasswordLbl);
            protoSelf.confirmPassword_lbl(viewModel.ConfirmPasswordLbl);
            protoSelf.rightTitle_lbl(viewModel.RightTitleLbl);
            protoSelf.rightB1Title_lbl(viewModel.RightB1TitleLbl);
            protoSelf.rightB1Body_lbl(viewModel.RightB1BodyLbl);
            protoSelf.rightB2Title_lbl(viewModel.RightB2TitleLbl);
            protoSelf.rightB2Body_lbl(viewModel.RightB2BodyLbl);
            protoSelf.backBtn_lbl(viewModel.BackBtnLbl);
            protoSelf.bottomCenter_lbl(viewModel.BottomCenterLbl);
            protoSelf.continue_lbl(viewModel.ContinueLbl);
            protoSelf.inlineErrorsHeader_lbl(viewModel.InlineErrorsHeaderLbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBodyLbl);

            return protoSelf;
        };

    };

} (EXCHANGE, this));

