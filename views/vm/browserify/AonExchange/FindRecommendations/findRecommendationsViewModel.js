(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.findRecommendationsViewModel = function findRecommendationsViewModel() {
        if (!(this instanceof findRecommendationsViewModel)) {
            return new findRecommendationsViewModel();
        }
        var self = this;

        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);
        self.coverageAnswer = ko.observable('0');
        self.rxOptOutAnswer = ko.observable();
        self.physOptOutAnswer = ko.observable();
        self.doneLoading = ko.observable(false);
        self.currentTab = ko.observable(0);
        findRecommendationsViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
            self.inlineErrorsExist(false);
            self.inlineErrors([]);
        };

        findRecommendationsViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
            self.inlineErrorsExist(true);
            var errorList = self.inlineErrors();
            errorList.push(inlineErrorStr);
            self.inlineErrors(errorList);
            return self;
        };

        findRecommendationsViewModel.prototype.loadFromJSON = function loadFromJSON(findRecommendations) {
            var protoself = this;
            protoself.coverageAnswer(findRecommendations.recommendedCoverageAnswer);
            protoself.physOptOutAnswer(findRecommendations.DoctorOptOut);
            protoself.rxOptOutAnswer(findRecommendations.RxOptOut);
//            app.viewModels.SearchResultsViewModel.tab0.allPlans(findRecommendations.sPlanLists[0]);
            app.viewModels.UtilisationViewModel.loadFromJSON(findRecommendations.UtilizationClientViewModelViewModel);
            /*
            if (app.viewModels.findRecommendationsViewModel.physOptOutAnswer() === true) {
            $('input:radio[name="PwPhysOptOut"][value=false]').attr('checked', true);
            }
            */
            protoself.doneLoading(true);
            return protoself;
        };
        /*
        findRecommendationsViewModel.prototype.toJS = function toJS() {
        var protoSelf = this;
        var toReturn = {
        UserZip: protoSelf.userZip_tb(),
        };

        return toReturn;
        };*/
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

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.NDCNotRecPopupViewModel = function NDCNotRecPopupViewModel() {
        if (!(this instanceof NDCNotRecPopupViewModel)) {
            return new NDCNotRecPopupViewModel();
        };
        var self = this;  
        self.NdcHeader_Html = ko.observable('');
        self.Content_Html = ko.observable('');
        self.ContinueBtn_Html = ko.observable('');
               
        NDCNotRecPopupViewModel.prototype.loadFromJSON = function loadFromJSON(ndc) {
            var protoself = this;
            protoself.NdcHeader_Html(ndc.NdcHeader_Html);
            protoself.Content_Html(ndc.Content_Html);
            protoself.ContinueBtn_Html(ndc.ContinueBtn_Html);                       
            return protoself;
        };
        return self;
      
    };

} (EXCHANGE, this));

