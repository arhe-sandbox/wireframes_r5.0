(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DirectedLandingBasicInfoViewModel = function DirectedLandingBasicInfoViewModel() {
        if (!(this instanceof DirectedLandingBasicInfoViewModel)) {
            return new DirectedLandingBasicInfoViewModel();
        }
        var self = this;

        self.NameLbl = ko.observable('');
        self.FirstNameHintLbl = ko.observable('');
        self.LastNameHintLbl = ko.observable('');
        self.PhoneNumberLbl = ko.observable('');
        self.PhoneNumberHintLbl = ko.observable('');
        self.EmailLbl = ko.observable('');
        self.ZipCodeLbl = ko.observable('');

        self.FirstName = ko.observable('');
        self.LastName = ko.observable('');
        self.PhoneNumber = ko.observable('');
        self.Email = ko.observable('');
        self.ZipCode = ko.observable('');

        self.Errors = ko.observableArray([]);
        self.HasErrors = ko.computed({
            read: function () {
                return self.Errors().length > 0;
            }, owner: this
        });
        self.InlineErrorsHeaderLbl = ko.observable('');
        self.InlineErrorsBodyLbl = ko.observable('');


        DirectedLandingBasicInfoViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoSelf = this;

            protoSelf.NameLbl(serverViewModel.NameLbl);
            protoSelf.FirstNameHintLbl(serverViewModel.FirstNameHintLbl);
            protoSelf.LastNameHintLbl(serverViewModel.LastNameHintLbl);
            protoSelf.PhoneNumberLbl(serverViewModel.PhoneNumberLbl);
            protoSelf.PhoneNumberHintLbl(serverViewModel.PhoneNumberHintLbl);
            protoSelf.EmailLbl(serverViewModel.EmailLbl);
            protoSelf.ZipCodeLbl(serverViewModel.ZipCodeLbl);
            protoSelf.InlineErrorsHeaderLbl(serverViewModel.InlineErrorsHeaderLbl);
            protoSelf.InlineErrorsBodyLbl(serverViewModel.InlineErrorsBodyLbl);
        };

    };

} (EXCHANGE, this));