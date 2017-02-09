(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.ErrorViewModel = function ErrorViewModel() {
        if (!(this instanceof ErrorViewModel)) {
            return new ErrorViewModel();
        }

        var self = this;
        self.header_lbl = ko.observable('');
        self.subHeader_lbl = ko.observable('');
        self.contact = ko.observable('');
        self.errorCode_lbl = ko.observable('');
        self.closeButton_lbl = ko.observable('');
        self.errorDescription_lbl = ko.observable('');
        self.recommendedAction_lbl = ko.observable('');
        self.ContactAgent = ko.observable('');

        self.errorCode = ko.observable('');
        self.userDisplayMessage = ko.observable('');
        self.exceptionStackTrace = ko.observable('');
        self.errorDescription = ko.observable('');
        self.recommendedAction = ko.observable('');

        self.hasBeenLoaded = false;

        ErrorViewModel.prototype.loadFromAjax = function loadFromAjax(error) {
            var protoself = this;
            if (error != undefined && error != '') {
                protoself.errorCode(error.ErrorCode);
                protoself.userDisplayMessage(error.UserDisplayMessage);
                protoself.exceptionStackTrace(error.ExceptionStackTrace);
                protoself.errorDescription(error.ErrorDescription);
                protoself.recommendedAction(error.RecommendedAction);
            }

            return protoself;
        };

        ErrorViewModel.prototype.loadFromJSON = function loadFromJSON(errorViewModel) {
            var protoself = this;

            protoself.header_lbl(errorViewModel.Header_Lbl);
            protoself.subHeader_lbl(errorViewModel.SubHeader);
            protoself.contact(errorViewModel.Contact);
            protoself.errorCode_lbl(errorViewModel.ErrorCode_Lbl);
            protoself.closeButton_lbl(errorViewModel.CloseButton_Lbl);
            protoself.errorDescription_lbl(errorViewModel.ErrorDescription_lbl);
            protoself.recommendedAction_lbl(errorViewModel.RecommendedAction_lbl);
            protoself.ContactAgent(errorViewModel.ContactAgent);
            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));
