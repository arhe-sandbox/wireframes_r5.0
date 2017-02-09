(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CommunicationRestrictionsViewModel = function CommunicationRestrictionsViewModel() {
        if (!(this instanceof CommunicationRestrictionsViewModel)) {
            return new CommunicationRestrictionsViewModel();
        }
        var self = this;

        self.isVMLoaded = ko.observable(false);
        self.commRestrictions_hdr = ko.observable('');
        self.isOkToCall = ko.observable(true);
        self.isOkToEmail = ko.observable(true);
        self.isOkToMail = ko.observable(true);

        self.callRadio = ko.observable(true);
        self.emailRadio = ko.observable(true);
        self.mailRadio = ko.observable(true);
        self.loadRadiosFromBools = function loadRadiosFromBools() {
            self.callRadio(self.isOkToCall() ? true : false);
            self.emailRadio(self.isOkToEmail() ? true : false);
            self.mailRadio(self.isOkToMail() ? true : false);
        }
        self.updateCommRestrictions = function () {
            self.isOkToCall(self.callRadio() === true);
            self.isOkToEmail(self.emailRadio() === true);
            self.isOkToMail(self.mailRadio() === true);
        };        

        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');
        self.inlineErrorsExistCommPref = ko.observable(false);
        self.inlineErrorsCommPref = ko.observableArray([]);


        CommunicationRestrictionsViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.commRestrictions_hdr(viewModel.CommRestrictions_Hdr);
            protoSelf.isOkToCall(viewModel.IsOkToCall);
            protoSelf.isOkToEmail(viewModel.IsOkToEmail);
            protoSelf.isOkToMail(viewModel.IsOkToMail);

            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBody_Lbl);

            protoSelf.isVMLoaded(true);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));