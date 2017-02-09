(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.print');
    var reTryCount = 0;

    //Dont expect lightboxes to work on this pages
    $.publish = function () { return false; };


    $(document).ready(function () {
        //hide header stuff
        app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        app.viewModels.ComparePlansViewModel = app.models.ComparePlansViewModel();

        ns.loadPlans();
    });


    ns.loadPlans = function loadPlans() {

        var tabIndex = parseInt(EXCHANGE.functions.getKeyValueFromWindowLocation('type'));
        var tabName = '';
        if (tabIndex == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
            tabName = app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE;
        }
        else if (tabIndex == app.enums.PlanTypeEnum.MEDIGAP) {
            tabName = app.enums.PlanTypeNameEnum.MEDIGAP;
        }
        else if (tabIndex == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
            tabName = app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG;
        }

        var comparePlanArgs = { PlanType: tabIndex, TabName: tabName };
        comparePlanArgs = JSON.stringify(comparePlanArgs);

        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.Print.PrintCompareClientViewModel");


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PrintPlans/PrintPlanCompareClientViewModel",
            data: comparePlanArgs,
            dataType: "json",
            success: function (serverViewModel) {
                if (!serverViewModel.HasValidSearchCriteria) {
                    app.functions.redirectToRelativeUrlFromSiteBase('/find-plans.aspx');
                    return;
                }

                if (serverViewModel.ComparePlansPopupViewModel.ComparedPlans.length == 0) {

                    setTimeout('ns.loadPlans()', 500);

                } else {

                    for (var index = 0; index < serverViewModel.ComparePlansPopupViewModel.ComparedPlans.length; index++) {

                        if (null == serverViewModel.ComparePlansPopupViewModel.ComparedPlans[index].AttributeTemplates || 'undefined' == serverViewModel.ComparePlansPopupViewModel.ComparedPlans[index].AttributeTemplates) {
                            if (reTryCount < 3) {
                                reTryCount++;
                                ns.loadPlans();
                                return;
                            };
                        }
                    }
                }

                app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverViewModel.PlanSharedResourceStrings);
                app.viewModels.ComparePlansViewModel.loadFromJSON(serverViewModel.ComparePlansPopupViewModel);

                self.headerLbl = app.viewModels.ComparePlansViewModel.header_lbl;
                app.viewModels.ComparePlansViewModel.header_lbl =
                    self.headerLbl.format(app.viewModels.ComparePlansViewModel.numberOfPlans().toString());

                ko.applyBindings(EXCHANGE.viewModels, $('#print-compare-plans-content').get(0));

                //tce stuff

                var coverageCosts = serverViewModel.CoverageCost;
                var pharmacyId = app.functions.getKeyValueFromWindowLocation('PharmacyId');

                if (coverageCosts) {
                    $.each(coverageCosts, function (topIndex, coverageCost) {
                        var costEstimate = coverageCost.CostEstimates;
                        var planId = costEstimate[0].PlanId;
                        var planViewModel = 0;
                        for (var index = 0; index < app.viewModels.ComparePlansViewModel.numberOfPlans(); index++) {
                            if (app.viewModels.ComparePlansViewModel.planList()[index].planGuid == planId) {
                                var planviewModel = app.viewModels.ComparePlansViewModel.planList()[index];
                            }
                        }
                        if (planviewModel == 0) {
                            return false; //break if we got data back for a plan we didn't expect
                        }

                        for (i = 0; i < costEstimate.length; i++) {
                            if (costEstimate[i].Pharmacy.Id == pharmacyId)
                                app.coverageCost.loadTce(planviewModel, costEstimate[i]);
                        }

                        app.coverageCost.loadPlanDrugs(coverageCost.PlanDrugs, planviewModel, false, true);

                        planviewModel.planDrugsLoaded(true);
                        planviewModel.tceLoaded(true);
                    });
                }


                app.viewModels.ComparePlansViewModel.planList(app.viewModels.ComparePlansViewModel.planList());
                //


                //print stuff
                ns.showAndHideForPrint();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close(true);
                ns.executePrint();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close(true);
            }
        });
    };

    ns.showAndHideForPrint = function showAndHideForPrint() {
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].onclick = function () { return (false); };
        }
    };

    ns.executePrint = function executePrint() {
        setTimeout('window.print()', 500);
        //window.print();
    };

} (EXCHANGE));
