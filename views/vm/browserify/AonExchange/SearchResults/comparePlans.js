(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');

    ns.ComparedPlans = function ComparedPlans() {
        if (!(this instanceof ComparedPlans)) {
            return new ComparedPlans();
        }
        var self = this;

        self.plans = ko.observableArray([]);

        ComparedPlans.prototype.addPlan = function addPlan(plan) {
            var protoSelf = this;
            if (protoSelf.getComparedPlansCount() >= 3) {
                $.publish("EXCHANGE.lightbox.comparisonlimit.open");
            } else {
                var compPlan = { PlanId: plan.planGuid, PlanType: plan.planType };
                var newPlans = protoSelf.plans();
                newPlans.push(plan);
                protoSelf.plans(newPlans);
                protoSelf.addComparedPlanToSession(plan.planGuid, plan.planType);
            }
            return protoSelf;
        };

        ComparedPlans.prototype.removePlan = function removePlan(plan) {
            var protoSelf = this;
            var newPlans = protoSelf.plans();
            for (var i = 0; i < newPlans.length; i++) {
                if (newPlans[i].planGuid == plan.planGuid && newPlans[i].planType == plan.planType) {
                    newPlans.splice(i, 1);
                    //EXCHANGE.viewModels.ComparePlansViewModel.planList().splice(i, 1);
                }
            }
            protoSelf.plans(newPlans);
            protoSelf.removeComparedPlanFromSession(plan.planGuid, plan.planType);

            return protoSelf;
        };

        ComparedPlans.prototype.getComparedPlansCount = function getComparedPlansCount() {
            return this.plans().length;
        };

        ComparedPlans.prototype.addComparedPlanToSession = function addComparedPlanToSession(planId, planType) {
            var protoSelf = this;
            var args = JSON.stringify({ PlanId: planId, PlanType: planType });
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/UserProfile/AddToComparedPlans",
                data: args,
                dataType: "json",
                failure: function () {
                    //alert('Data Retrieval Error');                   
                }
            });
        };

        ComparedPlans.prototype.removeComparedPlanFromSession = function removeComparedPlanFromSession(planId, planType) {
            var protoSelf = this;
            var args = JSON.stringify({ PlanId: planId, PlanType: planType });
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/UserProfile/RemoveFromComparedPlans",
                data: args,
                dataType: "json",
                failure: function () {
                    //alert('Data Retrieval Error');                    
                }
            });
        };

        return self;
    };
})(EXCHANGE, this);
