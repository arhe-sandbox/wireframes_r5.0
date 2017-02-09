(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.coverageCost');
    EXCHANGE.namespace('EXCHANGE.viewModels');

    var planDetailsFlag = false;
    var planCompareFlag = false;
    var isRequestInProgress = false;
    var enrollmentplandetails = false;


    $.subscribe('EXCHANGE.lightbox.plandetails.open', function () {
        planDetailsFlag = true;
    });

    $.subscribe('EXCHANGE.lightbox.enrollmentplandetails.open', function () {
        enrollmentplandetails = true;
    });

    $.subscribe('EXCHANGE.lightbox.plandetails.close', function () {
        planDetailsFlag = false;
    });

    $.subscribe('EXCHANGE.lightbox.enrollmentplandetails.close', function () {
        enrollmentplandetails = false;
    });

    $.subscribe('EXCHANGE.lightbox.plandetails.back', function () {
        planDetailsFlag = false;
    });

    $.subscribe('EXCHANGE.lightbox.compareplans.open', function () {
        planCompareFlag = true;
    });

    $.subscribe('EXCHANGE.lightbox.closeAll', function () {
        planDetailsFlag = false;
        planCompareFlag = false;
    });

    $.subscribe('EXCHANGE.lightbox.compareplans.loaded', function () {
        if (!EXCHANGE.user.UserSession.ShowRxPreloadLb()) {
            ns._getPlanCompareCoverageCosts();
        }
    });

    $.subscribe('EXCHANGE.lightbox.helpchoose.done', function () {

    });

    ns._selectedPharmacyId;

    ns.getCoverageCostsInPriorityOrder = function getCoverageCostsInPriorityOrder() {
        if (app.viewModels.findRecommendationsViewModel) {
            return;
        }

        ns._selectedPharmacyId = app.user.UserSession.UserPharmacies.selectedPharmacy().Id;

        //grab pharmacy radio button, pass pharmacy into any ajax calls
        // need to wire up an event to the change on that button to call this function.

        //mark all planvms as needing new tce data


        var tab0Plans = app.viewModels.SearchResultsViewModel.tab0.allPlans();
        var tab1Plans = app.viewModels.SearchResultsViewModel.tab1.allPlans();

        var allPlans = tab0Plans.concat(tab1Plans);

        $.each(allPlans, function (index, planViewModel) {
            //could make this more robust, only get costs when drugs change, for example.
            planViewModel.needNewCoverageCost(true);
            planViewModel.CoverageCost = null;

        });

        var clearFlags = function () {
            //planDetailsFlag = false; do not clear this flag, because of new pharmacy radio buttons
            planCompareFlag = false;
        };


        ns.getSearchResultsPlanCoverageCosts();


        clearFlags();
    };

    ns._getPlanCompareCoverageCosts = function getPlanCompareCoverageCosts() {

        var PlanIdInfos = [];
        for (var i = 0; i < app.viewModels.ComparePlansViewModel.numberOfPlans(); i++) {
            var planViewModel = app.viewModels.ComparePlansViewModel.planList()[i];
            if (planViewModel.haveTceData()) {
                ns._planViewModelStartLoad(planViewModel);
                var PlanIdInfo = {};
                PlanIdInfo.PlanGuid = planViewModel.planGuid;
                PlanIdInfo.DRXPlanID = planViewModel.DRXPlanID;
                PlanIdInfo.MedicareContractId = planViewModel.medicareContractId;
                PlanIdInfo.MedicarePlanId = planViewModel.medicarePlanId;
                PlanIdInfo.MedicareSegmentId = planViewModel.medicareSegmentId;
                PlanIdInfo.EffectiveDate = planViewModel.effectiveDate;
                PlanIdInfos.push(PlanIdInfo);

            }
        }


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/CoverageCost/PlanDetailsCoverageCost",
            dataType: "json",
            data: JSON.stringify(PlanIdInfos),
            success: function (serverViewModel) {
                $.each(serverViewModel, function (index, coveragecost) {

                    ns.loadCostEstimate(coveragecost, false, true);

                });




            }
        });


    };

    ns.getPlanDetailsCoverageCosts = function getPlanDetailsCoverageCosts(planDetails) {

        if (!app.viewModels.PlanDetailsViewModel || !app.viewModels.PlanDetailsViewModel.plan ||
                !app.viewModels.PlanDetailsViewModel.plan.planGuid) {
            return;
        }

        var planId = app.viewModels.PlanDetailsViewModel.plan.planGuid;
        if (planId == '' || planId == "00000000-0000-0000-0000-000000000000") {
            return;
        }

        var planVm = null;

        if (EXCHANGE.viewModels.SearchResultsViewModel)
            planVm = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planId);


        if (planVm == undefined || planVm == null) {

            var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel();
            planVm = planSRVM.loadFromPlanDomainEntity(planDetails);
        }
        if (!planVm.haveTceData()) {

            return;
        }

        ns._planViewModelStartLoad(planVm);

        if ((typeof planVm.CoverageCost != "undefined") && planVm.CoverageCost != null) {
            ns.loadCostEstimate(planVm.CoverageCost, true, false);
            return;
        }


        var DRXPlanID = planVm.DRXPlanID;




        var PlanIdInfos = [];
        var PlanIdInfo = {};
        PlanIdInfo.PlanGuid = app.viewModels.PlanDetailsViewModel.plan.planGuid;
        PlanIdInfo.DRXPlanID = planVm.DRXPlanID;

        PlanIdInfo.MedicareContractId = planVm.medicareContractId;
        PlanIdInfo.MedicarePlanId = planVm.medicarePlanId;
        PlanIdInfo.MedicareSegmentId = planVm.medicareSegmentId;
        PlanIdInfo.EffectiveDate = EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate;

        PlanIdInfos.push(PlanIdInfo);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/CoverageCost/PlanDetailsCoverageCost",
            dataType: "json",
            data: JSON.stringify(PlanIdInfos),
            success: function (serverViewModel) {

                ns.loadCostEstimate(serverViewModel[0], true, false);



            }
        });
    };


    ns.loadCostEstimate = function loadCostEstimate(coverageCost, isPlanDetails, isPlanCompare) {
        var costEstimate = [];
        for (i = 0; i < coverageCost.CostEstimates.length; i++) {
            if (coverageCost.CostEstimates[i].Pharmacy.Id == app.user.UserSession.UserPharmacies.selectedPharmacy().Id)
                costEstimate = coverageCost.CostEstimates[i];
        }
        var plan;
        if (!isPlanCompare) {
            if (app.viewModels.PlanDetailsViewModel && app.viewModels.PlanDetailsViewModel.plan && app.viewModels.PlanDetailsViewModel.plan.planGuid == costEstimate.PlanId) {
                plan = app.viewModels.PlanDetailsViewModel.plan;
            }
            else if (app.viewModels.SearchResultsViewModel) {
                plan = app.viewModels.SearchResultsViewModel.getPlanByPlanGuid(costEstimate.PlanId);
            }
            else
                return;
        }

        else {
            $.each(app.viewModels.ComparePlansViewModel.planList(), function (j, planInList) {
                if (costEstimate.PlanId == planInList.planGuid) {
                    plan = planInList;
                }
            });

        }
        plan.CoverageCost = coverageCost;
        ns.loadTce(plan, costEstimate);
        ns.loadPlanDrugs(coverageCost.PlanDrugs, plan, isPlanDetails, isPlanCompare);
        ns._planViewModelFinishLoad(plan);
        if (isPlanDetails) {
            app.planDetails.drawDrugCostTable();
            app.planDetails.drawOutOfPocketGraph();
            plan.drawGraph(true);
            app.planDetails.setupPharmacyRadioButtons();
        }

    };

    ns.getSearchResultsPlanCoverageCosts = function getSearchResultsCoverageCosts(callback) {
        if (!app.searchResults) {
            return;
        }

        var planCostArgs = { PlanIds: [] };
        //  var allPlanViewModels = app.plans.AllPlanViewModels.toArray();

        var tab0Plans = app.viewModels.SearchResultsViewModel.tab0.allPlans();
        var tab1Plans = app.viewModels.SearchResultsViewModel.tab1.allPlans();

        var allPlans = tab0Plans.concat(tab1Plans);

        for (var i = 0; i < allPlans.length; i++) {
            if (allPlans[i].haveTceData()) {


                ns._planViewModelStartLoad(allPlans[i]);
                var PlanIdInfo = {};
                PlanIdInfo.PlanGuid = allPlans[i].planGuid;
                PlanIdInfo.MedicareContractId = allPlans[i].medicareContractId;
                PlanIdInfo.MedicarePlanId = allPlans[i].medicarePlanId;
                PlanIdInfo.MedicareSegmentId = allPlans[i].medicareSegmentId;
                PlanIdInfo.EffectiveDate = allPlans[i].effectiveDate;

                planCostArgs.PlanIds.push(PlanIdInfo);

            }

        }

        planCostArgs = JSON.stringify(planCostArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/CoverageCost/SearchResultsCoverageCosts",
            dataType: "json",
            data: planCostArgs,
            success: function (planCosts) {
                $.each(planCosts, function (index, planCost) {

                    var tab0Plans = app.viewModels.SearchResultsViewModel.tab0.allPlans();
                    var tab1Plans = app.viewModels.SearchResultsViewModel.tab1.allPlans();

                    var allPlans = tab0Plans.concat(tab1Plans);


                    var planviewModel = allPlans.find(function (element) {
                        if (element.planGuid == planCost.PlanGuid)
                            return true;
                        else
                            return false;
                    });



                    if (undefined != planviewModel) {
                        //ns.loadTce(plan, costEstimate);
                        planviewModel.TCE = planCost.AnnualTotalCost;
                        planviewModel.DRXPlanID = planCost.DRXPlanID;

                        //ns.loadPlanDrugs(plan, serverViewModel.PlanDrugs);
                        ns._planViewModelFinishLoad(planviewModel);
                    }
                });

            },
            error: function (data) {
            }
        });
    };


    ns.loadTce = function _loadTce(planViewModel, costEstimate) {
        if (planViewModel.haveTceData()) {
            planViewModel.tceCost(costEstimate);

        }
    };

    ns.loadPlanDrugs = function _loadPlanDrugs(planDrugList, plan, isPlanDetails, isPlanCompare) {
        if (isPlanDetails && app.viewModels.PlanDetailsViewModel && app.viewModels.PlanDetailsViewModel.plan.planGuid) {
            var planDrugs = [];
            $.each(planDrugList, function (index, planDrug) {
                if (planDrug.PlanId == app.viewModels.PlanDetailsViewModel.plan.planGuid) {
                    planDrugs.push(planDrug);
                }
            });
            app.viewModels.PlanDetailsViewModel.planDrugs(planDrugs);
        }
        else if (isPlanCompare) {
            var planDrugs = [];
            $.each(planDrugList, function (i, planDrug) {
                if (planDrug.PlanId == plan.planGuid) {
                    planDrugs.push(planDrug);
                }
            });

            plan.PlanDetailsVM.planDrugs(planDrugs);



        }
    };

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

} (EXCHANGE));
