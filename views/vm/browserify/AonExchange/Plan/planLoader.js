(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');

    ns.PlanLoader = function PlanLoader() {
        if (!(this instanceof PlanLoader)) {
            return new PlanLoader();
        }
        var self = this;

        PlanLoader.prototype.loadAllPlansFromJson = function loadAllPlansFromJson(data, callback) {
           var protoSelf = this;

            var tabOrder = app.exchangeContext.ExchangeContext.tabOrder();
            var medigap = [];
            var prescriptionDrug = [];
            var medicareAdvantage = [];

            for (var i = 0; i < tabOrder.length; i++) {
                if (tabOrder[i] == app.enums.PlanTypeEnum.MEDIGAP) {
                    for (var j = 0; j < data.PlanLists[i].length; j++) {
                        //var medigapPlan = new EXCHANGE.plans.PlanModel(data.PlanLists[i][j]);
                        var medigapPlan = new EXCHANGE.models.PlanSearchResultsViewModel().loadFromPlanDomainEntity(data.PlanLists[i][j]);
                        medigap.push(medigapPlan);
                    }
                    //setTabPlans(medigap, i);
                } else if (tabOrder[i] == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                    for (var j = 0; j < data.PlanLists[i].length; j++) {
                        //var prescriptionDrugPlan = new EXCHANGE.plans.PlanModel(data.PlanLists[i][j]);
                        var prescriptionDrugPlan = new EXCHANGE.models.PlanSearchResultsViewModel().loadFromPlanDomainEntity(data.PlanLists[i][j]);
                        prescriptionDrug.push(prescriptionDrugPlan);
                    }
                    //setTabPlans(prescriptionDrug, i);
                } else if (tabOrder[i] == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                    for (var j = 0; j < data.PlanLists[i].length; j++) {
                        //var medicareAdvantagePlan = new EXCHANGE.plans.PlanModel(data.PlanLists[i][j]);
                        var medicareAdvantagePlan = new EXCHANGE.models.PlanSearchResultsViewModel().loadFromPlanDomainEntity(data.PlanLists[i][j]);
                        medicareAdvantage.push(medicareAdvantagePlan);
                    }
                    //setTabPlans(medicareAdvantage, i);
                }
            }
            app.viewModels.ShoppingCartViewModel.modifyCart(callback);
        };

        function setTabPlans(planList, i) {
            switch (i) {
                case 0:
                    EXCHANGE.plans.AllPlans.Tab0Plans = planList;
                    return;
                case 1:
                    EXCHANGE.plans.AllPlans.Tab1Plans = planList;
                    return;
                case 2:
                    EXCHANGE.plans.AllPlans.Tab2Plans = planList;
                    return;
            }
        };

        PlanLoader.prototype.initializeActivePlans = function initializeActivePlans() {
            var protoSelf = this;

            var tab0PlansClones = [];
            for (var i = 0; i < EXCHANGE.plans.AllPlans.Tab0Plans.length; i++) {
                tab0PlansClones.push(EXCHANGE.plans.AllPlans.Tab0Plans[i].clone());
            }
            EXCHANGE.plans.ActivePlans.Tab0Plans = tab0PlansClones;

            var tab1PlansClones = [];
            for (var i = 0; i < EXCHANGE.plans.AllPlans.Tab1Plans.length; i++) {
                tab1PlansClones.push(EXCHANGE.plans.AllPlans.Tab1Plans[i].clone());
            }
            EXCHANGE.plans.ActivePlans.Tab1Plans = tab1PlansClones;

            var tab2PlansClones = [];
            for (var i = 0; i < EXCHANGE.plans.AllPlans.Tab2Plans.length; i++) {
                tab2PlansClones.push(EXCHANGE.plans.AllPlans.Tab2Plans[i].clone());
            }
            EXCHANGE.plans.ActivePlans.Tab2Plans = tab2PlansClones;

            return protoSelf;
        };

    

        PlanLoader.prototype.getSavedTab = function getSavedTab(i) {
            var tab;
            switch (i) {
                case 0:
                    return app.plans.AllPlans.Tab0Plans;
                case 1:
                    return app.plans.AllPlans.Tab1Plans;
                case 2:
                    return app.plans.AllPlans.Tab2Plans;
            }
            return tab;
        };

       

       


       

    } ();

} (EXCHANGE, this));
