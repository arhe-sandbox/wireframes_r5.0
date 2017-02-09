(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.ComparisonLimitViewModel = function ComparisonLimitViewModel() {
        if (!(this instanceof ComparisonLimitViewModel)) {
            return new ComparisonLimitViewModel();
        }
        var self = this;

        self.title = ko.observable('');
        self.selected3PlansHead_lbl = ko.observable('');
        self.selected3PlansBody_lbl = ko.observable('');
        self.goBackBtn_lbl = ko.observable('');
        self.selectPlans_lbl = ko.observable('');
        self.selected3PlansBody_lbl_formatted = ko.computed({
            read: function () {
                if (self.selectPlans_lbl() && app.viewModels.SearchResultsViewModel
                        && app.viewModels.SearchResultsViewModel.currentTabIndex) {
                    if (app.viewModels.RecResultsViewModel != undefined) {
                        if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                            return self.selected3PlansBody_lbl().format(app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE);
                        } else if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.MEDIGAP) {
                            return self.selected3PlansBody_lbl().format(app.enums.PlanTypeNameEnum.MEDIGAP);
                        } else if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                            return self.selected3PlansBody_lbl().format(app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG);
                        } else {
                            return self.selected3PlansBody_lbl();
                        }
                    }
                    else {
                        if (app.viewModels.SearchResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                            return self.selected3PlansBody_lbl().format(app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE);
                        } else if (app.viewModels.SearchResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.MEDIGAP) {
                            return self.selected3PlansBody_lbl().format(app.enums.PlanTypeNameEnum.MEDIGAP);
                        } else if (app.viewModels.SearchResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                            return self.selected3PlansBody_lbl().format(app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG);
                        } else {
                            return self.selected3PlansBody_lbl();
                        }
                    }
                }
                else {
                    return '';
                }

            },
            owner: this
        });

        ComparisonLimitViewModel.prototype.loadFromJSON = function loadFromJSON(params) {
            var protoSelf = this;

            protoSelf.title(params.Title);
            protoSelf.selected3PlansHead_lbl(params.Selected3PlansHeadLbl);
            protoSelf.selected3PlansBody_lbl(params.Selected3PlansBodyLbl);
            protoSelf.goBackBtn_lbl(params.GoBackBtnLbl);
            protoSelf.selectPlans_lbl(params.SelectPlansLbl);

            return protoSelf;
        };

    };

} (EXCHANGE, this));

