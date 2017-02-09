;(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.IntelligentSwapViewModel = function IntelligentSwapViewModel() {
        if (!(this instanceof IntelligentSwapViewModel)) {
            return new IntelligentSwapViewModel();
        }
        var self = this;

        self.Header_Lbl = ko.observable('');
		self.GoBack_Lbl = ko.observable('');
		self.BottomBar_Lbl = ko.observable('');
		self.Confirm_Lbl = ko.observable('');
		self.TopBar_Lbl = ko.observable('');

        self.Panels = [app.cart.IntelligentSwapPanel(), app.cart.IntelligentSwapPanel(), app.cart.IntelligentSwapPanel() ];

        IntelligentSwapViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            protoself.Header_Lbl(serversideViewModel.Header_Lbl);
            protoself.GoBack_Lbl(serversideViewModel.GoBack_Lbl);
            protoself.BottomBar_Lbl(serversideViewModel.BottomBar_Lbl);
            protoself.Confirm_Lbl(serversideViewModel.Confirm_Lbl);
		    protoself.TopBar_Lbl(serversideViewModel.TopBar_Lbl);

            $.each(serversideViewModel.Panels, function(index, item) {
                var panel = protoself.Panels[index].loadFromJSON(item);
                protoself.Panels.push(panel);
            });

            return protoself;
        };

        return self;
    };

} (EXCHANGE));

(function (app) {
    var ns = app.namespace('EXCHANGE.cart');

    ns.IntelligentSwapPanel = function IntelligentSwapPanel() {
        if (!(this instanceof IntelligentSwapPanel)) {
            return new IntelligentSwapPanel();
        }
        var self = this;

        self.PanelType = ko.observable('');

        self.Plan = ko.observable([]);
        self.PlanGuid = ko.observable('');
		self.PlanHeaderText = ko.observable('');
		self.PlanIdText_Lbl = ko.observable('');
        self.PlanIdText = ko.computed({
            read: function () {
                if(self.Plan().planId) {
                    return self.PlanIdText_Lbl().format(self.Plan().planId);
                }
                else {
                    return '';
                }
            },
            owner: this
        });
        
		self.PlanMonthlyPremiumText = ko.observable('');
		self.PlanCMSRatingText = ko.observable('');
		self.PlanMedicalCoverageText = ko.observable('');
		self.PlanDrugCoverageText = ko.observable('');

		self.PromptText = ko.observable('');
		self.ExplanationText = ko.observable('');


        IntelligentSwapPanel.prototype.loadFromJSON = function loadFromJSON(serversidePanel) {
            var protoself = this;

            protoself.PanelType(serversidePanel.PanelType);

            if(protoself.PanelType() == app.enums.PanelTypeEnum.OLDPLAN || protoself.PanelType() == app.enums.PanelTypeEnum.NEWPLAN) {
                protoself.PlanGuid(serversidePanel.PlanGuid);
		        protoself.PlanHeaderText(serversidePanel.PlanHeaderText);
		        protoself.PlanIdText_Lbl(serversidePanel.PlanIdText);
		        protoself.PlanMonthlyPremiumText(serversidePanel.PlanMonthlyPremiumText);
		        protoself.PlanCMSRatingText(serversidePanel.PlanCMSRatingText);
		        protoself.PlanMedicalCoverageText(serversidePanel.PlanMedicalCoverageText);
		        protoself.PlanDrugCoverageText(serversidePanel.PlanDrugCoverageText);

                

                 var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel(serversidePanel.PlanModel.PlanType);
                 var planModel = planSRVM.loadFromPlanDomainEntity(serversidePanel.PlanModel);
                protoself.Plan(planModel);
            }

		    protoself.PromptText(serversidePanel.PromptText);
		    protoself.ExplanationText(serversidePanel.ExplanationText);

            return protoself;
        };

        return self;
    };

} (EXCHANGE));

