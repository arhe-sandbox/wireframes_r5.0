(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.ApplicationStateViewModel = function ApplicationStateViewModel() {
        if (!(this instanceof ApplicationStateViewModel)) {
            return new ApplicationStateViewModel();
        }
        var self = this;

        self.CurrentApplicationPage = {};
        self.Addresses = {};
        self.People = {};
        self.CurrentDisplayPageType = ko.observable(app.enums.ApplicationDisplayPageType.Overview);
        self.CameFromReviewPage = ko.observable(false);
        self.ValidationResult = {};
        self.CurrentPlanTypeName = ko.observable("");
        self.PreviousPlanTypeName = ko.observable("");
        self.ShowCompletedMessage = ko.observable(false);
        self.ScrollToId = ko.observable("");
        self.ShowInternalOnlyQuestions = ko.observable(false);

        ApplicationStateViewModel.prototype.loadFromJSON = function loadFromJSON(serverModel) {
            var protoSelf = this;

            protoSelf.CurrentApplicationPage = serverModel.CurrentApplicationPage;
            protoSelf.Addresses = serverModel.Addresses;
            protoSelf.People = serverModel.People;
            protoSelf.CurrentDisplayPageType(serverModel.CurrentDisplayPageType);
            protoSelf.CameFromReviewPage(serverModel.CameFromReviewPage);
            protoSelf.ValidationResult = serverModel.ValidationResult;
            protoSelf.CurrentPlanTypeName(serverModel.CurrentPlanTypeName);
            protoSelf.PreviousPlanTypeName(serverModel.PreviousPlanTypeName);
            protoSelf.ShowCompletedMessage(serverModel.ShowCompletedMessage);
            protoSelf.ScrollToId(serverModel.ScrollToId);
            protoSelf.ShowInternalOnlyQuestions(serverModel.ShowInternalOnlyQuestions);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE, jQuery));
