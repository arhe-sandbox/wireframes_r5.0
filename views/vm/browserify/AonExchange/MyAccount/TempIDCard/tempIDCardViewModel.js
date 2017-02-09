(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.TempIDCardViewModel = function TempIDCardViewModel() {
        if (!(this instanceof TempIDCardViewModel)) {
            return new TempIDCardViewModel();
        }
        var self = this;
        self.enrollment = ko.observable({});
        self.displayName = ko.observable("");
        self.policyID_lbl = ko.observable("");
        self.effective_lbl = ko.observable("");

        TempIDCardViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.enrollment(viewModel.Enrollment);
            protoSelf.displayName(viewModel.DisplayName);
            protoSelf.policyID_lbl(viewModel.PolicyID_Lbl);
            protoSelf.effective_lbl(viewModel.Effective_Lbl);
            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));