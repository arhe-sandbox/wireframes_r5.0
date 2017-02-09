(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns._planViewModelStartLoad = function _planViewModelStartLoad(planViewModel) {
        planViewModel.tceLoading(true);
        planViewModel.tceLoaded(false);
        planViewModel.planDrugsLoading(true);
        planViewModel.planDrugsLoaded(false);

    };

    ns._planViewModelFinishLoad = function _planViewModelFinishLoad(planViewModel) {
        planViewModel.tceLoading(false);
        planViewModel.tceLoaded(true);


        planViewModel.planDrugsLoading(false);
        planViewModel.planDrugsLoaded(true);
        planViewModel.needNewCoverageCost(false);
    };

    ns.SavedPlans = function SavedPlans() {
        if (!(this instanceof SavedPlans)) {
            return new SavedPlans();
        }
        var self = this;

        self.tabGroups = ko.observableArray([]);
        self.plans = ko.observableArray([]);

        SavedPlans.prototype.loadFromJSON = function loadFromJSON(savedPlans) {
            var protoself = this;

            var tabs = [];
            for (var i = 0; i < 5; i++) {
                var planTypeId = app.viewModels.SavedPlansViewModel && app.viewModels.SavedPlansViewModel.tabOrder().length >= i ? app.viewModels.SavedPlansViewModel.tabOrder()[i] : i;
                var params = { planType: getPlanTypeByIndex(i, planTypeId), planTypeID: planTypeId, tabIndex: i };
                tabs.push(new app.classes.SavedPlansTagGroup(params));
            }
            protoself.tabGroups(tabs);

            if (!savedPlans) return protoself;
            protoself.plans([]);
            var planCostArgs = { PlanIds: [] };

            for (var i = 0; i < savedPlans.length; i++) {

                var planSaved = {
                    PlanId: savedPlans[i].Plan.Id
                };

                if (!app.viewModels.PlanSharedResourceStrings) {
                    app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
                }
                var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel();
                planVm = planSRVM.loadFromPlanDomainEntity(savedPlans[i]);

                //// Update TCE and DRX Id on planVM object from all Plans list
                if (planVm.haveTceData()) {
                    ns._planViewModelStartLoad(planVm);
                    var PlanIdInfo = {};
                    PlanIdInfo.PlanGuid = planVm.planGuid;
                    PlanIdInfo.MedicareContractId = planVm.medicareContractId;
                    PlanIdInfo.MedicarePlanId = planVm.medicarePlanId;
                    PlanIdInfo.MedicareSegmentId = planVm.medicareSegmentId;
                    PlanIdInfo.EffectiveDate = planVm.effectiveDate;

                    planCostArgs.PlanIds.push(PlanIdInfo);
                }
                //// End

                protoself.plans.push(planVm);
                addPlanToSaved(savedPlans[i].PlanId, savedPlans[i].Plan.PlanType);
            }
            //// Update TCE and DRX Id on planVM object from all Plans list
            if (planCostArgs.PlanIds.length > 0) {
                planCostArgs = JSON.stringify(planCostArgs);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/CoverageCost/SearchResultsCoverageCosts",
                    dataType: "json",
                    data: planCostArgs,
                    success: function (planCosts) {
                        $.each(planCosts, function (index, planCost) {

                            var planviewModel = self.plans().find(function (element) {
                                if (element.planGuid == planCost.PlanGuid)
                                    return true;
                                else
                                    return false;
                            });

                            if (undefined != planviewModel) {
                                planviewModel.TCE = planCost.AnnualTotalCost;
                                planviewModel.DRXPlanID = planCost.DRXPlanID;
                                ns._planViewModelFinishLoad(planviewModel);
                            }
                        });

                    },
                    error: function (data) {
                    }
                });
            }
            /*
            var tabs = [];
            for (var i = 0; i < 3; i++) {

            for (var j = 0; j < protoself.plans().length; j++) {
            var planTypeId = protoself.plans()[j].planType;
            var params = { planType: getPlanTypeByIndex(i, planTypeId), planTypeID: planTypeId, tabIndex: i };
            tabs.push(new app.classes.SavedPlansTagGroup(params));
            }
            }
            protoself.tabGroups(tabs);
            */
            return protoself;
        };

        SavedPlans.prototype.addPlan = function addPlan(plan, ajaxCallback) {
            var protoSelf = this;
            var parameters = JSON.stringify({ PlanId: plan.planGuid });
            var buttonElem = $('.save-for-text[data-planid=' + plan.planGuid + ']');
            if (buttonElem.length > 0) {
                EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            }

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/UserProfile/AddToSavedPlans",
                data: parameters,
                dataType: "json",
                success: function (data) {
                    var result = data;
                    if (result) {
                        var planGuid = JSON.parse(this.data).PlanId;
                        //var plan = JSON.parse(this.data).Plan;
                        var planVM;
                        if (EXCHANGE.viewModels.SearchResultsViewModel) {
                            planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planGuid);

                        } if (planVM === undefined && EXCHANGE.viewModels.AncSearchResultsViewModel) {
                            planVM = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);
                        }
                        if (planVM) {
                            planVM.isSaved(true);
                        }
                        var savedPlan = {
                            PlanId: planGuid

                        };
                        //EXCHANGE.user.UserSession.SavedPlans.plans.push(plan);
                        EXCHANGE.user.UserSession.SavedPlans.plans.push(planVM);
                        EXCHANGE.user.UserSession.SavedPlans.tabGroups()[plan.planType].plans.push(planGuid);

                    }
                    if ($.isFunction(ajaxCallback)) {
                        ajaxCallback(result);
                    }
                    if (EXCHANGE.ButtonSpinner) {
                        EXCHANGE.ButtonSpinner.Stop({ textChanged: true });
                    }
                },
                error: function (data) {
                    if (EXCHANGE.ButtonSpinner) {
                        EXCHANGE.ButtonSpinner.Stop();
                    }
                }
            });
        };

        SavedPlans.prototype.removePlan = function removePlan(plan, ajaxCallback) {
            var protoSelf = this;
            var parameters = JSON.stringify({ PlanId: plan.planGuid });
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/UserProfile/RemoveFromSavedPlans",
                data: parameters,
                dataType: "json",
                success: function (data) {
                    var result = data;
                    if (result) {
                        removePlanFromSaved(plan);
                    }
                    if ($.isFunction(ajaxCallback)) {
                        ajaxCallback(result);
                    }
                    refreshPlansView();
                }
            });
        };


        function refreshPlansView() {
            app.user.UserSession.SavedPlans.tabGroups(app.user.UserSession.SavedPlans.tabGroups());
            app.user.UserSession.SavedPlans.plans(app.user.UserSession.SavedPlans.plans());
        }

        function getPlanTypeByIndex(index, planTypeId) {
            if (planTypeId == app.enums.TabEnum.MEDICAREADVANTAGE) {
                return app.enums.TabIdEnum.MEDICAREADVANTAGE;
            } else if (planTypeId == app.enums.TabEnum.MEDIGAP) {
                return app.enums.TabIdEnum.MEDIGAP;
            } else if (planTypeId == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                return app.enums.TabIdEnum.PRESCRIPTIONDRUG;
            } else if (planTypeId == app.enums.PlanTypeNameEnum.DENTAL) {
                return app.enums.PlanTypeNameEnum.DENTAL;
            } else if (planTypeId == app.enums.PlanTypeNameEnum.VISION) {
                return app.enums.PlanTypeNameEnum.VISION;
            }
            return '';
        }

        function addPlanToSaved(planId, planTypeIndex) {
            var tabOrder = app.viewModels.SavedPlansViewModel ? app.viewModels.SavedPlansViewModel.tabOrder() : planTypeIndex;
            for (var i = 0; i < tabOrder.length; i++) {
                if (tabOrder[i] == planTypeIndex) {
                    var found = false;
                    for (var j = 0; j < app.user.UserSession.SavedPlans.tabGroups()[i].plans().length; j++) {
                        if (app.user.UserSession.SavedPlans.tabGroups()[i].plans()[j] == planId) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        app.user.UserSession.SavedPlans.tabGroups()[i].plans.push(planId);

                    }

                }

                var planVM;
                if (EXCHANGE.viewModels.SearchResultsViewModel) {
                    planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planId);
                }
                if (planVM === undefined && EXCHANGE.viewModels.AncSearchResultsViewModel) {
                    planVM = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planId);
                }
                if (planVM) {
                    planVM.isSaved(true);
                }
            }

            if (EXCHANGE.searchResults) {
                EXCHANGE.searchResults.setSavedPlans();
            } else if (EXCHANGE.ancSearchResults) {
                EXCHANGE.ancSearchResults.setSavedPlans();
            }

            //            var planVM = app.plans.AllPlanViewModels[planId];
            //            if (planVM) {
            //                planVM.isSaved(true);
            //                planVM.plan().isSaved = true;
            //            }

        };

        function removePlanFromSaved(plan) {
            var tabOrder = app.viewModels.SavedPlansViewModel ? app.viewModels.SavedPlansViewModel.tabOrder() : planTypeIndex;
            var planTypeIndex = plan.planType;
            var savedPlans = app.user.UserSession.SavedPlans.plans();
            for (var i = 0; i < tabOrder.length; i++) {
                if (tabOrder[i] == planTypeIndex) {
                    var plans = app.user.UserSession.SavedPlans.tabGroups()[i].plans();
                    for (var j = 0; j < plans.length; j++) {
                        if (plans[j] == plan.planGuid) {
                            app.user.UserSession.SavedPlans.tabGroups()[i].plans().splice(j, 1);
                            for (p = 0; p < savedPlans.length; p++) {
                                if (savedPlans[p].planGuid == plan.planGuid) {
                                    app.user.UserSession.SavedPlans.plans().splice(p, 1);
                                    break;
                                }
                            }
                            if (app.viewModels.SearchResultsViewModel) {
                                app.viewModels.SearchResultsViewModel.getPlanByPlanGuid(plan.planGuid).isSaved(false);
                            } else if (app.viewModels.AncSearchResultsViewModel) {
                                app.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(plan.planGuid).isSaved(false);
                            }
                            return;
                        }
                    }
                }
            }

        }

        return self;
    };
})(EXCHANGE);

(function (app) {
    var ns = app.namespace('EXCHANGE.classes');

    ns.SavedPlansTagGroup = function SavedPlansTagGroup(params) {
        if (!(this instanceof SavedPlansTagGroup)) {
            return new SavedPlansTagGroup(params);
        }
        var self = this;

        self.planType = ko.observable(params.planType);
        self.planTypeID = ko.observable(params.planTypeID);
        self.tabIndex = ko.observable(params.tabIndex);
        self.plans = ko.observableArray([]);

        return self;
    };
})(EXCHANGE);

