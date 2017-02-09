(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.print');
    var reTryCount = 0;

    $(document).ready(function () {
        app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        app.viewModels.PlanDetailsViewModel = app.models.PlanDetailsViewModel();

        ns.loadPlans();
    });

    ns.loadPlans = function loadPlans() {
        var planid = app.functions.getKeyValueFromWindowLocation('planid');
        var printPlanDetailsArgs = { PlanId: planid };
        printPlanDetailsArgs = JSON.stringify(printPlanDetailsArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PrintPlans/PrintPlanDetailsClientViewModel",
            dataType: "json",
            data: printPlanDetailsArgs,
            success: function (serverViewModel) {
                //we need to set up the TCE graph and pharmacy radio buttons after the PageSetupClientViewModel AJAX call has returned.
                //this chunk of code ensures that printPlanDetailsClientViewModelSuccessCallback will only fire after the user session has been loaded.
                if (app.user.UserSession.doneLoading()) {
                    ns.printPlanDetailsClientViewModelSuccessCallback(serverViewModel);
                } else {
                    app.user.UserSession.doneLoading.subscribe(function (newValue) {
                        ns.printPlanDetailsClientViewModelSuccessCallback(serverViewModel);
                    });
                }
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.printPlanDetailsClientViewModelSuccessCallback = function printPlanDetailsClientViewModelSuccessCallback(viewModel) {

        // The following block is a temp. fix for AEP to account for multi-threading issue that causes the AttributeTemplate not to Serialize in PrintPages.
       
        if (viewModel && viewModel.PlanDetailsPopupViewModel && viewModel.PlanDetailsPopupViewModel.PlanDetails) {
            if (null == viewModel.PlanDetailsPopupViewModel.PlanDetails.AttributeTemplates || 'undefined' == viewModel.PlanDetailsPopupViewModel.PlanDetails.AttributeTemplates) {
                if (reTryCount < 2) {
                     reTryCount++;
                     ns.loadPlans();
                    return;
                };

            }

        }
      
        var pharmacyId = app.functions.getKeyValueFromWindowLocation('PharmacyId');

        if(pharmacyId != '')
            EXCHANGE.planDetails.updateSelectedPharmacy(pharmacyId);
       
         if (!viewModel.HasValidSearchCriteria) {
            app.functions.redirectToRelativeUrlFromSiteBase('/find-plans.aspx');
            return;
        }

        app.viewModels.PlanSharedResourceStrings.loadFromJSON(viewModel.PlanSharedResourceStrings);

        app.viewModels.PlanDetailsViewModel = EXCHANGE.models.PlanDetailsViewModel();
        app.viewModels.PlanDetailsViewModel.loadPlanDetails(viewModel.PlanDetailsPopupViewModel.PlanDetails.Id, viewModel.PlanDetailsPopupViewModel);
        app.viewModels.PlanDetailsViewModel.tcePharmacy_radio(app.user.UserSession.UserPharmacies.selectedPharmacy().Id);
      
        ko.applyBindings(EXCHANGE.viewModels, $('#print-plan-details').get(0));


     
        
        //deal with tce stuff
        var coverageCost = viewModel.CoverageCost;
        if (viewModel.PlanDetailsPopupViewModel.PlanDetails.RecommendationInfo == null && coverageCost != null) {
            app.coverageCost.loadCostEstimate(viewModel.CoverageCost, true);
        }

        app.viewModels.PlanDetailsViewModel.includeAnnual(true);
        app.viewModels.PlanDetailsViewModel.includePrescription(true);
        app.viewModels.PlanDetailsViewModel.includeMedical(false);

        //ns.setTceObservablesFromQS();
        //ns.drawDrugCostTable();
        //ns.drawOutOfPocketGraph();

        app.functions.refreshRadioButtonSelection('pharmacyRadioMedicationTable', app.user.UserSession.UserPharmacies.selectedPharmacy().Id);
        app.functions.refreshRadioButtonSelection('pharmacyRadioTce', app.user.UserSession.UserPharmacies.selectedPharmacy().Id);

        EXCHANGE.planDetails.setupJqueryBindings();


        //print page specific
        ns.showAndHideForPrint();
        ns.executePrint();

        if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
    };




    ns.setTceObservablesFromQS = function setTceObservablesFromQS() {
        var fromYearStart = app.functions.getKeyValueFromWindowLocation("fromyearstart");
        app.viewModels.PlanDetailsViewModel.tceFromStartOfYear_radio(fromYearStart);
    };

    ns.drawOutOfPocketGraph = function drawOutOfPocketGraph() {
        ns.oopGraph = new app.costEstimator.OutOfPocketGraph('#out-of-pocket-graph');
        var viewModel = app.viewModels.PlanDetailsViewModel;
        var costEstimate = viewModel.plan().tceCost();
        if (costEstimate) {
            var months = viewModel.tceFromStartOfYear() ? costEstimate.CalendarYearMonths : costEstimate.CoverageBeginsMonths;
            ns.oopGraph.drawGraph(months, viewModel.includePrescription(), viewModel.includeMedical(), viewModel.includeAnnual());
        }
    };

    ns.drawDrugCostTable = function drawDrugCostTable() {
        var viewModel = app.viewModels.PlanDetailsViewModel;
        var costEstimate = viewModel.plan().tceCost();

        //no logic needed, yet
    };

    ns.showAndHideForPrint = function showAndHideForPrint() {
        $('.plandoc').removeClass('lightbox-open-plandocuments');
        //$('.find-doc').die('click');



    };

    ns.executePrint = function executePrint() {
        setTimeout('window.print()', 500); 
        //window.print();
    };


} (EXCHANGE));

