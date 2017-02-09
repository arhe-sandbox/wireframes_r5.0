(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');

    ns.MedigapFilterEngine = new ns.FilterRules();
    ns.PrescriptionDrugFilterEngine = new ns.FilterRules();
    ns.MedicareAdvantageFilterEngine = new ns.FilterRules();
    ns.VisionFilterEngine = new ns.FilterRules();
    ns.DentalFilterEngine = new ns.FilterRules();


    ns.MedigapCompareList = new ns.ComparedPlans();
    ns.PrescriptionDrugCompareList = new ns.ComparedPlans();
    ns.MedicareAdvantageCompareList = new ns.ComparedPlans();
    ns.VisionCompareList = new ns.ComparedPlans();
    ns.DentalCompareList = new ns.ComparedPlans();


    ns.applySorting = function applySorting(medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine, shouldReloadPlans, visionsortengine, dentalsortengine) {

        if (medigapSortEngine) {
            EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans(medigapSortEngine.sort(EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans()));
        }
        if (prescriptionDrugSortEngine) {
            EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans(prescriptionDrugSortEngine.sort(EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans()));
        }
        if (medicareAdvantageSortEngine) {
            EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans(medicareAdvantageSortEngine.sort(EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans()));
        }
        if (dentalsortengine) {
            EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans(dentalsortengine.sort(EXCHANGE.viewModels.AncSearchResultsViewModel.dentalPlans()));
        }
        if (visionsortengine) {
            EXCHANGE.viewModels.AncSearchResultsViewModel.displayPlans(visionsortengine.sort(EXCHANGE.viewModels.AncSearchResultsViewModel.visionPlans()));
        }

    };

    ns.clearSorting = function clearSorting(medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine, shouldReloadPlans, visionsortengine, dentalsortengine) {

        if (medigapSortEngine) {
            EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans(medigapSortEngine.pwSort(EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans()));
        }
        if (prescriptionDrugSortEngine) {
            EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans(prescriptionDrugSortEngine.pwSort(EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans()));
        }
        if (medicareAdvantageSortEngine) {
            EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans(medicareAdvantageSortEngine.pwSort(EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans()));
        }
        if (visionsortengine) {
            EXCHANGE.viewModels.AncSearchResultsViewModel.visionPlans(visionsortengine.pwSort(EXCHANGE.viewModels.AncSearchResultsViewModel.visionPlans()));
        }
        if (dentalsortengine) {
            EXCHANGE.viewModels.AncSearchResultsViewModel.dentalPlans(dentalsortengine.pwSort(EXCHANGE.viewModels.AncSearchResultsViewModel.dentalPlans()));
        }

    };

    ns.applyFiltering = function applyFiltering(shouldReloadPlans, reloadVisoinPlans, reloadDentalPlans) {
        ns._applyFiltering(shouldReloadPlans, reloadVisoinPlans, reloadDentalPlans);
        /*
        if (app.functions.isIE8OrLower()) {
        setTimeout(function () {
        ns._applyFiltering(shouldReloadPlans);
        }, 200);
        } else {
        ns._applyFiltering(shouldReloadPlans);
        }
        */
    };

    ns._applyFiltering = function _applyFiltering(shouldReloadPlans, reloadVisoinPlans, reloadDentalPlans) {
        if (reloadVisoinPlans) {
            ns.VisionFilterEngine.filter(EXCHANGE.viewModels.AncSearchResultsViewModel.visionPlans());
        }
        else if (reloadDentalPlans) {
            ns.DentalFilterEngine.filter(EXCHANGE.viewModels.AncSearchResultsViewModel.dentalPlans());
        }
        else {
            var currentTab = EXCHANGE.viewModels.SearchResultsViewModel.currentTab();
            switch (currentTab) {
                case EXCHANGE.enums.TabIdEnum.MEDIGAP:
                    ns.MedigapFilterEngine.filter(EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans());

                    break;
                case EXCHANGE.enums.TabIdEnum.PRESCRIPTIONDRUG:
                    ns.PrescriptionDrugFilterEngine.filter(EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans());

                    break;
                case EXCHANGE.enums.TabIdEnum.MEDICAREADVANTAGE:
                    ns.MedicareAdvantageFilterEngine.filter(EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans());

                    break;
            }
        }


    };

    ns.applyRecFiltering = function applyRecFiltering(shouldReloadPlans) {

        var currentTab = EXCHANGE.viewModels.RecResultsViewModel.currentTab();
        switch (currentTab) {
            case EXCHANGE.enums.TabIdEnum.MEDIGAP:
                ns.MedigapFilterEngine.filter(EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans());

                break;
            case EXCHANGE.enums.TabIdEnum.PRESCRIPTIONDRUG:
                ns.PrescriptionDrugFilterEngine.filter(EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans());

                break;
            case EXCHANGE.enums.TabIdEnum.MEDICAREADVANTAGE:
                ns.MedicareAdvantageFilterEngine.filter(EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans());

                break;
        }


    };

    /************** Plan Compare Methods ***************/

    ns.addToCompared = function addToCompared(plan) {

        var compPlan = { planGuid: plan.planGuid, planType: plan.planType };

        if (plan.planType == app.enums.PlanTypeEnum.MEDIGAP) {
            ns.MedigapCompareList.addPlan(compPlan);
        } else if (plan.planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
            ns.PrescriptionDrugCompareList.addPlan(compPlan);
        } else if (plan.planType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
            ns.MedicareAdvantageCompareList.addPlan(compPlan);
        } else if (plan.planType === app.enums.PlanTypeEnum.DENTAL) {
            ns.DentalCompareList.addPlan(compPlan);
        } else if (plan.planType === app.enums.PlanTypeEnum.VISION) {
            ns.VisionCompareList.addPlan(compPlan);
        }
        plan.isCompared(true);
    };

    ns.removeFromCompared = function removeFromCompared(plan) {

        var compPlan = { planGuid: plan.planGuid, planType: plan.planType };

        if (plan.planType == app.enums.PlanTypeEnum.MEDIGAP) {
            ns.MedigapCompareList.removePlan(compPlan);
        } else if (plan.planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
            ns.PrescriptionDrugCompareList.removePlan(compPlan);
        } else if (plan.planType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
            ns.MedicareAdvantageCompareList.removePlan(compPlan);
        } else if (plan.planType === app.enums.PlanTypeEnum.DENTAL) {
            ns.DentalCompareList.removePlan(compPlan);
        } else if (plan.planType === app.enums.PlanTypeEnum.VISION) {
            ns.VisionCompareList.removePlan(compPlan);
        }
        plan.isCompared(false);
    };

    ns.getComparedPlansCount = function getComparedPlansCount(planType) {

        if (planType == app.enums.PlanTypeEnum.MEDIGAP) {
            return ns.MedigapCompareList.getComparedPlansCount();
        } else if (planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
            return ns.PrescriptionDrugCompareList.getComparedPlansCount();
        } else if (planType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
            return ns.MedicareAdvantageCompareList.getComparedPlansCount();
        } else if (planType === app.enums.PlanTypeEnum.DENTAL) {
            return ns.DentalCompareList.getComparedPlansCount();
        } else if (planType === app.enums.PlanTypeEnum.VISION) {
            return ns.VisionCompareList.getComparedPlansCount();
        }
        return 0;
    };
    /***************************************************/

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');



} (EXCHANGE, this));
