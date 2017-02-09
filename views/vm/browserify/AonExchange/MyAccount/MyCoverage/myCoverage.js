(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myCoverage");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
        app.enrollmentPlanDetails.initializeEnrollmentPlanDetails();
        app.decisionSupport.initializeDecisionSupport();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        $('#account-my-coverage').hide();
        $('#search-results-spinner').show();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/AccountMyCoverageViewModel",
            dataType: "json",
            success: function (response) {
                var serverViewModel = response;
                app.viewModels.AccountMyCoverageViewModel.loadFromJSON(serverViewModel);
                app.viewModels.AccountMyCoverageViewModel.enrollments(serverViewModel.Enrollments);
                app.viewModels.AccountMyCoverageViewModel.employerCoverages(serverViewModel.EmployerCoverages);
                $('#search-results-spinner').hide();
                $('#account-my-coverage').show();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });

        ns.wireupJqueryEvents();
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.AccountMyCoverageViewModel = new app.models.AccountMyCoverageViewModel();
        ko.applyBindings(app.viewModels, $('#account-my-coverage').get(0));

        app.viewModels.ClientCoverageViewModel = new app.models.ClientCoverageViewModel();

    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('.myemployercoverage').on('click', '.coverageDetailSubmit', function (e) {

            var coverageId = $(this).attr("id");

            var coverageArgs = {
                CoverageId: coverageId
            };

            coverageArgs = JSON.stringify(coverageArgs);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/ClientCoverageViewModel",
                dataType: "json",
                data: coverageArgs,
                success: function (response) {
                    var coverageViewModel = response;
                    app.viewModels.ClientCoverageViewModel.loadFromJSON(coverageViewModel.CoveragePlan);
                    ko.applyBindings(app.viewModels, $('#client-coverage-detail').get(0));
                    $('#account-my-coverage').hide();
                    $('#client-coverage-detail').show();
                },
                error: function (data) {
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                }
            });

        });

        $('.clientcoverage').on('click', '.backToMyCoverage', function (e) {
            $('#account-my-coverage').show();
            $('#client-coverage-detail').hide();
        });

    };



} (EXCHANGE));