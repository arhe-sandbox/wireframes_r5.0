
(function (app, global) {
    var ns = app.namespace('EXCHANGE.models');

    ns.SupplementsViewModel = function SupplementsViewModel() {
        if (!(this instanceof SupplementsViewModel)) {
            return new SupplementsViewModel();
        }
        var self = this;

        self.availability = ko.observable(0);
        self.formattedPremium = ko.observable("");
        self.frequency = ko.observable(2);
        self.id = ko.observable("");
        self.name = ko.observable("");
        self.planType = ko.observable(0);
        self.premium = ko.observable(0);
        self.sequence = ko.observable(0);
        self.planId = ko.observable("");

        self.isOptional = ko.computed({
            read: function () {
                return self.availability() === app.enums.SupplementAvailabilityEnum.OPTIONAL;
            },
            deferEvaluation: true,
            owner: this
        });

        self.isIncluded = ko.computed({
            read: function () {
                return self.availability() === app.enums.SupplementAvailabilityEnum.INCLUDED;
            },
            deferEvaluation: true,
            owner: this
        });

        self.frequencyAlternate_lbl = ko.computed({
            read: function () {
                var frequency = self.frequency();
                if (frequency >= app.enums.PremiumFrequency.length) {
                    return '';
                } else {
                    return app.viewModels.PlanSharedResourceStrings.supplementFrequencyAlternate_lbls()[frequency];
                }
            },
            owner: this
        });

        SupplementsViewModel.prototype.loadFromJSON = function loadFromJSON(supplementsViewModel, planId) {
            var protoSelf = this;
            self.availability(supplementsViewModel.Availability);
            self.formattedPremium(supplementsViewModel.FormattedPremium);
            self.frequency(supplementsViewModel.Frequency);
            self.id(supplementsViewModel.Id);
            self.name(supplementsViewModel.Name);
            self.planType(supplementsViewModel.PlanType);
            self.premium(supplementsViewModel.Premium);
            self.sequence(supplementsViewModel.Sequence);
            self.planId(planId);

            return protoSelf;
        };

        return self;

    };

} (EXCHANGE, this));


