(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.ApplicationReviewViewModel = function ApplicationReviewViewModel() {
        if (!(this instanceof ApplicationReviewViewModel)) {
            return new ApplicationReviewViewModel();
        }
        var self = this;
        self.allAppPages = ko.observableArray([]);
        self.showInformationEligibilitySections = ko.observable(false);

        self.isLoaded = ko.observable(false);

        self.pleaseReviewHead_lbl = ko.observable('');
        self.pleaseReviewBody_lbl = ko.observable('');
        self.finishedReviewing_lbl = ko.observable('');
        self.submitBtn_lbl = ko.observable('');
        self.profileBasics_lbl = ko.observable('');
        self.DOB_lbl = ko.observable('');
        self.gender_lbl = ko.observable('');
        self.zip_lbl = ko.observable('');
        self.county_lbl = ko.observable('');
        self.tobacco_lbl = ko.observable('');
        self.disabled_lbl = ko.observable('');
        self.beginDate_lbl = ko.observable('');
        self.changeTitle_lbl = ko.observable('');
        self.changeBody_lbl = ko.observable('');
        self.changeBtn_lbl = ko.observable('');
        self.yourProfileInfo_lbl = ko.observable('');
        self.profileSSOMessage1_lbl = ko.observable('');
        self.profileSSOMessage2_lbl = ko.observable('');
        self.yourEligibility_lbl = ko.observable('');
        self.appDetails_lbl = ko.observable('');

        self.profDOB = ko.observable('');
        self.profGender = ko.observable('');
        self.profZip = ko.observable('');
        self.profCounty = ko.observable('');
        self.profTobacco = ko.observable('');
        self.profDisabled = ko.observable('');
        self.profBeginDate = ko.observable('');

        self.startOver_lbl = ko.observable('');

        ApplicationReviewViewModel.prototype.loadFromJSON = function loadFromJSON(serverModel) {
            var protoSelf = this;

            $.each(serverModel.AllPages, function (index, item) {
                var appPageViewModel = new app.models.ApplicationPageViewModel();
                appPageViewModel.loadFromJSON(item, serverModel.ShowInternalOnlyQuestions);
                appPageViewModel.isReview(true);
                protoSelf.allAppPages.push(appPageViewModel);
            });

            protoSelf.pleaseReviewHead_lbl(serverModel.PleaseReviewHead_Lbl);
            protoSelf.pleaseReviewBody_lbl(serverModel.PleaseReviewBody_Lbl);
            protoSelf.finishedReviewing_lbl(serverModel.FinishedReviewing_Lbl);
            protoSelf.submitBtn_lbl(serverModel.SubmitBtn_Lbl);
            protoSelf.yourProfileInfo_lbl(serverModel.YourProfileInfo_Lbl);
            protoSelf.profileSSOMessage1_lbl(serverModel.ProfileSSOMessage1_Lbl);
            protoSelf.profileSSOMessage2_lbl(serverModel.ProfileSSOMessage2_Lbl);
            protoSelf.profileBasics_lbl(serverModel.ProfileBasics_Lbl);
            protoSelf.DOB_lbl(serverModel.DOB_Lbl);
            protoSelf.gender_lbl(serverModel.Gender_Lbl);
            protoSelf.zip_lbl(serverModel.Zip_Lbl);
            protoSelf.county_lbl(serverModel.County_Lbl);
            protoSelf.tobacco_lbl(serverModel.Tobacco_Lbl);
            protoSelf.disabled_lbl(serverModel.Disabled_Lbl);
            protoSelf.beginDate_lbl(serverModel.BeginDate_Lbl);
            protoSelf.changeTitle_lbl(serverModel.ChangeTitle_Lbl);
            protoSelf.changeBody_lbl(serverModel.ChangeBody_Lbl);
            protoSelf.changeBtn_lbl(serverModel.ChangeBtn_Lbl);
            protoSelf.yourEligibility_lbl(serverModel.YourEligibility_Lbl);
            protoSelf.appDetails_lbl(serverModel.AppDetails_Lbl);

            protoSelf.profDOB(serverModel.DOB);
            protoSelf.profGender(serverModel.Gender);
            protoSelf.profZip(serverModel.Zip);
            protoSelf.profCounty(serverModel.County);
            protoSelf.profTobacco(serverModel.Tobacco);
            protoSelf.profDisabled(serverModel.Disabled);
            protoSelf.profBeginDate(serverModel.BeginDate);

            protoSelf.startOver_lbl(serverModel.StartOver_Lbl);

            protoSelf.isLoaded(true);

            return protoSelf;
        };

        return self;
    };

    ko.bindingHandlers.cssClass = {
        update: function (element, valueAccessor) {
            if (element['__ko__previousClassValue__']) {
                $(element).removeClass(element['__ko__previousClassValue__']);
            }
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).addClass(value);
            element['__ko__previousClassValue__'] = value;
        }
    };

    ko.bindingHandlers.setCurrentDiv = {
        update: function (element) {
            if (!(typeof app.application.itemCountInCurrentDiv === 'undefined') && app.application.itemCountInCurrentDiv === 0) {
               // $(element).parent().remove();
            }
            app.application.currentDiv = $(element).prev();
            app.application.itemCountInCurrentDiv = 0;
        }
    };

    ko.bindingHandlers.addToCurrentDiv = {
        update: function (element) {
            var toAdd = $(element).prev();
            if (toAdd.find($(app.application.currentDiv)).length === 0) {
                app.application.itemCountInCurrentDiv++;
            }
        }
    };

} (EXCHANGE, jQuery));