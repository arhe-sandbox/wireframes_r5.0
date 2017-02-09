(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.StopEnrollmentPopupViewModel = function StopEnrollmentPopupViewModel() {
        if (!(this instanceof StopEnrollmentPopupViewModel)) {
            return new StopEnrollmentPopupViewModel();
        }
        var self = this;

        self.errorText = ko.observable('');
        self.callUsText = ko.observable('');
        self.otherOptionsText = ko.observable('');
        self.requestCallBackLinkText = ko.observable('');
        self.chatLinkText = ko.observable('');
        self.emailHelpLinkText = ko.observable('');
        self.goBack = ko.observable('');
        self.moreHelp = ko.observable('');
        self.headerFormatted_lbl = ko.observable('');

        StopEnrollmentPopupViewModel.prototype.loadFromJSON = function loadFromJSON(stopEnrollment) {
            self.callUsText(stopEnrollment.CallUsText);
            self.otherOptionsText(stopEnrollment.OtherOptionsText);
            self.requestCallBackLinkText(stopEnrollment.RequestCallBackLinkText);
            self.chatLinkText(stopEnrollment.ChatLinkText);
            self.emailHelpLinkText(stopEnrollment.EmailHelpLinkText);
            self.goBack(stopEnrollment.GoBack);
            self.moreHelp(stopEnrollment.MoreHelp);
            self.headerFormatted_lbl(stopEnrollment.headerFormatted_lbl);
            return self;
        };

        return self;
    };

} (EXCHANGE));