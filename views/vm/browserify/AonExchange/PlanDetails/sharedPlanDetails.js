(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.sharedPlanDetails');


    ns.getCorrectTotalsFromCostEstimate = function getCorrectTotalsFromCostEstimate(costEstimate) {
        var viewModel = app.viewModels.PlanDetailsViewModel;
        if (costEstimate) {
            if (viewModel.tceFromStartOfYear()) {
                return costEstimate.InNetworkCalendarYearTotals;
            }

            if (!viewModel.tceFromStartOfYear()) {
                return costEstimate.InNetworkCoverageBeginsTotals;
            }

        }
        return null;
    };

    ns.getCorrectOverlaysFromCostEstimate = function getCorrectOverlaysFromCostEstimate(costEstimate) {
        var viewModel = app.viewModels.PlanDetailsViewModel;
        if (costEstimate) {
            if (viewModel.tceFromStartOfYear()) {
                return costEstimate.InNetworkCalendarYearOverlay;
            }

            if (!viewModel.tceFromStartOfYear()) {
                return costEstimate.InNetworkCoverageBeginsOverlay;
            }

        }
        return null;
    };

} (EXCHANGE));

