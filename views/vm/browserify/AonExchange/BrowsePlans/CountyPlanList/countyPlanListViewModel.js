;
(function (app) {
    var ns = app.namespace("EXCHANGE.models");

    ns.CountyPlanListViewModel = function CountyPlanListViewModel() {
        if (!(this instanceof CountyPlanListViewModel)) {
            return new CountyPlanListViewModel();
        }

        var self = this;

        self.allPlans = ko.observableArray([]);
        
        self.ShowPremiumLbl = ko.observable("");
        self.MaxPlanNumber = ko.observable(5);
        self.CountyName = ko.observable("");
        self.StateAbbreviation = ko.observable("");
        self.ShowingSubsetBase = ko.observable("");
        self.ShowingAllBase = ko.observable("");
        self.ShowAllLbl = ko.observable("");

        self.showAll = ko.observable(false);

        self.maxPlanNumberComputed = ko.computed({
            read: function() {
                var numberOfPlans = self.allPlans().length;
                var max = self.MaxPlanNumber();

                return max < numberOfPlans ? max : numberOfPlans;
            },
            owner: this,
            deferEvaluation: true
        });
        
        self.displayPlans = ko.computed({
            read: function() {
                if (self.showAll()) {
                    return self.allPlans();
                } else {
                    var plans = [];
                    for (var i = 0; i < self.maxPlanNumberComputed(); i++) {
                        plans.push(self.allPlans()[i]);
                    }

                    return plans;
                }
            },
            owner: this,
            deferEvaluation: true
        });

        self.showingSubest_lbl = ko.computed({
            read: function() {
                return self.ShowingSubsetBase().format(self.maxPlanNumberComputed(), self.allPlans().length, self.CountyName(), self.StateAbbreviation());
            },
            owner: this,
            deferEvaluation: true
        });

        self.showingAll_lbl = ko.computed({
            read: function() {
                return self.ShowingAllBase().format(self.allPlans().length, self.CountyName(), self.StateAbbreviation());
            },
            owner: this,
            deferEvaluation: true
        });

        CountyPlanListViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoSelf = this;
            protoSelf.ShowPremiumLbl(serverViewModel.ShowPremiumLbl);
            protoSelf.MaxPlanNumber(serverViewModel.MaxPlanNumber);
            protoSelf.ShowingSubsetBase(serverViewModel.ShowingSubsetBase);
            protoSelf.ShowingAllBase(serverViewModel.ShowingAllBase);
            protoSelf.ShowAllLbl(serverViewModel.ShowAllLbl);
            return protoSelf;
        };

        return self;
    };

} (EXCHANGE));