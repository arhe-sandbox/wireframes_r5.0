(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.OptionalCoverageViewModel = function OptionalCoverageViewModel() {
        if (!(this instanceof OptionalCoverageViewModel)) {
            return new OptionalCoverageViewModel();
        }
        var self = this;

        self.title_lbl = ko.observable("");
        self.instructions_lbl = ko.observable("");
        self.baseCoverage_lbl = ko.observable("");
        self.additional_lbl = ko.observable("");
        self.moreInfo_lbl = ko.observable("");
        self.doneBtn_lbl = ko.observable("");
        self.backBtn_lbl = ko.observable("");

        self.selectedSupplements = ko.observableArray([]);

        self.plan = ko.observable(new app.models.PlanSearchResultsViewModel(0));

        self.hasBeenLoaded = false;

        OptionalCoverageViewModel.prototype.loadFromJSON = function loadFromJSON(optCov) {
            var protoSelf = this;

            protoSelf.title_lbl(optCov.Title_Lbl);
            protoSelf.instructions_lbl(optCov.Instructions_Lbl);
            protoSelf.baseCoverage_lbl(optCov.BaseCoverage_Lbl);
            protoSelf.additional_lbl(optCov.Additional_Lbl);
            protoSelf.moreInfo_lbl(optCov.MoreInfo_Lbl);
            protoSelf.doneBtn_lbl(optCov.DoneBtn_Lbl);
            protoSelf.backBtn_lbl(optCov.BackBtn_Lbl);

            return protoSelf;
        };

        return self;

    };
} (EXCHANGE));