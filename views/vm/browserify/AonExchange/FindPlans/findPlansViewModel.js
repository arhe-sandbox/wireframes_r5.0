(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.FindPlansViewModel = function FindPlansViewModel() {
        if (!(this instanceof FindPlansViewModel)) {
            return new FindPlansViewModel();
        }
        var self = this;
        
        self.foundPlans_lbl = ko.observable('Find Plans');
        self.weFoundXPlans_lbl = ko.observable('Answer these questions<br/>to get started.');
        self.instructions_lbl = ko.observable('<b>Please answer these questions </b>  to help us find plans you qualify for and estimate the monthly premium for each plan.');
        self.question_lbl = ko.observable('<b>Have questions?</b><br/>Learn more about shopping <br/>for Medicare Supplement Insurance.');

        self.userZip_lbl = ko.observable('What is your ZIP code?');
        self.userZip_tb = ko.observable('');

        self.productType_lbl = ko.observable('What coverage are you looking for?');
        self.coverageBegins_lbl = ko.observable('When should coverage begin?');
        self.coverageBegins_options = ko.observableArray([]);
        self.productTypes_options = ko.observableArray([]);
        self.coverageBegins_tb = ko.observable('');
        self.productTypes_tb = ko.observable('');
        self.dateOfBirth_lbl = ko.observable('What is your date of birth?');
        self.dateOfBirth = new app.models.DateOfBirthViewModel();

        self.isGenderMale_lbl = ko.observable('What is your gender?');
        self.isGenderMale_Male_lbl = ko.observable('Male');
        self.isGenderMale_Female_lbl = ko.observable('Female');
        self.isGenderMale_radio = ko.observable('');

        self.isTobaccoUser_lbl = ko.observable('Do you use tobacco products?');
        self.isTobaccoUser_Yes_lbl = ko.observable('Yes');
        self.isTobaccoUser_No_lbl = ko.observable('No');
        self.isTobaccoUser_radio = ko.observable('');

        self.isDisabled_lbl = ko.observable('Are you disabled?');
        self.isDisabled_Yes_lbl = ko.observable('Yes');
        self.isDisabled_No_lbl = ko.observable('No');
        self.isDisabled_radio = ko.observable('');

        self.isKidneyFailure_lbl = ko.observable('Do you have end stage renal disease?');
        self.isKidneyFailure_Yes_lbl = ko.observable('Yes');
        self.isKidneyFailure_No_lbl = ko.observable('No');
        self.isKidneyFailure_radio = ko.observable('');

        self.startOverBtn_lbl = ko.observable('Start Over');
        self.answerToProceed_lbl = ko.observable('Answer the questions above to see<br/> plans and prices.');
        self.seePlansPrices_lbl = ko.observable('See Plans and Prices');

        self.selectOne_lbl = ko.observable('');
        self.enterCounty_lbl = ko.observable('');
        self.countyId = ko.observable('');
        self.countyId_boundToSelectValue = ko.observable('');
        self.countyList = ko.observableArray([]);
        self.showCountyList = ko.computed({
            read: function () {
                if (self.countyList()) {
                    return self.countyList().length > 1;
                }
                else {
                    return false;
                }
            },
            owner: this,
            deferEvaluation: true
        });

        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);
        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        self.isFromDirectedLanding = ko.observable(false);
        self.directedLandingReplyHeaderHtml = ko.observable('');
        self.directedLandingReplyMessageHtml = ko.observable('');

        self.IsAncillary = ko.observable(false);
        self.currentAncSearch = ko.observable('');

        FindPlansViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
            self.inlineErrorsExist(false);
            self.inlineErrors([]);
        };

        FindPlansViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
            self.inlineErrorsExist(true);
            var errorList = self.inlineErrors();
            errorList.push(inlineErrorStr);
            self.inlineErrors(errorList);
            return self;
        };

        FindPlansViewModel.prototype.loadFromJSON = function loadFromJSON(findPlans) {
            var protoself = this;

            protoself.foundPlans_lbl(findPlans.FindPlans_Lbl);
            protoself.weFoundXPlans_lbl(findPlans.WeFoundXPlans_Lbl);
            protoself.instructions_lbl(findPlans.Instructions_Lbl);
            protoself.question_lbl(findPlans.Question_Lbl);

            protoself.userZip_lbl(findPlans.UserZip_Lbl);
            protoself.userZip_tb(findPlans.UserZip_Tb);
            if (location.href.indexOf("othercoverage") > -1)
                protoself.coverageBegins_options(findPlans.AncCoverageBegins_Options);
            else if(location.href.indexOf("dental") > -1)
                protoself.coverageBegins_options(findPlans.AncCoverageBegins_Options);
            else if(location.href.indexOf("vision") > -1)
                protoself.coverageBegins_options(findPlans.AncCoverageBegins_Options);
            else
                protoself.coverageBegins_options(findPlans.CoverageBegins_Options);

            protoself.productTypes_options(findPlans.ProductTypes_Options);

            protoself.coverageBegins_lbl(findPlans.CoverageBegins_Lbl);
            protoself.coverageBegins_tb(findPlans.CoverageBegins_Tb);
           
            protoself.dateOfBirth_lbl(findPlans.DateOfBirth_Lbl);
            protoself.isGenderMale_lbl(findPlans.IsGenderMale_Lbl);
            protoself.isGenderMale_Male_lbl(findPlans.IsGenderMale_Male_Lbl);
            protoself.isGenderMale_Female_lbl(findPlans.IsGenderMale_Female_Lbl);
            protoself.isGenderMale_radio(findPlans.IsGenderMale_Radio);

            protoself.isTobaccoUser_lbl(findPlans.IsTobaccoUser_Lbl);
            protoself.isTobaccoUser_Yes_lbl(findPlans.IsTobaccoUser_Yes_Lbl);
            protoself.isTobaccoUser_No_lbl(findPlans.IsTobaccoUser_No_Lbl);
            protoself.isTobaccoUser_radio(findPlans.IsTobaccoUser_Radio);

            protoself.isDisabled_lbl(findPlans.IsDisabled_Lbl);
            protoself.isDisabled_Yes_lbl(findPlans.IsDisabled_Yes_Lbl);
            protoself.isDisabled_No_lbl(findPlans.IsDisabled_No_Lbl);
            protoself.isDisabled_radio(findPlans.IsDisabled_Radio);

            protoself.isKidneyFailure_lbl(findPlans.IsKidneyFailure_Lbl);
            protoself.isKidneyFailure_Yes_lbl(findPlans.IsKidneyFailure_Yes_Lbl);
            protoself.isKidneyFailure_No_lbl(findPlans.IsKidneyFailure_No_Lbl);
            protoself.isKidneyFailure_radio(findPlans.IsKidneyFailure_Radio);

            protoself.startOverBtn_lbl(findPlans.StartOverBtn_Lbl);
            protoself.answerToProceed_lbl(findPlans.AnswerToProceed_Lbl);
            protoself.seePlansPrices_lbl(findPlans.SeePlansPrices_Lbl);

            protoself.inlineErrorsWereSorry_lbl(findPlans.InlineErrorsWereSorry_lbl);
            protoself.inlineErrorsBody_lbl(findPlans.InlineErrorsBody_lbl);

            protoself.selectOne_lbl(findPlans.SelectOne_Lbl);
            protoself.enterCounty_lbl(findPlans.EnterCounty_Lbl);
            protoself.countyList(findPlans.CountyList);
            protoself.countyId(findPlans.CountyId);
            protoself.countyId_boundToSelectValue(findPlans.CountyId);

            protoself.directedLandingReplyHeaderHtml(findPlans.DirectedLandingReplyHeaderHtml);
            protoself.directedLandingReplyMessageHtml(findPlans.DirectedLandingReplyMessageHtml);

            protoself.dateOfBirth.loadFromJSON(findPlans.DateOfBirthViewModel);

            protoself.IsAncillary(findPlans.IsAncillary);

            return protoself;
        };

        FindPlansViewModel.prototype.toJS = function toJS() {
            var protoSelf = this;
            var toReturn = {
                UserZip: protoSelf.userZip_tb(),
                CoverageBegins: protoSelf.coverageBegins_tb(),

                DateOfBirth_Year_Val: protoSelf.dateOfBirth.Year(),
                DateOfBirth_Month_Val: protoSelf.dateOfBirth.Month(),
                DateOfBirth_Day_Val: protoSelf.dateOfBirth.Day(),

                IsGenderMale: protoSelf.isGenderMale_radio(),
                IsTobaccoUser: protoSelf.isTobaccoUser_radio(),
                IsDisabled: protoSelf.isDisabled_radio(),
                IsKidneyFailure: protoSelf.isKidneyFailure_radio(),
                CountyId: protoSelf.countyId(),
                IsAncillary: protoSelf.IsAncillary()
            };

            return toReturn;
        };
    };

} (EXCHANGE, this));



(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.CallUsPopupViewModel = function CallUsPopupViewModel() {
        if (!(this instanceof CallUsPopupViewModel)) {
            return new CallUsPopupViewModel();
        }
        var self = this;

        self.pleaseCallUsText = ko.observable('');
        self.plansNotAvailableText = ko.observable('');
        self.noPlansErrorText = ko.observable('');
        self.errorText = ko.observable('');
        self.callUsText = ko.observable('');
        self.otherOptionsText = ko.observable('');
        self.requestCallBackLinkText = ko.observable('');
        self.chatLinkText = ko.observable('');
        self.emailHelpLinkText = ko.observable('');
        self.goBack = ko.observable('');
        self.home = ko.observable('');
        self.moreHelp = ko.observable('');
        self.continueSearching = ko.observable('');

        // not populated from server
        self.isWarningPopup = ko.observable(false);

        CallUsPopupViewModel.prototype.setErrorText = function loadFromJSON(errText) {
            self.errorText(errText);

            return self;
        };

        CallUsPopupViewModel.prototype.setNoPlansErrorText = function loadFromJSON() {
            var error = self.noPlansErrorText();
            if (error.indexOf("popup:") != -1) {
                var errorString = error.substring(error.indexOf("popup:") + "popup:".length);
                var errorStr = "<p>" + errorString + "</p>";
            }
            else {
                var errorStr = self.errorText();
            }
            self.errorText(errorStr);

            return self;
        };

        CallUsPopupViewModel.prototype.loadFromJSON = function loadFromJSON(getHelp) {
            self.pleaseCallUsText(getHelp.PleaseCallUsText);
            self.plansNotAvailableText(getHelp.PlansNotAvailableText);
            self.noPlansErrorText(getHelp.NoPlansErrorText);
            self.errorText(getHelp.ErrorText);
            self.callUsText(getHelp.CallUsText);
            self.otherOptionsText(getHelp.OtherOptionsText);
            self.requestCallBackLinkText(getHelp.RequestCallBackLinkText);
            self.chatLinkText(getHelp.ChatLinkText);
            self.emailHelpLinkText(getHelp.EmailHelpLinkText);
            self.goBack(getHelp.GoBack);
            self.home(getHelp.Home);
            self.moreHelp(getHelp.MoreHelp);
            self.continueSearching(getHelp.ContinueSearching);

            return self;
        };

        return self;
    };

} (EXCHANGE, this));
