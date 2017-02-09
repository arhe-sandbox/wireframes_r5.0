(function (app) {
    var ns = app.namespace("EXCHANGE.models");

    ns.ApplicationPlanTileViewModel = function ApplicationPlanTileViewModel() {
        if (!(this instanceof ApplicationPlanTileViewModel)) {
            return new ApplicationPlanTileViewModel();
        }
        var self = this;

        self.planModel = ko.observable({});
        self.planIdText = ko.observable();
        self.coverageText = ko.observable('');
        self.displayPremiumAsterisk = ko.observable('');
        self.premiumAsteriskHtml = ko.observable('');
        self.showPremiumUpdatedAlert = ko.observable('');
        self.premiumUpdatedText = ko.observable('');
        self.blankAppIntent = ko.observable(false);
        self.blankTemplateDefined = ko.observable(false);
        //self.activityValidation = ko.observable(true);
        self.activityValidation = ko.computed({
            read: function () {
                if (app.viewModels.OverviewViewModel) {
                    var overViewInError = app.viewModels.OverviewViewModel.isInError();
                    if (overViewInError) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            },
            owner: this
        });

        self.frequency_lbl = ko.computed({
            read: function () {
                var frequency = self.planModel().frequencyPremium;
                if (frequency >= app.enums.PremiumFrequency.length) {
                    return '';
                } else {
                    return app.viewModels.PlanSharedResourceStrings.planPremiumFrequency_lbls[frequency] + ' ' + app.viewModels.PlanSharedResourceStrings.premium_lbl;
                }
            },
            owner: this
        });

        self.planIdTextDisplay = ko.computed({
            read: function () {
                if (self.planIdText()) {
                    return self.planIdText().format(self.planModel().planId);
                }
                return '';
            },
            owner: this
        });




        ApplicationPlanTileViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;
            var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel(serverViewModel.PlanModel.PlanType);
            var planModel = planSRVM.loadFromPlanDomainEntity(serverViewModel.PlanModel);

            protoself.planModel(planModel);
            protoself.blankTemplateDefined(serverViewModel.BlankTemplateDefined);
            protoself.blankAppIntent(serverViewModel.BlankAppIntent);
            protoself.planIdText(serverViewModel.PlanIdText);
            protoself.coverageText(serverViewModel.CoverageText);
            protoself.displayPremiumAsterisk(serverViewModel.DisplayPremiumAsterisk);
            protoself.premiumAsteriskHtml(serverViewModel.PremiumAsteriskHtml);
            protoself.showPremiumUpdatedAlert(serverViewModel.ShowPremiumUpdatedAlert);
            protoself.premiumUpdatedText(serverViewModel.PremiumUpdatedText);
            return protoself;
        };


        return self;
    };
} (EXCHANGE));
