(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myActionNeeded");

    ns.isNavigating = false;

    $(function () {
        if (app.functions) {
            app.functions.disableFooterLinks();
        }
    });

    ns.submittingPage = false;

    ns.updateNavigationBar = function updateNavigationBar() {
        ko.applyBindings(app.viewModels, $('#action-navigation-bar').get(0));


        //setup functionality of continue and go back buttons on each page.
        $(document).off('click', '#btnGoBack');
        $(document).off('click', '#btnContinue');

        $(document).on('click', '#btnGoBack', function () {
            if (!ns.isNavigating) {
                ns.isNavigating = true;
                if (app.viewModels.MyActionNeededViewModel.GuidedAction) {
                    ns._actionPageBackNavigation();
                }
            }
        });

        $(document).on('click', '#btnContinue', function () {
            if (!ns.isNavigating) {
                ns.isNavigating = true;
                if (app.viewModels.MyActionNeededViewModel.Alerts) {
                    ns._acionPageSubmitNavigation();
                }
            }
        });
    }
    ns._actionPageBackNavigation = function _actionPageBackNavigation() {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/MyActionNeededViewModel",
            dataType: "json",
            success: function (viewModel) {
                var serverViewModel = viewModel;
                if (app.viewModels.MyActionNeededViewModel.GuidedAction) {
                    app.viewModels.MyActionNeededViewModel.loadFromJSON(serverViewModel.MyActionNeededViewModel);
                    ns.navigateBasedOnNewAction(app.viewModels.MyActionNeededViewModel, window.location.pathname);

                } else {
                    ns.navigateBasedOnNewAction(MyActionNeededViewModel, window.location.pathname);
                }
            }
        });
    };


    ns._actionPageSubmitNavigation = function _acionPageSubmitNavigation() {
        (!ns.submittingPage)
        {
            ns.submittingPage = true;
        }
    };



    ns.beginGuidedTour = function beginGuidedTour(ANA) {
        app.functions.redirectToRelativeUrlFromSiteBase("my-action-guide.aspx");
    };



} (EXCHANGE));

