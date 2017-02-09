(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.cacheClearing');
    app.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        ns.initializeCacheClearing();
    });

    ns.initializeCacheClearing = function initializeCacheClearing() {
        ns.setupViewModels();
        ns.loadData();
        ns.wireupJqueryEvents();
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.CacheClearingViewModel) {
            app.viewModels.CacheClearingViewModel = app.models.CacheClearingViewModel();

            // The element with id "cache-clearing" is located in the webpart CacheClearing.ascx.
            ko.applyBindings(app.viewModels, $('#cache-clearing').get(0));
        }
    };

    ns.loadData = function loadData() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/GetCacheClearingViewModel",
            dataType: "json",
            success: function (data) {
                var cacheClearingViewModel = data;
                if (cacheClearingViewModel.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    app.viewModels.CacheClearingViewModel = app.viewModels.CacheClearingViewModel.loadFromJSON(cacheClearingViewModel);
                }
            },
            error: function (data) {
                alert("Error in cache clearing loadData! Placeholder; a better error message is needed here!");
            }
        });
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#cache-clearing').on('click', '.cacheClearSubmit', function (e) {
            var cacheGroupName = $(this).attr("id");
            ns.submitRequest(false, cacheGroupName);
        });

        $('#cache-clearing').on('click', '#clearAll', function (e) {
            ns.submitRequest(true);
        });
    };

    ns.submitRequest = function submitRequest(shouldClearAll, cacheGroupName) {
        // Note: cacheGroupName might be undefined; in that case, shouldClearAll should be true. 

        var cacheClearingArgs = {
            CacheGroup: cacheGroupName,
            ShouldClearAll: shouldClearAll
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/ClearCacheEntries",
            dataType: "json",
            data: JSON.stringify(cacheClearingArgs),
            success: function (data) {
                var cacheClearingValidation = data;
                if (cacheClearingValidation.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    // we must have validation errors here, which technically should never appear
                    // otherwise, just print a success message
                    // app.viewModels.CacheClearingViewModel.CacheKeys(cacheClearingValidation.CacheKeys);
                }
            },
            error: function (data) {
                alert("Error in cache clearing submit! Placeholder; a better error message is needed here!");
            }
        });
    };

} (EXCHANGE));
