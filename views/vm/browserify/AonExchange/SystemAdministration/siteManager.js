(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.siteManager');
    app.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        ns.initializeSiteManager();
    });

    ns.initializeSiteManager = function initializeSiteManager() {
        ns.setupViewModels();
        ns.loadData();
        ns.wireupJqueryEvents();
    };

    ns.loadData = function loadData() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/GetSiteManagerViewModel",
            dataType: "json",
            success: function (data) {
                var siteManagerViewModel = data;
                if (siteManagerViewModel.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    app.viewModels.SiteManagerViewModel = app.viewModels.SiteManagerViewModel.loadFromJSON(siteManagerViewModel);
                }
            },
            error: function (data) {
                alert("Error in cache management loadData! Placeholder; a better error message is needed here!");
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.SiteManagerViewModel) {
            app.viewModels.SiteManagerViewModel = app.models.SiteManagerViewModel();

            ko.applyBindings(app.viewModels, $('#site-manager').get(0));
        }
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {

        $('#site-manager').on('click', '.onoffSubmit', function (e) {
            var onOroff = $(this).attr("id");
            if (onOroff == "On") {
                var result = confirm("Do you want to put Aon Exchange back online ?");
            } else {
                var result = confirm("Do you want to put Aon Exchange offline ?");
            }
            if (result == true) {
                app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });

                ns.submitOnOffRequest(onOroff);
            }
        });

    };

    ns.submitOnOffRequest = function submitOnOffRequest(action) {

        var siteManagerArgs = {
            ActionStatus: action
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/OnOffSiteManagerEntries",
            dataType: "json",
            data: JSON.stringify(siteManagerArgs),
            success: function (data) {
                var siteManagerValidation = data;
                if (siteManagerValidation.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {

                    app.viewModels.SiteManagerViewModel.ActionResult("Succeed!");
                    app.ButtonSpinner.Stop();                  
                }
            },
            error: function (data) {
                app.viewModels.SiteManagerViewModel.ActionResult("Failed!");
                app.ButtonSpinner.Stop();
            }
            
        });
    };

} (EXCHANGE));
