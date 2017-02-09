(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.Pre65AccountMyCoverageViewModel = function Pre65AccountMyCoverageViewModel() {
        if (!(this instanceof Pre65AccountMyCoverageViewModel)) {
            return new Pre65AccountMyCoverageViewModel();
        }
        var self = this;
        
        self.EmployerCoverages = ko.observableArray([]);
        self.ActiveCoverages = ko.observableArray([]);
        self.PendingCoverages = ko.observableArray([]);
        self.InActiveCoverages = ko.observableArray([]);

        self.pre65MyCoveragesHeader_lbl = ko.observable('');
        self.pre65MyEmployerCoverage_lbl = ko.observable('');
        self.pre65PendingEnrollments_lbl = ko.observable('');
        self.pre65ActiveCoverage_lbl = ko.observable('');
        self.pre65NoActiveCoverage_lbl = ko.observable('');
        self.pre65InActiveCoverage_lbl = ko.observable('');


        Pre65AccountMyCoverageViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.EmployerCoverages(viewModel.EmployerCoverages);
            protoSelf.ActiveCoverages(viewModel.ActiveCoverages);
            protoSelf.PendingCoverages(viewModel.PendingCoverages);
            protoSelf.InActiveCoverages(viewModel.InActiveCoverages);

            protoSelf.pre65MyCoveragesHeader_lbl(viewModel.Pre65MyCoveragesHeader_lbl);
            protoSelf.pre65MyEmployerCoverage_lbl(viewModel.Pre65MyEmployerCoverage_lbl);
            protoSelf.pre65PendingEnrollments_lbl(viewModel.Pre65PendingEnrollments_lbl);
            protoSelf.pre65ActiveCoverage_lbl(viewModel.Pre65ActiveCoverage_lbl);
            protoSelf.pre65NoActiveCoverage_lbl(viewModel.Pre65NoActiveCoverage_lbl);
            protoSelf.pre65InActiveCoverage_lbl(viewModel.Pre65InActiveCoverage_lbl);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE));
