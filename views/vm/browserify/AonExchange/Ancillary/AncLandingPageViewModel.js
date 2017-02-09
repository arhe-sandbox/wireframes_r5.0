(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.AncLandingPageViewModel = function AncLandingPageViewModel() {
        if (!(this instanceof AncLandingPageViewModel)) {
            return new AncLandingPageViewModel();
        }
        var self = this;

        self.PlanTextLbl = ko.observable('');
        self.PerMonthLbl = ko.observable('');
        self.DentalLbl = ko.observable('');
        self.VisionLbl = ko.observable('');
        self.LowestPremiumDental = ko.observable('');
        self.LowestPremiumVision = ko.observable('');

        AncLandingPageViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.PlanTextLbl(viewModel.PlanTextLbl);
            protoSelf.PerMonthLbl(viewModel.PerMonthLbl);
            protoSelf.DentalLbl(viewModel.DentalLbl);
            protoSelf.VisionLbl(viewModel.VisionLbl);

            var roundupLowestPremiumDental = Math.ceil(viewModel.LowestPremiumDental);
            protoSelf.LowestPremiumDental(roundupLowestPremiumDental);

            var roundupLowestPremiumVision = Math.ceil(viewModel.LowestPremiumVision);
            protoSelf.LowestPremiumVision(roundupLowestPremiumVision);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE));
