(function (app) {
    var ns = app.namespace('EXCHANGE.applicationOverview');
    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.LoadOverviewPage();
        ns.wireUpJqueryBindings();
    });

    ns.LoadOverviewPage = function LoadOverviewPage() {
        app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        app.viewModels.ApplicationStateViewModel = app.models.ApplicationStateViewModel();
        app.viewModels.OverviewViewModel = app.models.OverviewViewModel();
        app.viewModels.OverviewSubmitViewModel = app.models.OverviewSubmitViewModel();
        app.viewModels.ProgressBarViewModel = app.models.ProgressBarViewModel();
        app.viewModels.NavigationBarViewModel = app.models.NavigationBarViewModel();
        app.viewModels.ApplicationIntegrityViewModel = app.models.ApplicationIntegrityViewModel();


        var previousBasePage = app.functions.getKeyValueFromWindowLocation('PreviousBasePage');
        var overviewArgs = { PreviousBasePage: previousBasePage };
        overviewArgs = JSON.stringify(overviewArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationOverviewClientViewModel",
            data: overviewArgs,
            dataType: "json",
            success: function (serverViewModel) {
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverViewModel.PlanSharedResourceStrings);
                app.viewModels.ApplicationIntegrityViewModel.loadFromJSON(serverViewModel.ApplicationIntegrityViewModel);
                app.application.functions.performApplicationIntegrityCheck();

                app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                app.viewModels.OverviewViewModel.loadFromJSON(serverViewModel.ApplicationOverviewViewModel);
                app.viewModels.ProgressBarViewModel.loadFromJSON(serverViewModel.ProgressBarViewModel);
                app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);
                app.application.navigationBar.updateNavigationBar();
                app.application.progressBar.updateProgressBar();

               
                ko.applyBindings(app.viewModels, $('#application-body-content').get(0));
                $('input').customInput();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.wireUpJqueryBindings = function wireUpJqueryBindings() {
        $(document).on('click', '.backToShoppingCart', app.application.navigationBar.overviewPageBackNavigation);
    };


} (EXCHANGE));

