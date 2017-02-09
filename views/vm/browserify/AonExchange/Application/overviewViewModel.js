(function (app) {
    var ns = app.namespace('EXCHANGE.models');
    ns.plantile_submit = function plantile_submit(guid, template) {
        var self = this;
        self.planid = guid;
        self.blankAppIntent = template;
    };


    ns.OverviewSubmitViewModel = function OverviewSubmitViewModel() {
        if (!(this instanceof OverviewSubmitViewModel)) {
            return new OverviewSubmitViewModel();
        }
        var self = this;
        self.planTilesSubmitViewModel = ko.observableArray([]);
    };

    ns.OverviewViewModel = function OverviewViewModel() {
        if (!(this instanceof OverviewViewModel)) {
            return new OverviewViewModel();
        }
        var self = this;

        self.previousBasePage = ko.observable('');
        self.rightColumnHtml = ko.observable('');
        self.notReadyYetText = ko.observable('');
        self.backToCartText = ko.observable('');
        self.termsOfUseLabel = ko.observable('');
        self.belowPlanTileHtml = ko.observable('');
        self.headerText = ko.observable('');
        self.subHeaderText = ko.observable('');

        self.termsOfUseAccepted = ko.observable(false);

        self.planTileViewModels = ko.observableArray([]);
        self.isInError = ko.observable(false);
        self.errorMessage = ko.observable('');

        OverviewViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.previousBasePage(serverViewModel.PreviousBasePage);
            protoself.rightColumnHtml(serverViewModel.RightColumnHtml);
            protoself.notReadyYetText(serverViewModel.NotReadyYetText);
            protoself.backToCartText(serverViewModel.BackToCartText);
            protoself.termsOfUseLabel(serverViewModel.TermsOfUseLabel);
            protoself.belowPlanTileHtml(serverViewModel.BelowPlanTileHtml);
            protoself.headerText(serverViewModel.HeaderText);
            protoself.subHeaderText(serverViewModel.SubHeaderText);

            var serverPlanTiles = serverViewModel.ApplicationPlanTileViewModels;
            if (serverPlanTiles) {
                $.each(serverPlanTiles, function (index, item) {
                    var planTileViewModel = new app.models.ApplicationPlanTileViewModel();
                    planTileViewModel.loadFromJSON(item);
                    protoself.planTileViewModels.push(planTileViewModel);
                    var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel(item.PlanModel.PlanType);
                    var planModel = planSRVM.loadFromPlanDomainEntity(item.PlanModel);
                    var plantile_submitViewModel = new ns.plantile_submit(planModel.planGuid, false);
                    app.viewModels.OverviewSubmitViewModel.planTilesSubmitViewModel.push(plantile_submitViewModel);
                });
            }

            return protoself;
        };
    };


} (EXCHANGE));